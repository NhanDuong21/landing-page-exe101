import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, ArrowRight, ArrowLeft, Check, ChevronDown, Clapperboard, Coffee, Film, Menu, MessageSquare, Pause, Play, RotateCcw, Send, Sparkles, Store, Video, X } from 'lucide-react'
import { images, SITE_NAME, sources } from './config'
import { useSampleDemoTool } from './useSampleDemoTool'

const needs = [
  { id: 'product', title: 'Làm nổi bật món mới', description: 'Cận cảnh matcha, lớp sữa và khoảnh khắc thưởng thức.', icon: Coffee, style: 'Cận cảnh sản phẩm' },
  { id: 'story', title: 'Kể câu chuyện của quán', description: 'Từ góc quầy pha chế đến ly matcha trên bàn.', icon: Store, style: 'Câu chuyện không gian' },
  { id: 'review', title: 'Trải nghiệm một cách tự nhiên', description: 'Một người dẫn chuyện thử món và chia sẻ cảm nhận.', icon: Video, style: 'Có người dẫn chuyện' },
]
const profiles = [
  { id: 'a', name: 'Hồ sơ A', initials: 'A', title: 'Góc nhìn ẩm thực', tag: 'Cận cảnh sản phẩm', description: 'Tập trung vào chất liệu, ánh sáng và chuyển động của đồ uống.', skills: ['Quay tại quán', 'Dựng video dọc'], work: 'Cận cảnh món → pha chế → thành phẩm', fits: 'product' },
  { id: 'b', name: 'Hồ sơ B', initials: 'B', title: 'Kể chuyện không gian', tag: 'Câu chuyện không gian', description: 'Kết nối món mới với nhịp sống và những góc nhỏ trong quán.', skills: ['Kịch bản ngắn', 'Quay & dựng'], work: 'Không gian → câu chuyện → món mới', fits: 'story' },
  { id: 'c', name: 'Hồ sơ C', initials: 'C', title: 'Trải nghiệm có lời kể', tag: 'Có người dẫn chuyện', description: 'Dẫn dắt bằng lời kể gần gũi, có phụ đề dễ theo dõi.', skills: ['Dẫn chuyện', 'Dựng & phụ đề'], work: 'Mở lời → thử món → cảm nhận', fits: 'review' },
]
const videoTypes = [
  { number: '01', title: 'Món mới, góc nhìn mới.', label: 'GIỚI THIỆU SẢN PHẨM', image: images.matcha, alt: 'Ly matcha sữa đá trong ánh nắng', description: 'Để người xem hình dung hương vị qua những chi tiết nhỏ.', need: 'product' },
  { number: '02', title: 'Một lý do để ghé quán.', label: 'KHÔNG GIAN & CÂU CHUYỆN', image: images.cafe, alt: 'Không gian quán với ghế gỗ và cây xanh', description: 'Ghi lại không gian, con người và câu chuyện phía sau quầy.', need: 'story' },
  { number: '03', title: 'Từ nguyên liệu đến thành phẩm.', label: 'HẬU TRƯỜNG PHA CHẾ', image: images.pouring, alt: 'Cận cảnh rót sữa vào cà phê', description: 'Những công đoạn quen thuộc cũng có thể trở thành nội dung.', need: 'product' },
]
const faqs = [
  ['Nền tảng này có phải một đội nhận quay video?', 'Ý tưởng của nhóm là xây nơi kết nối và phối hợp công việc. Người làm nội dung được cửa hàng lựa chọn sẽ trực tiếp sản xuất video. Nhóm phát triển nền tảng không nhận quay tất cả yêu cầu.'],
  ['Tôi có thể thuê người làm nội dung ngay bây giờ?', 'Chưa. Đây là bản concept EXE101 để thảo luận ý tưởng và thử trải nghiệm. Tất cả hồ sơ, yêu cầu và bản nháp trên trang đều là dữ liệu minh họa; không có người đang nhận việc hoặc giao dịch thực tế.'],
  ['Cửa hàng cần chuẩn bị gì trước khi làm video?', 'Nên xác định món muốn giới thiệu, người xem mục tiêu, phong cách, thời lượng, kênh đăng và thời điểm mong muốn. Khi triển khai thật, hai bên cần thống nhất cả số lần chỉnh sửa, nội dung bàn giao và quyền sử dụng video.'],
  ['Tiền công và phí nền tảng được tính thế nào?', 'Tiền công sản xuất dự kiến do cửa hàng và người làm nội dung thống nhất theo phạm vi công việc. Phí nền tảng là khoản riêng để hỗ trợ kết nối và phối hợp. Nhóm chưa chốt mức phí, cách thu hay chính sách thương mại.'],
  ['Ảnh và hồ sơ minh họa trên trang đến từ đâu?', 'Ảnh được sử dụng theo giấy phép Unsplash, có nguồn ở cuối trang. Hồ sơ A, B, C là nhân vật hư cấu để thử luồng lựa chọn. Các ảnh không phải sản phẩm của những hồ sơ này.'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
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
  const [feedback, setFeedback] = useState('')
  const [timestamp, setTimestamp] = useState('00:08')
  const [comments, setComments] = useState<{ text: string; at: string; version: number }[]>([])
  const [commentStatus, setCommentStatus] = useState('')
  const [role, setRole] = useState('store')
  const [registrationPreview, setRegistrationPreview] = useState<{ name: string; email: string; role: string } | null>(null)
  const demoHeading = useRef<HTMLHeadingElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const activeNeed = needs.find(n => n.id === need)!
  const activeProfile = profiles.find(p => p.id === selected)
  const endTime = duration === '15 giây' ? '00:12' : duration === '45 giây' ? '00:35' : '00:20'

  useEffect(() => {
    if (!playing) return
    if (scene >= 2) { setPlaying(false); return }
    const timer = window.setTimeout(() => setScene(s => s + 1), 2400)
    return () => window.clearTimeout(timer)
  }, [playing, scene])
  useEffect(() => {
    if (!menuOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [menuOpen])
  useEffect(() => {
    if (registrationPreview) previewRef.current?.focus()
  }, [registrationPreview])

  const navigateStep = (next: number, scroll = true) => {
    setStep(next)
    setFurthest(f => Math.max(f, next))
    setPlaying(false)
    window.setTimeout(() => {
      demoHeading.current?.focus({ preventScroll: true })
      if (scroll) document.querySelector('.demo-workspace')?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }, 0)
  }
  const startDemo = (chosenNeed?: string) => {
    if (chosenNeed) setNeed(chosenNeed)
    navigateStep(1, false)
    setMenuOpen(false)
    document.getElementById('demo')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const resetDemo = () => {
    setNeed('product'); setDuration('30 giây'); setChannel('Reels / TikTok'); setTimestamp('00:08'); setSelected(''); setVersion(2); setScene(0); setExpanded(null); setComments([]); setFeedback(''); setCommentStatus(''); setFurthest(1); navigateStep(1)
  }
  const addComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!feedback.trim()) { setCommentStatus('Vui lòng viết nội dung góp ý.'); return }
    setComments(c => [...c, { text: feedback.trim(), at: timestamp, version }])
    setFeedback('')
    setCommentStatus('Góp ý đã được thêm vào bản xem thử, chỉ lưu tạm trên trang này.')
  }
  const previewRegistration = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nameInput = e.currentTarget.elements.namedItem('name') as HTMLInputElement
    if (!nameInput.value.trim()) {
      nameInput.setCustomValidity('Vui lòng nhập tên có nội dung.'); nameInput.reportValidity(); return
    }
    const data = new FormData(e.currentTarget)
    setRegistrationPreview({ name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), role: role === 'store' ? 'Cửa hàng' : 'Người làm nội dung' })
  }

  useSampleDemoTool(startDemo)

  return <>
    <a className="skip-link" href="#main">Đi đến nội dung chính</a>
    <div className="concept-bar"><div className="container flex items-center justify-between gap-4"><span>BẢN CONCEPT <span className="bar-separator">/</span> EXE101</span><span>Ý tưởng để cùng thử. Chưa mở giao dịch.</span></div></div>
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#" aria-label={`${SITE_NAME} — về đầu trang`}><span className="brand-icon"><Play size={19} fill="currentColor" strokeWidth={0}/></span><span>{SITE_NAME}<span className="brand-period">.</span></span></a>
        <button ref={menuButton} className="menu-toggle icon-button" aria-expanded={menuOpen} aria-controls="navigation" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        <nav id="navigation" className={menuOpen ? 'nav open' : 'nav'} aria-label="Điều hướng chính">
          <a href="#demo" onClick={() => setMenuOpen(false)}>Trải nghiệm mẫu</a>
          <a href="#creator" onClick={() => setMenuOpen(false)}>Dành cho creator</a>
          <a href="#fees" onClick={() => setMenuOpen(false)}>Cách tính phí</a>
          <a href="#trial" className="nav-cta" onClick={() => setMenuOpen(false)}>Tham gia thử nghiệm <ArrowUpRight size={17}/></a>
        </nav>
      </div>
    </header>
    <main id="main">
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow"><span className="short-line"/> CỬA HÀNG GẶP GÓC NHÌN MỚI</span>
          <h1>Tìm người làm video phù hợp với <span>cửa hàng của bạn.</span></h1>
          <p>Một nơi để tìm người trực tiếp sản xuất video, thống nhất yêu cầu và cùng theo dõi từng bản nháp.</p>
          <div className="hero-actions"><button className="button primary" onClick={() => startDemo()}>Thử một yêu cầu mẫu <ArrowRight size={18}/></button><a className="button secondary" href="#creator">Tôi là người làm nội dung <ArrowUpRight size={17}/></a></div>
          <div className="hero-note"><Clapperboard size={17}/><span>Không cần tài khoản. Toàn bộ trải nghiệm là minh họa.</span></div>
        </div>
        <div className="hero-art" aria-label="Minh họa quá trình từ một quán đến video giới thiệu món mới">
          <figure className="cafe-frame"><img src={images.cafe} alt="Góc quán có cây xanh và bàn ghế gỗ" width="1600" height="1200"/><figcaption><Store size={14}/> KHÔNG GIAN QUÁN</figcaption></figure>
          <div className="phone-frame"><img src={images.matcha} alt="Ly matcha sữa đá được dùng làm hình minh họa video dọc" width="1600" height="2400"/><span className="phone-label">KHUNG VIDEO MINH HỌA</span><div className="phone-copy"><span>MÓN MỚI CỦA QUÁN</span><strong>Một chút xanh.<br/>Một ngày dịu lại.</strong><div><span className="play-disc"><Film size={16}/></span><span>Matcha latte <span className="slash">/</span> 9:16</span></div></div></div>
          <div className="brief-note"><span className="brief-icon"><Film size={20}/></span><div><span>YÊU CẦU MẪU</span><strong>Giới thiệu matcha mới</strong><p>Từ ý tưởng đến bản nháp, cùng một nơi.</p></div><Check size={17}/></div>
          <span className="art-footnote">Ảnh nguồn Unsplash · Không phải sản phẩm của creator</span>
        </div>
      </section>

      <section id="demo" className="demo-section section-space">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">THỬ TRƯỚC KHI HÌNH DUNG XA HƠN</span><h2>Một món mới. Ba bước phối hợp.</h2></div><p>Quán Mộc muốn giới thiệu matcha latte.<br/>Bạn thử làm người gửi yêu cầu nhé.</p></div>
          <div className="demo-workspace">
            <div className="demo-topline"><span><span className="sample-pill">DEMO</span> Quán Mộc <span className="muted">/ Tình huống hư cấu</span></span><button className="text-button" onClick={resetDemo}><RotateCcw size={14}/> Làm lại</button></div>
            <ol className="stepper" aria-label="Tiến trình demo">{['Chọn nhu cầu', 'Chọn người phù hợp', 'Cùng góp ý bản nháp'].map((label, i) => <li key={label} className={step === i + 1 ? 'active' : step > i + 1 ? 'complete' : ''}><button onClick={() => navigateStep(i + 1)} disabled={i + 1 > furthest} aria-current={step === i + 1 ? 'step' : undefined}><span className="step-number">{step > i + 1 ? <Check size={15}/> : `0${i + 1}`}</span><span>{label}</span></button></li>)}</ol>
            <div className="demo-content" key={step}>
              {step === 1 && <div className="need-layout">
                <div className="need-main"><span className="small-label">BƯỚC 01 / YÊU CẦU CỦA CỬA HÀNG</span><h3 ref={demoHeading} tabIndex={-1}>Bạn muốn món mới được kể thế nào?</h3><p className="muted">Chọn một hướng để xem hồ sơ phù hợp trong bản minh họa.</p>
                  <fieldset className="need-options"><legend className="sr-only">Chọn nhu cầu video</legend>{needs.map(n => <label className={`need-option ${need === n.id ? 'selected' : ''}`} key={n.id}><input type="radio" name="need" value={n.id} checked={need === n.id} onChange={() => setNeed(n.id)}/><span className="option-icon"><n.icon size={22}/></span><span className="option-copy"><strong>{n.title}</strong><span>{n.description}</span></span><span className="radio-indicator">{need === n.id && <Check size={12}/>}</span></label>)}</fieldset>
                  <div className="request-selects"><label>Kênh đăng<select value={channel} onChange={e => setChannel(e.target.value)}><option>Reels / TikTok</option><option>YouTube Shorts</option><option>Facebook Reels</option></select></label><label>Thời lượng mong muốn<select value={duration} onChange={e => { setDuration(e.target.value); setTimestamp('00:08') }}><option>30 giây</option><option>15 giây</option><option>45 giây</option></select></label></div>
                </div>
                <aside className="request-preview"><div className="request-image"><img src={images.matcha} alt="Ảnh minh họa món matcha mới của tình huống mẫu" loading="lazy"/><span>ẢNH MINH HỌA</span></div><div className="request-preview-copy"><span className="small-label">YÊU CẦU ĐANG HÌNH THÀNH</span><h4>Matcha mới của Quán Mộc</h4><dl><div><dt>Hướng video</dt><dd>{activeNeed.style}</dd></div><div><dt>Định dạng</dt><dd>Video dọc · {duration}</dd></div><div><dt>Kênh đăng</dt><dd>{channel}</dd></div><div><dt>Phối hợp</dt><dd>Người được chọn quay & dựng</dd></div></dl><p>Tiền công, lịch quay và phạm vi chỉnh sửa sẽ cần được hai bên thống nhất khi triển khai thật.</p></div></aside>
              </div>}
              {step === 2 && <div className="profiles-view"><div className="view-heading"><div><span className="small-label">BƯỚC 02 / HỒ SƠ MINH HỌA</span><h3 ref={demoHeading} tabIndex={-1}>Chọn một góc nhìn hợp với quán.</h3><p className="muted">Yêu cầu: {activeNeed.style.toLowerCase()} · {duration}</p></div><span className="outline-tag">3 hồ sơ hư cấu</span></div>
                <div className="profile-grid">{profiles.map(p => <article key={p.id} className={`profile ${selected === p.id ? 'chosen' : ''}`}><div className="profile-header"><span className={`avatar avatar-${p.id}`}>{p.initials}</span><div><span className="small-label">{p.name} · MINH HỌA</span><h4>{p.title}</h4></div>{p.fits === need && <span className="fit-tag">Hợp nhu cầu</span>}</div><p>{p.description}</p><div className="skill-tags">{p.skills.map(s => <span key={s}>{s}</span>)}</div><button className="profile-detail text-button" aria-expanded={expanded === p.id} aria-controls={`profile-detail-${p.id}`} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>Xem cách phối hợp <ChevronDown size={16} className={expanded === p.id ? 'rotate' : ''}/></button><div id={`profile-detail-${p.id}`} hidden={expanded !== p.id} className="profile-expanded"><strong>Hướng kịch bản đề xuất</strong><p>{p.work}</p><p>Trao đổi yêu cầu → thống nhất kịch bản → quay tại quán → dựng và nhận góp ý.</p></div><button className={`button ${selected === p.id ? 'primary' : 'secondary'}`} aria-pressed={selected === p.id} onClick={() => setSelected(p.id)}>{selected === p.id ? <><Check size={16}/> Đã chọn hồ sơ này</> : <>Chọn hồ sơ này <ArrowRight size={16}/></>}</button></article>)}</div><p className="illustration-note">Các hồ sơ không đại diện người thật, chưa có người đang nhận việc. Ảnh trên trang không thuộc các hồ sơ này.</p>
              </div>}
              {step === 3 && <div className="review-view"><div className="view-heading"><div><span className="small-label">BƯỚC 03 / KHÔNG GIAN PHỐI HỢP</span><h3 ref={demoHeading} tabIndex={-1}>Một bản nháp tốt bắt đầu từ trao đổi.</h3><p className="muted">Quán Mộc × {activeProfile?.name} · {activeNeed.style} · {duration}</p></div><span className="outline-tag">Mô phỏng bản nháp</span></div>
                <div className="review-layout"><div className="draft-preview"><div className="version-tabs" role="group" aria-label="Chọn phiên bản bản nháp">{[1, 2].map(v => <button key={v} aria-pressed={version === v} className={version === v ? 'active' : ''} onClick={() => { setVersion(v); setScene(0); setPlaying(false); setCommentStatus('') }}>Bản nháp v{v}{v === 2 && <span>Mới hơn</span>}</button>)}</div><div className={`draft-frame scene-${scene}`}><img src={scene === 1 ? images.cafe : images.matcha} alt={scene === 1 ? 'Khung ảnh minh họa không gian quán' : 'Khung ảnh minh họa ly matcha'} loading="lazy"/><span className="draft-corner">KHUNG ẢNH MÔ PHỎNG</span><div className="draft-overlay"><span>QUÁN MỘC / MÓN MỚI</span><strong>{scene === 0 ? (version === 1 ? 'Ghé Mộc hôm nay.' : 'Matcha mới. Thử một ngụm?') : scene === 1 ? 'Một góc quen, một vị mới.' : 'Hẹn bạn ở Mộc.'}</strong>{version === 2 && <p>Matcha latte · thơm trà, dịu vị sữa</p>}</div><button className="draft-play icon-button" aria-label={playing ? 'Tạm dừng khung ảnh mô phỏng' : 'Chạy khung ảnh mô phỏng'} onClick={() => { if (scene === 2) setScene(0); setPlaying(!playing) }}>{playing ? <Pause fill="currentColor"/> : <Play fill="currentColor"/>}</button></div><div className="scene-controls" role="group" aria-label="Chọn khung ảnh mô phỏng">{['00:00 · Mở đầu', '00:08 · Không gian', `${endTime} · Kết`].map((s, i) => <button key={s} aria-pressed={scene === i} className={scene === i ? 'active' : ''} onClick={() => { setScene(i); setTimestamp(i === 0 ? '00:00' : i === 1 ? '00:08' : endTime); setPlaying(false) }}>{s}</button>)}</div><p className="draft-disclaimer">Đây là chuỗi ảnh có chữ để minh họa thao tác duyệt bản nháp, chưa phải video được sản xuất.</p></div>
                  <div className="feedback-panel"><div className="version-note"><span className="small-label">PHIÊN BẢN {version === 1 ? 'ĐẦU TIÊN' : 'ĐÃ ĐIỀU CHỈNH'}</span><h4>{version === 1 ? 'Mở đầu bằng không khí của quán' : 'Đưa món mới vào ngay mở đầu'}</h4><p>{version === 1 ? 'Bản đầu dùng lời mở chung, chưa có phụ đề về món. Chuyển sang v2 để xem cách phản hồi góp ý.' : 'v2 đổi câu mở đầu, bổ sung phụ đề về matcha và giữ lời hẹn ghé quán ở đoạn kết.'}</p></div><div className="sample-comment"><span className="comment-avatar">M</span><div><div className="comment-meta"><strong>Quán Mộc</strong><span>00:00 · v1 · góp ý mẫu</span></div><p>Cho món matcha xuất hiện ngay đầu và thêm phụ đề để xem không bật tiếng vẫn hiểu nhé.</p></div></div>
                    <div className="your-comments" aria-live="polite">{comments.filter(c => c.version === version).map((c, i) => <div key={i} className="sample-comment added-comment"><span className="comment-avatar">B</span><div><div className="comment-meta"><strong>Bạn · xem thử</strong><span>{c.at} · v{c.version}</span></div><p>{c.text}</p></div></div>)}</div>
                    <form className="feedback-form" onSubmit={addComment}><div className="feedback-form-top"><label htmlFor="feedback">Góp ý cho bản nháp v{version}</label><label className="timestamp-label"><span className="sr-only">Mốc thời gian góp ý</span><select value={timestamp} onChange={e => setTimestamp(e.target.value)}><option>00:00</option><option>00:08</option><option>{endTime}</option></select></label></div><textarea id="feedback" maxLength={500} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Ví dụ: Cho cận cảnh lớp matcha lâu hơn một chút…" rows={3} required/><button className="button primary" type="submit">Thêm góp ý mẫu <Send size={16}/></button><p className="local-note">Chỉ lưu tạm trên trang, không gửi cho người khác.</p><p className="form-status" role="status">{commentStatus}</p></form>
                  </div></div>
              </div>}
            </div>
            <div className="demo-bottom"><span>{step === 1 ? 'Chọn nhu cầu → xem hồ sơ minh họa' : step === 2 ? selected ? `${activeProfile?.name} đã được chọn để thử phối hợp.` : 'Chọn một hồ sơ để tiếp tục.' : 'Bạn đã thử quy trình phối hợp từ yêu cầu đến góp ý.'}</span><div>{step > 1 && <button className="button secondary" onClick={() => navigateStep(step - 1)}><ArrowLeft size={16}/> Quay lại</button>}{step < 3 ? <button className="button primary" disabled={step === 2 && !selected} onClick={() => navigateStep(step + 1)}>{step === 1 ? 'Xem hồ sơ minh họa' : 'Xem bản nháp mẫu'}<ArrowRight size={17}/></button> : <a className="button primary" href="#trial">Xem thử đăng ký <ArrowUpRight size={17}/></a>}</div></div>
          </div>
          <p className="demo-caption"><MessageSquare size={15}/> Một luồng để trao đổi rõ hơn. Mọi dữ liệu đều là minh họa, không phát sinh yêu cầu thuê.</p>
        </div>
      </section>

      <section className="video-section container section-space" id="videos"><div className="section-heading"><div><span className="eyebrow">NỘI DUNG GẦN VỚI CỬA HÀNG</span><h2>Không chỉ một kiểu video.</h2></div><p>Mỗi mục tiêu cần một cách kể.<br/>Đây là vài hướng để bắt đầu trao đổi.</p></div><div className="video-grid">{videoTypes.map(v => <article className="video-type" key={v.number}><div className="type-image"><img src={v.image} alt={v.alt} loading="lazy"/><span className="image-index">{v.number} / MINH HỌA</span><button className="type-link icon-button" onClick={() => startDemo(v.need)} aria-label={`Thử nhu cầu: ${v.label.toLowerCase()}`}><ArrowUpRight size={23}/></button></div><span className="small-label">{v.label}</span><h3>{v.title}</h3><p>{v.description}</p></article>)}</div><p className="image-caption">Ảnh tham khảo từ Unsplash. Không phải video hay dự án của người làm nội dung trên nền tảng.</p></section>

      <section id="creator" className="creator-section"><div className="container creator-layout"><div className="creator-visual"><img src={images.pouring} alt="Cận cảnh thao tác pha chế để minh họa góc nhìn người quay nội dung" loading="lazy"/><div className="creator-image-label"><Clapperboard size={19}/><span>GÓC NHÌN CỦA BẠN.<br/>CÂU CHUYỆN CỦA CỬA HÀNG.</span></div><span className="creator-credit">Ảnh minh họa · Nathan Dumlao / Unsplash</span></div><div className="creator-copy"><span className="eyebrow">DÀNH CHO NGƯỜI LÀM NỘI DUNG</span><h2>Để kỹ năng của bạn<br/>gặp đúng câu chuyện.</h2><p>Bạn quay, dựng hoặc kể chuyện bằng video? Ý tưởng này dành một không gian để bạn giới thiệu cách làm việc và phối hợp trực tiếp với cửa hàng.</p><ol className="creator-points"><li><span>01</span><div><h3>Thể hiện góc nhìn riêng</h3><p>Giới thiệu kỹ năng và sản phẩm bạn có quyền chia sẻ.</p></div></li><li><span>02</span><div><h3>Hiểu yêu cầu trước khi bắt đầu</h3><p>Trao đổi kịch bản, lịch quay và phạm vi công việc.</p></div></li><li><span>03</span><div><h3>Theo dõi góp ý theo phiên bản</h3><p>Cùng cửa hàng nhìn lại bản nháp và điều chỉnh có ngữ cảnh.</p></div></li></ol><a className="button primary" href="#trial" onClick={() => setRole('creator')}>Xem thử tham gia với vai trò creator <ArrowUpRight size={17}/></a></div></div></section>

      <section id="fees" className="fees-section container section-space"><div className="fees-intro"><span className="eyebrow">RÕ TỪ ĐẦU, DỄ PHỐI HỢP HƠN</span><h2>Tiền công cho người làm.<br/>Phí cho nền tảng.</h2><p>Hai khoản có mục đích khác nhau. Nhóm đang nghiên cứu cách tính phù hợp và chưa chốt mức phí.</p><span className="outline-tag">Chưa có bảng giá hoặc chính sách thương mại</span></div><div className="fees-explanation"><article><span className="fee-number">01</span><div><h3>Tiền công sản xuất video</h3><p>Cửa hàng và người làm nội dung dự kiến thống nhất theo kịch bản, thời gian quay, dựng, số lần chỉnh sửa và quyền sử dụng.</p><span>Gắn với công việc người được thuê trực tiếp thực hiện.</span></div></article><article><span className="fee-number">02</span><div><h3>Phí nền tảng</h3><p>Khoản dự kiến để hỗ trợ kết nối và phối hợp công việc. Mức phí, cách thu và các điều kiện vẫn đang được nhóm nghiên cứu.</p><span>Không có khoản thu hay thanh toán trong bản concept.</span></div></article></div></section>

      <section id="faq" className="faq-section container section-space"><div><span className="eyebrow">CÓ THỂ BẠN ĐANG THẮC MẮC</span><h2>Hiểu rõ hơn<br/>về ý tưởng.</h2><p className="muted">Một vài câu trả lời trước khi cùng thử.</p></div><div className="faq-list">{faqs.map(([q, a], i) => <details key={q} open={i === 0 ? true : undefined}><summary>{q}<span><ChevronDown size={19}/></span></summary><p>{a}</p></details>)}</div></section>

      <section id="trial" className="trial-section"><div className="container trial-layout"><div className="trial-copy"><span className="eyebrow">CÙNG HOÀN THIỆN Ý TƯỞNG</span><h2>Bạn muốn thử<br/>cách kết nối này?</h2><p>Nhóm dự kiến tìm hiểu nhu cầu từ cửa hàng và người làm nội dung trước khi xây phiên bản thử nghiệm.</p><div className="preview-callout"><Sparkles size={19}/><p><strong>Biểu mẫu đang ở chế độ xem thử.</strong><br/>Chưa có nơi nhận đăng ký. Thông tin bạn nhập không được gửi hoặc lưu sau khi tải lại trang.</p></div></div><form className="trial-form" onSubmit={previewRegistration}><fieldset className="role-selector"><legend>Bạn là…</legend><div>{[['store', 'Cửa hàng', Store], ['creator', 'Người làm nội dung', Video]].map(([value, label, Icon]) => { const RoleIcon = Icon as typeof Store; return <label key={String(value)} className={role === value ? 'selected' : ''}><input type="radio" name="role" value={String(value)} checked={role === value} onChange={() => { setRole(String(value)); setRegistrationPreview(null) }}/><RoleIcon size={18}/><span>{String(label)}</span>{role === value && <Check size={15}/>}</label> })}</div></fieldset><label className="form-label" htmlFor="trial-name">Tên của bạn hoặc cửa hàng<input id="trial-name" name="name" autoComplete="name" placeholder="Ví dụ: Quán Mộc" required maxLength={100} onChange={e => { e.target.setCustomValidity(''); setRegistrationPreview(null) }}/></label><label className="form-label" htmlFor="trial-email">Email<input id="trial-email" name="email" type="email" autoComplete="email" placeholder="ban@example.com" required maxLength={150} onChange={() => setRegistrationPreview(null)}/></label><button className="button primary" type="submit">Xem trước thông tin đăng ký <ArrowRight size={18}/></button><p className="local-note">Thao tác này chỉ tạo bản xem trước. Không gửi đăng ký.</p>{registrationPreview && <div className="registration-preview" tabIndex={-1} ref={previewRef}><strong>Bản xem trước · Chưa gửi</strong><dl><div><dt>Tên</dt><dd>{registrationPreview.name}</dd></div><div><dt>Vai trò</dt><dd>{registrationPreview.role}</dd></div><div><dt>Email</dt><dd>{registrationPreview.email}</dd></div></dl><p>Chưa có nơi nhận đăng ký. Đây chỉ là nội dung để bạn xem lại trên trang.</p></div>}</form></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><a className="brand" href="#"><span className="brand-icon"><Play size={17} fill="currentColor" strokeWidth={0}/></span>{SITE_NAME}<span className="brand-period">.</span></a><p>Đề tài EXE101 · Nền tảng kết nối cửa hàng<br/>với người trực tiếp sản xuất nội dung.</p><a href="#demo" className="text-button">Thử lại demo <ArrowUpRight size={16}/></a></div><div className="footer-bottom"><p>Concept · Dữ liệu minh họa · Chưa mở giao dịch</p><details className="sources"><summary>Nguồn ảnh & quyền sử dụng <ChevronDown size={14}/></summary><div><p>Ảnh tham khảo, không đại diện quán thật hoặc sản phẩm của hồ sơ minh họa.</p>{sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.name}<ArrowUpRight size={13}/></a>)}<a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Giấy phép Unsplash <ArrowUpRight size={13}/></a></div></details></div></div></footer>
  </>
}

export default App
