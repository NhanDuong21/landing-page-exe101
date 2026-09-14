import { ui } from './ui'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Film, MessageSquare, RotateCcw, Send } from 'lucide-react'
import { images } from './config'
import { needs, profiles } from './demoData'
import { gsap, useDemoMotion, useProgressMotion } from './motion'
import { IllustratedPreview, type PreviewHandle } from './IllustratedPreview'
import { ProfileSheet } from './ProfileSheet'

export type DemoHandle = { start: (need?: string) => void }
type Props = { mobile: boolean; reduced: boolean; paused: boolean; onStep: (step: number) => void; beforeJump: () => void }
type Comment = { id: string; text: string; at: string; version: number }

export const Demo = forwardRef<DemoHandle, Props>(function Demo({ mobile, reduced, paused, onStep, beforeJump }, ref) {
  const [step, setStep] = useState(1)
  const [furthest, setFurthest] = useState(1)
  const [need, setNeed] = useState('product')
  const [duration, setDuration] = useState('30 giây')
  const [channel, setChannel] = useState('Reels / TikTok')
  const [selected, setSelected] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [version, setVersion] = useState(2)
  const [scene, setScene] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [seek, setSeek] = useState({ scene: 0, nonce: 0 })
  const [feedback, setFeedback] = useState('')
  const [timestamp, setTimestamp] = useState('00:08')
  const [comments, setComments] = useState<Comment[]>([])
  const [activeComment, setActiveComment] = useState('')
  const [commentStatus, setCommentStatus] = useState('')
  const body = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const preview = useRef<PreviewHandle>(null)
  const pendingFocus = useRef(false)
  const pendingScroll = useRef(false)
  const commentCount = useRef(0)
  const activeNeed = needs.find(n => n.id === need)!
  const activeProfile = profiles.find(p => p.id === selected)
  const endTime = duration === '15 giây' ? '00:12' : duration === '45 giây' ? '00:35' : '00:20'
  const signature = `${step}|${need}|${duration}|${channel}|${selected}|${expanded}|${version}|${comments.length}`
  const prepare = useDemoMotion(body, reduced, signature, step)
  useProgressMotion(step, furthest, reduced)

  useEffect(() => { if (paused || reduced) setPlaying(false) }, [paused, reduced])
  useEffect(() => { onStep(step) }, [step, onStep])
  useLayoutEffect(() => {
    if (pendingFocus.current) heading.current?.focus({ preventScroll: true })
    pendingFocus.current = false
    if (pendingScroll.current) document.querySelector('.demo-workspace')?.scrollIntoView({ block: 'start', behavior: 'instant' })
    pendingScroll.current = false
  }, [step])
  useLayoutEffect(() => {
    if (step !== 3) return
    const note = body.current?.querySelector('.version-note-copy')
    const ctx = gsap.context(() => { if (note && !reduced) gsap.fromTo(note, { y: 18, clipPath: 'inset(0 0 75% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: .6, ease: 'power3.out', clearProps: 'transform,clipPath' }) })
    return () => ctx.revert()
  }, [version, step, reduced])

  const navigate = (next: number, scroll = true, alreadyPrepared = false) => {
    if (next < 1 || next > 3 || (next === 3 && !selected)) return
    if (!alreadyPrepared) prepare()
    pendingScroll.current = scroll
    pendingFocus.current = true
    setStep(next); setFurthest(f => Math.max(f, next)); setPlaying(false); setExpanded(null)
    if (next === step) {
      heading.current?.focus({ preventScroll: true })
      if (scroll) document.querySelector('.demo-workspace')?.scrollIntoView({ block: 'start', behavior: 'instant' })
      pendingFocus.current = false; pendingScroll.current = false
    }
  }
  useImperativeHandle(ref, () => ({ start: chosen => {
    beforeJump(); prepare()
    if (chosen) setNeed(chosen)
    navigate(1, false, true)
    document.getElementById('demo')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
  } }))
  const reset = () => {
    prepare()
    setNeed('product'); setDuration('30 giây'); setChannel('Reels / TikTok'); setSelected(''); setExpanded(null)
    setVersion(2); setScene(0); setSeek(s => ({ scene: 0, nonce: s.nonce + 1 })); setPlaying(false)
    setFeedback(''); setTimestamp('00:08'); setComments([]); setActiveComment(''); setCommentStatus(''); setFurthest(1)
    navigate(1, true, true)
  }
  const chooseProfile = (id: string) => { prepare(); setSelected(id) }
  const chooseVersion = (value: number) => {
    if (value === version) return
    prepare(); preview.current?.prepareVersion()
    setVersion(value); setPlaying(false); setScene(0); setSeek(s => ({ scene: 0, nonce: s.nonce + 1 })); setActiveComment(''); setCommentStatus('')
  }
  const seekScene = (index: number) => {
    setPlaying(false); setScene(index); setSeek(s => ({ scene: index, nonce: s.nonce + 1 }))
    setTimestamp(index === 0 ? '00:00' : index === 1 ? '00:08' : endTime)
  }
  const openComment = (id: string, at: string, commentVersion: number) => {
    chooseVersion(commentVersion)
    setActiveComment(id)
    seekScene(at === '00:00' ? 0 : at === '00:08' ? 1 : 2)
  }
  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!feedback.trim()) { setCommentStatus('Vui lòng viết nội dung góp ý.'); return }
    prepare()
    const id = `comment-${++commentCount.current}`
    setComments(c => [...c, { id, text: feedback.trim(), at: timestamp, version }])
    setActiveComment(id); setFeedback('')
    setCommentStatus('Đã thêm góp ý vào bản xem thử. Chỉ lưu tạm trên trang, chưa gửi cho ai.')
  }
  const changeNeed = (id: string) => { prepare(); setNeed(id) }
  const showProfile = (id: string) => { prepare(); setExpanded(expanded === id ? null : id) }

  return <section id="demo" className={ui("demo-section section-space")}>
    <div className={ui("container")}>
      <div className={ui("section-heading")}><div><span className={ui("eyebrow")}>THỬ TRƯỚC KHI HÌNH DUNG XA HƠN</span><h2>Một món mới. Ba bước phối hợp.</h2></div><p>Quán Mộc muốn giới thiệu matcha latte.<br/>Bạn thử làm người gửi yêu cầu nhé.</p></div>
      <div className={ui("demo-workspace")}>
        <div className={ui("demo-topline")}><span><span className={ui("sample-pill")}>DEMO</span> Quán Mộc <span className={ui("muted")}>/ Tình huống hư cấu</span></span><button className={ui("text-button")} onClick={reset}><RotateCcw size={14}/> Làm lại</button></div>
        <ol className={ui("stepper")} aria-label="Tiến trình demo">
          {['Chọn nhu cầu', 'Chọn người phù hợp', 'Cùng góp ý bản nháp'].map((label, i) => <li key={label} className={ui(`${step === i + 1 ? 'active' : ''} ${furthest > i + 1 ? 'complete' : ''}`)}><button onClick={() => navigate(i + 1)} disabled={i + 1 > furthest} aria-current={step === i + 1 ? 'step' : undefined}><span className={ui(`step-number ${furthest > i + 1 ? 'step-complete' : ''}`)}>{furthest > i + 1 ? <Check size={15}/> : `0${i + 1}`}</span><span>{label}</span></button></li>)}
          <li className={ui("stepper-track")} aria-hidden="true"><span className={ui("stepper-fill")}/><span className={ui("stepper-indicator")}/></li>
        </ol>
        <div className={ui(`demo-content demo-body step-${step}`)} ref={body}>
          <aside className={ui("journey-rail")} aria-label="Tóm tắt công việc đang thử">
            <div className={ui("request-arrival")}>
              <div className={ui("journey-request")} data-flip-id="request">
                <div className={ui("journey-picture")} data-flip-id="request-picture"><img src={images.matcha} alt="Ảnh minh họa món matcha mới" loading="lazy"/><span>ẢNH MINH HỌA</span></div>
                <div className={ui("journey-copy")}><span className={ui("small-label")}><Film size={13}/> YÊU CẦU MẪU · QUÁN MỘC</span><h4>Giới thiệu matcha mới</h4><p className={ui("journey-summary")}>{activeNeed.style} <span>· {duration} · {channel}</span></p><div className={ui("journey-details")}><dl><div><dt>Định dạng</dt><dd>Video dọc · {duration}</dd></div><div><dt>Kênh đăng</dt><dd>{channel}</dd></div><div><dt>Phối hợp</dt><dd>Người được chọn quay & dựng</dd></div></dl><p>Tiền công, lịch quay và phạm vi chỉnh sửa cần được hai bên thống nhất khi triển khai thật.</p></div></div>
              </div>
            </div>
            {step === 3 && activeProfile && <><span className={ui("journey-connector")} aria-hidden="true"><ArrowRight size={18}/></span><div className={ui("creator-arrival")}><div className={ui("journey-creator")} data-flip-id={`creator-${activeProfile.id}`}><span className={ui(`avatar avatar-${activeProfile.id}`)} data-flip-id={`avatar-${activeProfile.id}`}>{activeProfile.initials}</span><div><span className={ui("small-label")}>ĐÃ CHỌN · HƯ CẤU</span><strong>{activeProfile.name}</strong><p>{activeProfile.title}</p></div><Check size={17}/></div></div></>}
          </aside>
          <div className={ui("step-panel")} key={step}>
            {step === 1 && <div className={ui("need-main")}><span className={ui("small-label")}>BƯỚC 01 / YÊU CẦU CỦA CỬA HÀNG</span><h3 ref={heading} tabIndex={-1}>Bạn muốn món mới được kể thế nào?</h3><p className={ui("muted")}>Chọn một hướng để xem hồ sơ phù hợp trong bản minh họa.</p>
              <fieldset className={ui("need-options")}><legend className={ui("sr-only")}>Chọn nhu cầu video</legend>{needs.map(n => <label className={ui(`need-option ${need === n.id ? 'selected' : ''}`)} key={n.id}><input type="radio" name="need" value={n.id} checked={need === n.id} onChange={() => changeNeed(n.id)}/><span className={ui("option-icon")}><n.icon size={22}/></span><span className={ui("option-copy")}><strong>{n.title}</strong><span>{n.description}</span></span><span className={ui("radio-indicator")}>{need === n.id && <Check size={12}/>}</span></label>)}</fieldset>
              <div className={ui("request-selects")}><label>Kênh đăng<select className={ui("control-select")} value={channel} onChange={e => { prepare(); setChannel(e.target.value) }}><option>Reels / TikTok</option><option>YouTube Shorts</option><option>Facebook Reels</option></select></label><label>Thời lượng mong muốn<select className={ui("control-select")} value={duration} onChange={e => { prepare(); setDuration(e.target.value); setTimestamp('00:08') }}><option>30 giây</option><option>15 giây</option><option>45 giây</option></select></label></div>
            </div>}
            {step === 2 && <div className={ui("profiles-view")}><div className={ui("view-heading")}><div><span className={ui("small-label")}>BƯỚC 02 / HỒ SƠ MINH HỌA</span><h3 ref={heading} tabIndex={-1}>Chọn một góc nhìn hợp với quán.</h3><p className={ui("muted")}>Yêu cầu đã được giữ lại ở thẻ phía trên. Bạn chọn người làm để cùng phối hợp.</p></div><span className={ui("outline-tag")}>3 hồ sơ hư cấu</span></div>
              <div className={ui("profile-grid")}>{profiles.map(p => <div className={ui("profile-slot")} key={p.id}><article data-flip-id={`creator-${p.id}`} className={ui(`profile ${selected === p.id ? 'chosen' : ''}`)}><div className={ui("profile-header")}><span className={ui(`avatar avatar-${p.id}`)} data-flip-id={`avatar-${p.id}`}>{p.initials}</span><div><span className={ui("small-label")}>{p.name} · MINH HỌA</span><h4>{p.title}</h4></div>{p.fits === need && <span className={ui("fit-tag")}>Hợp nhu cầu</span>}</div><p>{p.description}</p><div className={ui("skill-tags")}>{p.skills.map(s => <span key={s}>{s}</span>)}</div><button className={ui("profile-detail text-button")} aria-expanded={expanded === p.id} aria-controls={mobile ? undefined : `profile-detail-${p.id}`} aria-haspopup={mobile ? 'dialog' : undefined} onClick={() => showProfile(p.id)}>Xem cách phối hợp <ChevronDown size={16} className={ui(expanded === p.id ? 'rotate' : '')}/></button><div id={`profile-detail-${p.id}`} data-flip-id={`detail-${p.id}`} data-expanded={!mobile && expanded === p.id} aria-hidden={mobile || expanded !== p.id} className={ui("profile-expanded")}><strong>Hướng kịch bản đề xuất</strong><p>{p.work}</p><p>Trao đổi yêu cầu → thống nhất kịch bản → quay tại quán → dựng và nhận góp ý.</p></div><button className={ui(`button ${selected === p.id ? 'primary' : 'secondary'}`)} aria-pressed={selected === p.id} onClick={() => chooseProfile(p.id)}>{selected === p.id ? <><Check size={16}/> Đã chọn hồ sơ này</> : <>Chọn hồ sơ này <ArrowRight size={16}/></>}</button></article></div>)}</div>
              <p className={ui("illustration-note")}>Các hồ sơ không đại diện người thật, chưa có người đang nhận việc. Ảnh trên trang không thuộc các hồ sơ này.</p>
            </div>}
            {step === 3 && <div className={ui("review-view")}><div className={ui("view-heading")}><div><span className={ui("small-label")}>BƯỚC 03 / KHÔNG GIAN PHỐI HỢP</span><h3 ref={heading} tabIndex={-1}>Một bản nháp tốt bắt đầu từ trao đổi.</h3><p className={ui("muted")}>Yêu cầu và hồ sơ đã chọn cùng đi vào không gian góp ý.</p></div><span className={ui("outline-tag")}>Mô phỏng bản nháp</span></div>
              <div className={ui("review-layout")}>
                <IllustratedPreview ref={preview} version={version} scene={scene} playing={playing} reduced={reduced} endTime={endTime} seek={seek} onScene={setScene} onPlaying={setPlaying} onSeek={seekScene} onVersion={chooseVersion}/>
                <div className={ui("feedback-panel")}><div className={ui("version-note")}><div className={ui("version-note-copy")}><span className={ui("small-label")}>PHIÊN BẢN {version === 1 ? 'ĐẦU TIÊN' : 'ĐIỀU CHỈNH MẪU'}</span><h4>{version === 1 ? 'Mở đầu bằng không khí của quán' : 'Đưa món mới vào ngay mở đầu'}</h4><p>{version === 1 ? 'v1 bắt đầu ở không gian quán, dùng lời mở chung và chưa có phụ đề về món.' : 'v2 bắt đầu bằng cận cảnh matcha, đổi câu mở đầu và thêm phụ đề về món. Đây là phiên bản minh họa đã dựng sẵn.'}</p></div></div>
                  <div className={ui(`sample-comment ${activeComment === 'sample' ? 'comment-selected' : ''}`)} data-flip-id="sample-comment"><span className={ui("comment-avatar")}>M</span><div><div className={ui("comment-meta")}><strong>Quán Mộc</strong><button className={ui("comment-time")} aria-label="Xem góp ý mẫu tại 00:00 của bản nháp v1" onClick={() => openComment('sample', '00:00', 1)}>00:00 · v1 <ArrowUpRight size={12}/></button><span>góp ý mẫu</span></div><p>Cho món matcha xuất hiện ngay đầu và thêm phụ đề để xem không bật tiếng vẫn hiểu nhé.</p></div></div>
                  <div className={ui("your-comments")} aria-live="polite">{comments.filter(c => c.version === version).map(c => <div key={c.id} data-flip-id={c.id} className={ui(`sample-comment added-comment ${activeComment === c.id ? 'comment-selected' : ''}`)}><span className={ui("comment-avatar")}>B</span><div><div className={ui("comment-meta")}><strong>Bạn · xem thử</strong><button className={ui("comment-time")} aria-label={`Xem góp ý tại ${c.at} của bản nháp v${c.version}`} onClick={() => openComment(c.id, c.at, c.version)}>{c.at} · v{c.version}<ArrowUpRight size={12}/></button></div><p>{c.text}</p></div></div>)}</div>
                  <form className={ui("feedback-form")} data-flip-id="feedback-form" onSubmit={addComment}><div className={ui("feedback-form-top")}><label htmlFor="feedback">Góp ý cho bản nháp v{version}</label><label className={ui("timestamp-label")}><span className={ui("sr-only")}>Mốc thời gian góp ý</span><select className={ui("control-select")} value={timestamp} onChange={e => { const value = e.target.value; seekScene(value === '00:00' ? 0 : value === '00:08' ? 1 : 2) }}><option>00:00</option><option>00:08</option><option>{endTime}</option></select></label></div><textarea id="feedback" maxLength={500} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Ví dụ: Cho cận cảnh lớp matcha lâu hơn một chút…" rows={3} required/><button className={ui("button primary")} type="submit">Thêm góp ý mẫu <Send size={16}/></button><p className={ui("local-note")}>Chỉ lưu tạm trên trang, không gửi cho người khác.</p><p className={ui("form-status")} role="status">{commentStatus}</p></form>
                </div>
              </div>
            </div>}
          </div>
        </div>
        <div className={ui("demo-bottom")}><span>{step === 1 ? 'Chọn nhu cầu → xem hồ sơ minh họa' : step === 2 ? selected ? `${activeProfile?.name} đã được chọn để thử phối hợp.` : 'Chọn một hồ sơ để tiếp tục.' : 'Bạn đã thử quy trình phối hợp từ yêu cầu đến góp ý.'}</span><div>{step > 1 && <button className={ui("button secondary")} onClick={() => navigate(step - 1)}><ArrowLeft size={16}/> Quay lại</button>}{step < 3 ? <button className={ui("button primary")} disabled={step === 2 && !selected} onClick={() => navigate(step + 1)}>{step === 1 ? 'Xem hồ sơ minh họa' : 'Xem bản nháp mẫu'}<ArrowRight size={17}/></button> : <a className={ui("button primary")} href="#trial">Xem thử đăng ký <ArrowUpRight size={17}/></a>}</div></div>
      </div>
      <p className={ui("demo-caption")}><MessageSquare size={15}/> Một luồng để trao đổi rõ hơn. Mọi dữ liệu đều là minh họa, không phát sinh yêu cầu thuê.</p>
    </div>
    <ProfileSheet profile={profiles.find(p => p.id === expanded)} mobile={mobile} reduced={reduced} selected={selected} onClose={() => { prepare(); setExpanded(null) }} onSelect={chooseProfile}/>
  </section>
})
