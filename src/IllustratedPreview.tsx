import { forwardRef, useImperativeHandle, useLayoutEffect, useEffect, useRef } from 'react'
import { Pause, Play } from 'lucide-react'
import { images } from './config'
import { gsap } from './motion'

export type PreviewHandle = { prepareVersion: () => void }
type Props = {
  version: number
  scene: number
  playing: boolean
  reduced: boolean
  endTime: string
  seek: { scene: number; nonce: number }
  onScene: (scene: number) => void
  onPlaying: (playing: boolean) => void
  onSeek: (scene: number) => void
  onVersion: (version: number) => void
}
const sceneLength = 3.4

/** A paused GSAP timeline is the clock, the crop and the captions of this slideshow. */
export const IllustratedPreview = forwardRef<PreviewHandle, Props>(function IllustratedPreview(props, ref) {
  const root = useRef<HTMLDivElement>(null)
  const clock = useRef<gsap.core.Timeline | null>(null)
  const scrub = useRef<gsap.core.Tween | null>(null)
  const transition = useRef<gsap.core.Timeline | null>(null)
  const outgoing = useRef<HTMLElement | null>(null)
  const indicatorContext = useRef<gsap.Context | null>(null)
  const callbacks = useRef(props)
  callbacks.current = props

  const finishTransition = () => {
    transition.current?.progress(1).kill()
    transition.current = null
    outgoing.current?.remove()
    outgoing.current = null
  }
  useImperativeHandle(ref, () => ({ prepareVersion: () => {
    finishTransition()
    scrub.current?.kill()
    clock.current?.pause()
    const stack = root.current?.querySelector<HTMLElement>('.preview-scene-stack')
    if (stack) {
      const copy = stack.cloneNode(true) as HTMLElement
      copy.classList.add('preview-outgoing')
      copy.setAttribute('aria-hidden', 'true')
      root.current?.querySelector('.draft-frame')?.appendChild(copy)
      outgoing.current = copy
    }
  } }))

  useLayoutEffect(() => {
    const el = root.current!
    const stack = el.querySelector<HTMLElement>('.preview-scene-stack')!
    let lastScene = -1
    const ctx = gsap.context(() => {
      // The outgoing version is a decorative copy. It must stay visible during
      // the wipe and must never become extra scenes on the slideshow clock.
      const frames = Array.from(stack.querySelectorAll<HTMLElement>('.preview-scene'))
      gsap.set(frames, { opacity: 0, clipPath: 'inset(0 0 0 0)' })
      gsap.set(frames[0], { opacity: 1 })
      const timeline = gsap.timeline({ paused: true,
        onUpdate: () => {
          const current = Math.min(2, Math.floor((timeline.time() + .001) / sceneLength))
          if (current !== lastScene) { lastScene = current; callbacks.current.onScene(current) }
        },
        onComplete: () => callbacks.current.onPlaying(false),
      })
      frames.forEach((frame, index) => {
        const media = frame.querySelector('.frame-media')!
        const caption = frame.querySelector('.draft-overlay')!
        const at = index * sceneLength
        if (index > 0) {
          timeline.fromTo(frame, { opacity: 1, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: props.reduced ? .01 : .7, ease: 'power3.inOut' }, at)
          timeline.fromTo(caption, { y: props.reduced ? 0 : 20, opacity: 0 }, { y: 0, opacity: 1, duration: props.reduced ? .01 : .65, ease: 'power3.out' }, at + .2)
        }
        timeline.fromTo(media, { scale: props.reduced ? 1 : [1.18, 1.12, 1.2][index], xPercent: props.reduced ? 0 : [-4, 3, 3][index], yPercent: props.reduced ? 0 : [3, -2, -3][index] }, { scale: props.reduced ? 1 : 1.035, xPercent: 0, yPercent: 0, duration: sceneLength, ease: 'none' }, at)
      })
      timeline.fromTo('.slideshow-progress', { scaleX: 0 }, { scaleX: 1, duration: sceneLength * 3, ease: 'none' }, 0)
      clock.current = timeline
      timeline.seek(callbacks.current.seek.scene * sceneLength + (callbacks.current.seek.scene > 0 ? .8 : 0), false)
      if (outgoing.current && !props.reduced) {
        transition.current = gsap.timeline({ onComplete: () => { outgoing.current?.remove(); outgoing.current = null } })
          .fromTo(stack, { xPercent: 18, clipPath: 'inset(0 0 0 100%)' }, { xPercent: 0, clipPath: 'inset(0 0 0 0%)', duration: .72, ease: 'power3.inOut', clearProps: 'transform,clipPath' }, 0)
          .to(outgoing.current, { xPercent: -18, opacity: 0, duration: .65, ease: 'power3.inOut' }, 0)
      } else outgoing.current?.remove()
    }, el)
    return () => { scrub.current?.kill(); clock.current?.kill(); ctx.revert() }
  }, [props.version, props.reduced])

  useEffect(() => {
    scrub.current?.kill()
    const timeline = clock.current
    if (!timeline) return
    if (props.playing) {
      if (timeline.progress() >= .999) timeline.restart()
      else timeline.play()
    } else timeline.pause()
  }, [props.playing, props.version, props.reduced])

  useEffect(() => {
    scrub.current?.kill()
    const timeline = clock.current
    if (!timeline) return
    timeline.pause()
    const time = props.seek.scene * sceneLength + (props.seek.scene > 0 ? .8 : 0)
    // Seeking advances the same clock; a second engine never controls the image.
    scrub.current = gsap.to(timeline, { time, duration: props.reduced ? 0 : .5, ease: 'power2.inOut', onComplete: () => callbacks.current.onScene(props.seek.scene) })
  }, [props.seek.nonce, props.reduced])

  useLayoutEffect(() => {
    indicatorContext.current = gsap.context(() => {}, root.current!)
    return () => { indicatorContext.current?.revert(); indicatorContext.current = null }
  }, [])
  useLayoutEffect(() => {
    const el = root.current!
    const update = () => {
      const button = el.querySelector<HTMLElement>(`.version-tabs button[data-version="${props.version}"]`)!
      indicatorContext.current?.add(() => gsap.to('.version-indicator', { x: button.offsetLeft, width: button.offsetWidth, duration: props.reduced ? 0 : .48, ease: 'power3.inOut', overwrite: true }))
    }
    update()
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('resize', update); gsap.killTweensOf(el.querySelector('.version-indicator')) }
  }, [props.version, props.reduced])
  useEffect(() => () => { finishTransition(); scrub.current?.kill(); clock.current?.kill() }, [])

  const frameTitles = [props.version === 1 ? 'Ghé Mộc hôm nay.' : 'Matcha mới. Thử một ngụm?', 'Một góc quen, một vị mới.', 'Hẹn bạn ở Mộc.']
  const frameImages = [props.version === 1 ? images.cafe : images.matcha, images.cafe, images.matcha]
  return <div className="draft-preview" ref={root}>
    <div className="version-tabs" role="group" aria-label="Chọn phiên bản bản nháp">
      <span className="version-indicator" aria-hidden="true"/>
      {[1, 2].map(v => <button key={v} data-version={v} aria-pressed={props.version === v} className={props.version === v ? 'active' : ''} onClick={() => props.onVersion(v)}>Bản nháp v{v}{v === 2 && <span>Mới hơn</span>}</button>)}
    </div>
    <div className={`draft-frame scene-${props.scene}`} data-scene={props.scene} data-playing={props.playing}>
      <div className="preview-scene-stack">
        {frameTitles.map((title, i) => <div className={`preview-scene preview-scene-${i}`} key={i} aria-hidden={props.scene !== i}>
          <img className="frame-media" src={frameImages[i]} alt={frameImages[i] === images.cafe ? 'Khung ảnh minh họa không gian quán' : 'Khung ảnh minh họa ly matcha'} loading="lazy"/>
          <div className="draft-overlay"><span>QUÁN MỘC / MÓN MỚI</span><strong>{title}</strong>{props.version === 2 && <p>{i === 2 ? 'Ghé quán, thưởng thức món mới.' : 'Matcha latte · thơm trà, dịu vị sữa'}</p>}</div>
        </div>)}
      </div>
      <span className="draft-corner">TRÌNH DIỄN ẢNH · v{props.version}</span>
      <button className="draft-play icon-button" aria-label={props.playing ? 'Tạm dừng trình diễn ảnh' : 'Phát trình diễn ảnh'} onClick={() => props.onPlaying(!props.playing)}>{props.playing ? <Pause fill="currentColor"/> : <Play fill="currentColor"/>}</button>
      <div className="slideshow-track" aria-hidden="true"><span className="slideshow-progress"/></div>
    </div>
    <div className="scene-controls" role="group" aria-label="Chọn cảnh minh họa">{['00:00 · Mở đầu', '00:08 · Không gian', `${props.endTime} · Kết`].map((label, i) => <button key={label} aria-pressed={props.scene === i} className={props.scene === i ? 'active' : ''} onClick={() => props.onSeek(i)}>{label}</button>)}</div>
    <p className="draft-disclaimer">Trình diễn ảnh có chuyển cảnh và chữ, chưa phải video được sản xuất. Các mốc là thời gian minh họa của bản nháp.</p>
  </div>
})
