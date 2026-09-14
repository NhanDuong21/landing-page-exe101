import { ui } from './ui'
import { useLayoutEffect, useRef } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import { gsap } from './motion'

type Profile = { id: string; name: string; initials: string; title: string; description: string; skills: string[]; work: string }
export function ProfileSheet({ profile, mobile, reduced, selected, onClose, onSelect }: { profile: Profile | undefined; mobile: boolean; reduced: boolean; selected: string; onClose: () => void; onSelect: (id: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const previous = useRef<Profile | undefined>(profile)
  if (profile) previous.current = profile
  const shown = profile ?? previous.current
  useLayoutEffect(() => {
    const el = dialog.current!
    const ctx = gsap.context(() => {
      if (!mobile) { if (el.open) el.close(); return }
      if (profile) {
        if (!el.open) el.showModal()
        gsap.fromTo(el, { yPercent: 100, '--sheet-backdrop': 0 }, { yPercent: 0, '--sheet-backdrop': 1, duration: reduced ? 0 : .55, ease: 'power3.out' })
        gsap.fromTo(el.querySelectorAll('.sheet-header, .sheet-body > *, .sheet-select'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : .4, stagger: reduced ? 0 : .055, delay: reduced ? 0 : .1, clearProps: 'opacity,transform' })
      } else if (el.open) gsap.to(el, { yPercent: 100, '--sheet-backdrop': 0, duration: reduced ? 0 : .32, ease: 'power3.in', onComplete: () => el.close() })
    })
    return () => ctx.revert()
  }, [profile, mobile, reduced])
  return <dialog ref={dialog} className={ui("profile-sheet")} aria-labelledby="sheet-title" onCancel={e => { e.preventDefault(); onClose() }} onClick={e => { if (e.target === e.currentTarget && e.clientY < e.currentTarget.getBoundingClientRect().top) onClose() }}>
    {shown && <><div className={ui("sheet-handle")} aria-hidden="true"/><div className={ui("sheet-header")}><span className={ui(`avatar avatar-${shown.id}`)}>{shown.initials}</span><div><span className={ui("small-label")}>{shown.name} · HƯ CẤU</span><h3 id="sheet-title">{shown.title}</h3></div><button className={ui("icon-button")} aria-label="Đóng hồ sơ minh họa" onClick={onClose}><X size={22}/></button></div><div className={ui("sheet-body")}><p>{shown.description}</p><div className={ui("skill-tags")}>{shown.skills.map(skill => <span key={skill}>{skill}</span>)}</div><h4>Hướng kịch bản đề xuất</h4><p>{shown.work}</p><p>Trao đổi yêu cầu → thống nhất kịch bản → quay tại quán → dựng và nhận góp ý.</p><p className={ui("local-note")}>Đây là hồ sơ minh họa, không có người đang nhận việc.</p></div><button className={ui("button primary sheet-select")} onClick={() => { onSelect(shown.id); onClose() }}>{selected === shown.id ? <><Check size={17}/> Đã chọn hồ sơ này</> : <>Chọn hồ sơ này <ArrowRight size={17}/></>}</button></>}
  </dialog>
}
