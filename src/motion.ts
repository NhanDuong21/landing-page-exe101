import { ui } from './ui'
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)
export { gsap, ScrollTrigger, Flip }

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    media.addEventListener('change', update)
    update()
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

/** Intro/ambient wrappers and scroll wrappers never share transform ownership. */
export function usePageMotion(root: RefObject<HTMLDivElement | null>, reduced: boolean, paused: boolean, step: number) {
  const finishIntro = useRef<() => void>(() => {})
  const ambient = useRef<gsap.core.Timeline[]>([])
  const syncAmbient = useRef<() => void>(() => {})
  const pauseState = useRef(paused)
  pauseState.current = paused

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    let refreshFrame = 0
    let inView = false
    let introDone = false
    let artIntro: gsap.core.Timeline | undefined
    let titleIntro: gsap.core.Timeline | undefined
    let transit: HTMLElement | undefined
    let transitPortal: HTMLElement | undefined
    let resizeObserver: ResizeObserver | undefined
    let handoffProgress = 0
    let briefX = 0, briefY = 0
    const loops: { timeline: gsap.core.Timeline; element: HTMLElement; ready: () => boolean }[] = []
    const visibleTriggers: ScrollTrigger[] = []
    const ctx = gsap.context(() => {}, scope)
    ctx.add(() => {
      const hero = scope.querySelector<HTMLElement>('.hero')!
      const art = scope.querySelector<HTMLElement>('.hero-art')!
      const header = scope.querySelector<HTMLElement>('.site-header')!
      const source = scope.querySelector<HTMLElement>('.brief-source')!
      const sourceCard = source.querySelector<HTMLElement>('.brief-note')!
      const briefAmbient = source.querySelector<HTMLElement>('.brief-ambient')!
      const target = scope.querySelector<HTMLElement>('.request-arrival')!
      const request = scope.querySelector<HTMLElement>('.journey-request')!

      const updateAmbient = () => loops.forEach(({ timeline, element, ready }) => {
        const stopped = pauseState.current || document.hidden || !ready()
        if (timeline.paused() !== stopped) timeline.paused(stopped)
        element.dataset.ambientState = stopped ? 'paused' : 'running'
      })
      // Each target has one owner. Intro animates the frames; ambient moves
      // their outer depth wrappers and the images clipped inside those frames.
      const loop = (selector: string, peak: gsap.TweenVars, period: number, ready: () => boolean, delay = 0) => {
        const element = scope.querySelector<HTMLElement>(selector)!
        const timeline = gsap.timeline({ paused: true, repeat: -1, yoyo: true, delay })
          .to(element, { ...peak, duration: period / 2, ease: 'sine.inOut' })
        element.dataset.ambientPeriod = String(period)
        loops.push({ timeline, element, ready })
        ambient.current.push(timeline)
        return timeline
      }
      const watch = (element: HTMLElement, update: (visible: boolean) => void) => {
        const trigger = ScrollTrigger.create({ trigger: element, start: 'top bottom', end: 'bottom top',
          onToggle: self => { update(self.isActive); updateAmbient() },
          onRefresh: self => { update(self.isActive); updateAmbient() },
        })
        visibleTriggers.push(trigger)
        update(trigger.isActive)
      }
      syncAmbient.current = updateAmbient
      document.addEventListener('visibilitychange', updateAmbient)
      ctx.add(() => () => document.removeEventListener('visibilitychange', updateAmbient))
      finishIntro.current = () => {
        titleIntro?.progress(1)
        artIntro?.progress(1)
        if (!artIntro) gsap.set(['.cafe-frame', '.phone-frame', '.brief-note'], { clearProps: 'transform,opacity,visibility,clipPath' })
        introDone = true
        updateAmbient()
      }

      ScrollTrigger.create({
        trigger: hero, start: 'bottom top+=90',
        onToggle: self => header.classList.toggle('floating', self.progress > 0),
        onUpdate: self => header.classList.toggle('floating', self.progress > 0),
        end: 'max',
      })

      if (!reduced) {
        const lines = gsap.utils.toArray<HTMLElement>('.hero-title-lines:not(.title-hidden) .title-line', scope).filter(el => el.offsetParent !== null)
        titleIntro = gsap.timeline().fromTo(lines, { yPercent: 115, rotation: 2 }, { yPercent: 0, rotation: 0, duration: 1.05, stagger: .13, ease: 'power4.out', clearProps: 'transform' }, .1)
          .fromTo('.hero-copy > .eyebrow', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: .7, clearProps: 'transform,opacity' }, .25)

        gsap.set('.cafe-frame', { x: -45, clipPath: 'inset(0 100% 0 0 round 10px)' })
        gsap.set('.phone-frame', { y: 115, scale: .84, opacity: 0, rotation: 5 })
        gsap.set('.brief-note', { x: -28, y: 35, scale: .92, opacity: 0, rotation: -4 })
        const heroReady = () => inView && introDone
        loop('.cafe-depth', { y: -18, x: 8 }, 12.4, heroReady)
        loop('.phone-depth', { y: 20, x: -10 }, 10.6, heroReady, .25)
        loop('.brief-ambient', { y: -12, x: 5 }, 9.2, () => heroReady() && handoffProgress <= .003, .55)
        loop('.hero-art .cafe-frame > img', { scale: 1.14, xPercent: 2, yPercent: -2 }, 13.6, heroReady, .15)
        loop('.hero-art .phone-frame > img', { scale: 1.16, xPercent: -2, yPercent: 2.5 }, 11.8, heroReady, .4)
        const openArt = () => {
          if (introDone || artIntro) return
          artIntro = gsap.timeline({ onComplete: () => { introDone = true; updateAmbient() } })
            .to('.cafe-frame', { x: 0, clipPath: 'inset(0 0% 0 0 round 10px)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath,transform' }, 0)
            .to('.phone-frame', { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 1.15, ease: 'power3.out', clearProps: 'transform,opacity' }, .26)
            .to('.brief-note', { keyframes: [{ x: 8, y: -7, scale: 1.015, rotation: 1, opacity: 1, duration: .46 }, { x: 0, y: 0, scale: 1, rotation: 0, duration: .36 }], ease: 'power2.out', clearProps: 'transform,opacity' }, .7)
          if (pauseState.current) finishIntro.current()
        }
        const artTrigger = ScrollTrigger.create({
          trigger: art, start: 'top bottom-=60', end: 'bottom top+=60',
          onToggle: self => { inView = self.isActive; if (inView) ctx.add(openArt); updateAmbient() },
        })
        inView = artTrigger.isActive
        if (inView) openArt()
        updateAmbient()

        // A document-positioned copy travels only during this short natural scroll.
        // It is decorative: scroll callbacks do not touch any React demo state.
        transit = sourceCard.cloneNode(true) as HTMLElement
        transit.className = ui(transit.className + ' request-transit')
        transit.setAttribute('aria-hidden', 'true')
        transit.removeAttribute('id')
        transitPortal = document.createElement('div')
        transitPortal.className = ui('request-transit-portal')
        transitPortal.setAttribute('aria-hidden', 'true')
        transitPortal.appendChild(transit)
        document.body.appendChild(transitPortal)
        let sx = 0, sy = 0, tx = 0, ty = 0, sw = 0, tw = 0, start = 0
        const measure = () => {
          const a = source.getBoundingClientRect(), b = request.querySelector<HTMLElement>('.journey-copy')!.getBoundingClientRect()
          sx = a.left + window.scrollX; sy = a.top + window.scrollY
          tx = b.left + window.scrollX; ty = b.top + window.scrollY
          sw = a.width; tw = Math.min(b.width, sw * .95)
          start = Math.max(30, hero.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 80)
          gsap.set(transit!, { left: sx, top: sy, width: sw, height: a.height, x: 0, y: 0, scale: 1, rotation: 0, opacity: 0 })
        }
        const render = (progress: number) => {
          if (handoffProgress <= .003 && progress > .003) {
            // Capture the floating offset once at departure, then freeze its
            // wrapper. The scroll copy starts exactly where the card was.
            briefX = Number(gsap.getProperty(briefAmbient, 'x')) || 0
            briefY = Number(gsap.getProperty(briefAmbient, 'y')) || 0
          }
          handoffProgress = progress
          updateAmbient()
          const p = gsap.parseEase('power2.inOut')(progress)
          const blend = gsap.utils.clamp(0, 1, (progress - .82) / .18)
          const visible = progress > .003 && progress < .997
          gsap.set(transit!, { x: (tx - sx) * p + briefX * (1 - p) + Math.sin(p * Math.PI) * 30 - window.scrollX, y: (ty - sy) * p + briefY * (1 - p) - window.scrollY, width: sw + (tw - sw) * p, height: source.offsetHeight + (94 - source.offsetHeight) * p, rotation: Math.sin(p * Math.PI) * 3, scale: 1 - p * .05 - Math.sin(p * Math.PI) * .06, opacity: visible ? 1 - blend : 0 })
          gsap.set(transit!.querySelector('p'), { opacity: Math.max(0, 1 - p * 1.4) })
          gsap.set(source, { opacity: progress > .003 ? 0 : 1 })
          // Separate arrival wrapper keeps Flip free to move the actual request.
          gsap.set(target, { opacity: .14 + .86 * blend })
        }
        measure()
        const handoff = ScrollTrigger.create({ start: () => start, end: () => start + (window.innerWidth <= 760 ? 320 : 300), invalidateOnRefresh: true,
          onRefreshInit: measure, onRefresh: self => render(self.progress),
          onUpdate: self => { if (self.progress > 0 && !introDone) finishIntro.current(); render(self.progress) },
        })
        render(handoff.progress)
        resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(refreshFrame)
          refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
        })
        // The workspace changes height during Flip; only observe the stable section heading/hero.
        resizeObserver.observe(hero)

        let creatorVisible = false, creatorRevealed = false
        watch(scope.querySelector<HTMLElement>('.creator-visual')!, visible => { creatorVisible = visible })
        loop('.creator-visual > img', { scale: 1.15, xPercent: -2.5, yPercent: 1.5 }, 12.8, () => creatorVisible && creatorRevealed)
        gsap.utils.toArray<HTMLElement>('.type-image, .creator-visual', scope).forEach((el, i) => {
          gsap.fromTo(el, { clipPath: 'inset(14% 0 10% 0 round 12px)', y: 42 }, { clipPath: 'inset(0% 0 0% 0 round 8px)', y: 0, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }, delay: i < 3 ? i * .1 : 0, clearProps: 'clipPath,transform', onComplete: () => { if (el.classList.contains('creator-visual')) { creatorRevealed = true; updateAmbient() } } })
        })
        let trialVisible = false, trialAssembled = false
        watch(scope.querySelector<HTMLElement>('.trial-assembly')!, visible => { trialVisible = visible })
        const trialReady = () => trialVisible && trialAssembled
        loop('.trial-piece-quan > img', { scale: 1.2, xPercent: 3, yPercent: -2 }, 10.8, trialReady)
        loop('.trial-piece-matcha > img', { scale: 1.22, xPercent: -3, yPercent: 2 }, 9.8, trialReady, .35)
        gsap.utils.toArray<HTMLElement>('.trial-piece', scope).forEach((el, i) => {
          gsap.fromTo(el, { x: [-70, 55, -30][i], y: [65, 90, -45][i], rotation: [-24, 23, -18][i], scale: .72, opacity: .15 }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', onUpdate: i === 2 ? function (this: gsap.core.Tween) { trialAssembled = this.progress() >= .999; updateAmbient() } : undefined, scrollTrigger: { trigger: '.trial-heading-stage', start: 'top 90%', end: 'top 48%', scrub: .55 } })
        })
        updateAmbient()
      }

      const animateButton = (event: Event, entering: boolean) => {
        const button = (event.target as HTMLElement).closest<HTMLElement>('.button, .nav-cta')
        if (!button || !scope.contains(button) || button.matches(':disabled')) return
        if (event instanceof PointerEvent && event.relatedTarget instanceof Node && button.contains(event.relatedTarget)) return
        const arrow = button.querySelector('svg:last-child')
        ctx.add(() => {
          gsap.to(button, { '--cta-fill': entering ? '100%' : '0%', duration: reduced ? 0 : .45, ease: 'power3.out', overwrite: true })
          if (arrow) gsap.to(arrow, { x: entering ? 4 : 0, duration: reduced ? 0 : .35, overwrite: true })
        })
      }
      const enter = (event: Event) => animateButton(event, true)
      const leave = (event: Event) => animateButton(event, false)
      scope.addEventListener('pointerover', enter); scope.addEventListener('focusin', enter); scope.addEventListener('pointerdown', enter)
      scope.addEventListener('pointerout', leave); scope.addEventListener('focusout', leave); scope.addEventListener('pointerup', leave)
      ctx.add(() => () => { scope.removeEventListener('pointerover', enter); scope.removeEventListener('focusin', enter); scope.removeEventListener('pointerdown', enter); scope.removeEventListener('pointerout', leave); scope.removeEventListener('focusout', leave); scope.removeEventListener('pointerup', leave) })
    })
    return () => {
      resizeObserver?.disconnect(); cancelAnimationFrame(refreshFrame)
      visibleTriggers.forEach(trigger => trigger.kill())
      loops.forEach(({ element }) => { delete element.dataset.ambientState; delete element.dataset.ambientPeriod })
      transitPortal?.remove(); ctx.revert(); ambient.current = []; finishIntro.current = () => {}; syncAmbient.current = () => {}
    }
  }, [root, reduced])

  useEffect(() => {
    if (paused) finishIntro.current()
    syncAmbient.current()
  }, [paused])
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [step])
  return finishIntro
}

export function useMenuMotion(open: boolean, mobile: boolean, reduced: boolean) {
  const context = useRef<gsap.Context | null>(null)
  const sequence = useRef<gsap.core.Animation | null>(null)
  useLayoutEffect(() => {
    context.current = gsap.context(() => {})
    return () => { context.current?.revert(); context.current = null }
  }, [])
  useLayoutEffect(() => {
    const nav = document.getElementById('navigation')!
    sequence.current?.kill()
    context.current?.add(() => {
      if (!mobile) { gsap.set(nav, { clearProps: 'height,opacity,visibility,paddingTop,paddingBottom' }); gsap.set(nav.children, { clearProps: 'transform,opacity' }); return }
      if (open) {
        sequence.current = gsap.timeline().to(nav, { height: 'auto', autoAlpha: 1, paddingTop: 8, paddingBottom: 20, duration: reduced ? 0 : .45, ease: 'power3.out' })
          .fromTo(nav.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : .35, stagger: reduced ? 0 : .06, ease: 'power2.out' }, .08)
      } else sequence.current = gsap.timeline().to(nav.children, { y: -7, opacity: 0, duration: reduced ? 0 : .17, stagger: reduced ? 0 : { each: .025, from: 'end' } }, 0).to(nav, { height: 0, autoAlpha: 0, paddingTop: 0, paddingBottom: 0, duration: reduced ? 0 : .3, ease: 'power2.inOut' }, .03)
    })
    // Cancel at the current position rather than restoring the closed start frame.
    return () => { sequence.current?.kill() }
  }, [open, mobile, reduced])
}

const flipSelector = '[data-flip-id]'
export function useDemoMotion(root: RefObject<HTMLDivElement | null>, reduced: boolean, signature: string, step: number) {
  const state = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const previousStep = useRef(step)
  const previousHeight = useRef(0)
  const running = useRef<gsap.core.Animation[]>([])
  const cleanups = useRef<gsap.Context[]>([])
  const prepare = () => {
    running.current.forEach(t => { t.progress(1); t.kill() })
    running.current = []
    cleanups.current.forEach(context => context.kill(false))
    cleanups.current = []
    const el = root.current
    if (!el || reduced) return
    gsap.set(el, { clearProps: 'height' })
    previousHeight.current = el.getBoundingClientRect().height
    state.current = Flip.getState(el.querySelectorAll(flipSelector), { props: 'borderRadius,opacity' })
  }
  useLayoutEffect(() => {
    const el = root.current
    if (!el || !state.current || reduced) { previousStep.current = step; state.current = null; return }
    const snapshot = state.current
    state.current = null
    const changedStep = step !== previousStep.current
    const direction = step >= previousStep.current ? 1 : -1
    previousStep.current = step
    const ctx = gsap.context(() => {
      const naturalHeight = el.getBoundingClientRect().height
      const holders = Array.from(el.querySelectorAll<HTMLElement>('.request-arrival, .creator-arrival, .profile-slot'))
      holders.forEach(holder => gsap.set(holder, { height: holder.getBoundingClientRect().height }))
      const flip = Flip.from(snapshot, {
        targets: el.querySelectorAll(flipSelector), duration: .72, ease: 'power3.inOut', nested: true, prune: true,
        absolute: el.querySelectorAll('.journey-request, .journey-creator, .profile'),
        onEnter: elements => gsap.fromTo(elements, { y: 28, opacity: 0, scale: .97 }, { y: 0, opacity: 1, scale: 1, duration: .55, stagger: .06, ease: 'power3.out', clearProps: 'opacity,transform' }),
        onComplete: () => { gsap.set(holders, { clearProps: 'height' }); ScrollTrigger.refresh() },
      })
      running.current.push(flip)
      // Step controls sit outside the moving panel. Commit the new panel height
      // immediately so a fast second tap never chases a travelling navigation bar.
      if (!changedStep && Math.abs(naturalHeight - previousHeight.current) > 2) running.current.push(gsap.fromTo(el, { height: previousHeight.current }, { height: naturalHeight, duration: .72, ease: 'power3.inOut', clearProps: 'height' }))
      if (changedStep) {
        const panel = el.querySelector('.step-panel')!
        running.current.push(gsap.fromTo(panel, { x: direction * 34, clipPath: direction > 0 ? 'inset(0 0 0 8%)' : 'inset(0 8% 0 0)' }, { x: 0, clipPath: 'inset(0 0 0 0)', duration: .7, ease: 'power3.out', clearProps: 'transform,clipPath' }))
        running.current.push(gsap.fromTo(panel.querySelectorAll('.view-heading, .need-main > .small-label, .need-main > h3, .need-option, .review-layout'), { y: 24, opacity: .25 }, { y: 0, opacity: 1, duration: .55, stagger: .055, delay: .12, ease: 'power3.out', clearProps: 'transform,opacity' }))
      }
    }, el)
    cleanups.current.push(ctx)
  }, [signature, step, reduced, root])
  useEffect(() => {
    const finish = () => running.current.forEach(t => t.progress(1))
    window.addEventListener('resize', finish)
    return () => { window.removeEventListener('resize', finish); running.current.forEach(t => t.kill()); cleanups.current.forEach(c => c.revert()) }
  }, [])
  useEffect(() => {
    if (reduced) { running.current.forEach(t => { t.progress(1); t.kill() }); state.current = null }
  }, [reduced])
  return prepare
}

export function useProgressMotion(step: number, furthest: number, reduced: boolean) {
  const context = useRef<gsap.Context | null>(null)
  const seenChecks = useRef(new WeakSet<Element>())
  useLayoutEffect(() => {
    context.current = gsap.context(() => {}, document.querySelector('.stepper')!)
    return () => { context.current?.revert(); context.current = null }
  }, [])
  useLayoutEffect(() => {
    const bar = document.querySelector<HTMLElement>('.stepper')!
    const update = () => {
      const active = bar.querySelector<HTMLElement>('.active')!
      context.current?.add(() => {
        gsap.to(bar.querySelector('.stepper-indicator'), { x: active.offsetLeft, width: active.offsetWidth, duration: reduced ? 0 : .6, ease: 'power3.inOut', overwrite: true })
        gsap.to(bar.querySelector('.stepper-fill'), { scaleX: (furthest - 1) / 2, duration: reduced ? 0 : .65, ease: 'power3.inOut', overwrite: true })
      })
    }
    update()
    const checks = Array.from(bar.querySelectorAll('.step-complete svg')).filter(check => !seenChecks.current.has(check))
    checks.forEach(check => seenChecks.current.add(check))
    if (checks.length) context.current?.add(() => gsap.fromTo(checks, { scale: .4, rotation: -60 }, { scale: 1, rotation: 0, duration: reduced ? 0 : .5, ease: 'back.out(1.8)' }))
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('resize', update); gsap.killTweensOf(bar.querySelectorAll('.stepper-indicator,.stepper-fill')) }
  }, [step, furthest, reduced])
}
