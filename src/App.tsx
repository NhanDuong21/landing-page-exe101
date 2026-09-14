import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, ArrowRight, Check, ChevronDown, Clapperboard, Film, Menu, Pause, Play, Sparkles, Store, Video, X } from 'lucide-react'
import { images, SITE_NAME, sources } from './config'
import { useSampleDemoTool } from './useSampleDemoTool'
import { Demo, type DemoHandle } from './Demo'
import { useMediaQuery, useMenuMotion, usePageMotion } from './motion'

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
  const root = useRef<HTMLDivElement>(null)
  const demo = useRef<DemoHandle>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [role, setRole] = useState('store')
  const [registrationPreview, setRegistrationPreview] = useState<{ name: string; email: string; role: string } | null>(null)
  const mobile = useMediaQuery('(max-width: 760px)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finishIntro = usePageMotion(root, reduced, paused, currentStep)
  useMenuMotion(menuOpen, mobile, reduced)
  const startDemo = (chosen?: string) => demo.current?.start(chosen)
  useSampleDemoTool(startDemo)
  useEffect(() => {
    if (!menuOpen) return
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [menuOpen])
  useEffect(() => { if (registrationPreview) previewRef.current?.focus() }, [registrationPreview])
  const previewRegistration = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nameInput = e.currentTarget.elements.namedItem('name') as HTMLInputElement
    if (!nameInput.value.trim()) { nameInput.setCustomValidity('Vui lòng nhập tên có nội dung.'); nameInput.reportValidity(); return }
    const data = new FormData(e.currentTarget)
    setRegistrationPreview({ name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), role: role === 'store' ? 'Cửa hàng' : 'Người làm nội dung' })
  }

  return <div ref={root} className="site-shell" data-auto-motion={paused || reduced ? 'paused' : 'running'}>
    <a className="skip-link" href="#main">Đi đến nội dung chính</a>
    <div className="concept-bar"><div className="container flex items-center justify-between gap-4"><span>BẢN CONCEPT <span className="bar-separator">/</span> EXE101</span><span>Ý tưởng để cùng thử. Chưa mở giao dịch.</span></div></div>
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#" aria-label={`${SITE_NAME} — về đầu trang`}><span className="brand-icon"><Play size={19} fill="currentColor" strokeWidth={0}/></span><span>{SITE_NAME}<span className="brand-period">.</span></span></a>
        <div className="header-controls"><button className="motion-toggle icon-button" disabled={reduced} aria-pressed={paused || reduced} aria-label={reduced ? 'Đang giảm chuyển động theo cài đặt thiết bị' : paused ? 'Bật chuyển động tự chạy' : 'Tạm dừng chuyển động tự chạy'} title={reduced ? 'Đang giảm chuyển động theo cài đặt thiết bị' : paused ? 'Bật chuyển động tự chạy' : 'Tạm dừng chuyển động tự chạy'} onClick={() => setPaused(p => !p)}>{paused || reduced ? <Play size={17}/> : <Pause size={17}/>}<span className="motion-label">{paused || reduced ? 'Chuyển động đã dừng' : 'Tạm dừng chuyển động'}</span></button><button ref={menuButton} className="menu-toggle icon-button" aria-expanded={menuOpen} aria-controls="navigation" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
        <nav id="navigation" className={menuOpen ? 'nav open' : 'nav'} aria-label="Điều hướng chính" inert={mobile && !menuOpen} aria-hidden={mobile && !menuOpen ? true : undefined}>
          <a href="#demo" onClick={() => { finishIntro.current(); setMenuOpen(false) }}>Trải nghiệm mẫu</a>
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
          <h1 aria-label="Tìm người làm video phù hợp với cửa hàng của bạn."><span className="hero-title-lines title-desktop" aria-hidden="true">{['Tìm người làm video', 'phù hợp với cửa hàng', 'của bạn.'].map((line, i) => <span className={i === 2 ? 'title-mask title-green' : 'title-mask'} key={line}><span className="title-line">{line}</span></span>)}</span><span className="hero-title-lines title-mobile" aria-hidden="true">{['Tìm người làm', 'video phù hợp với', 'cửa hàng của bạn.'].map((line, i) => <span className={i === 2 ? 'title-mask title-green' : 'title-mask'} key={line}><span className="title-line">{line}</span></span>)}</span></h1>
          <p>Một nơi để tìm người trực tiếp sản xuất video, thống nhất yêu cầu và cùng theo dõi từng bản nháp.</p>
          <div className="hero-actions"><button className="button primary" onClick={() => startDemo()}>Thử một yêu cầu mẫu <ArrowRight size={18}/></button><a className="button secondary" href="#creator">Tôi là người làm nội dung <ArrowUpRight size={17}/></a></div>
          <div className="hero-note"><Clapperboard size={17}/><span>Không cần tài khoản. Toàn bộ trải nghiệm là minh họa.</span></div>
        </div>
        <div className="hero-art" aria-label="Minh họa quá trình từ một quán đến video giới thiệu món mới">
          <div className="cafe-depth"><figure className="cafe-frame"><img src={images.cafe} alt="Góc quán có cây xanh và bàn ghế gỗ" width="1600" height="1200"/><figcaption><Store size={14}/> KHÔNG GIAN QUÁN</figcaption></figure></div>
          <div className="phone-depth"><div className="phone-frame"><img src={images.matcha} alt="Ly matcha sữa đá được dùng làm hình minh họa video dọc" width="1600" height="2400"/><span className="phone-label">KHUNG VIDEO MINH HỌA</span><div className="phone-copy"><span>MÓN MỚI CỦA QUÁN</span><strong>Một chút xanh.<br/>Một ngày dịu lại.</strong><div><span className="play-disc"><Film size={16}/></span><span>Matcha latte <span className="slash">/</span> 9:16</span></div></div></div></div>
          <div className="brief-source"><div className="brief-note"><span className="brief-icon"><Film size={20}/></span><div><span>YÊU CẦU MẪU</span><strong>Giới thiệu matcha mới</strong><p>Từ ý tưởng đến bản nháp, cùng một nơi.</p></div></div></div>
          <span className="art-footnote">Ảnh nguồn Unsplash · Không phải sản phẩm của creator</span>
        </div>
      </section>
      <Demo ref={demo} mobile={mobile} reduced={reduced} paused={paused} onStep={setCurrentStep} beforeJump={() => { finishIntro.current(); setMenuOpen(false) }}/>

      <section className="video-section container section-space" id="videos"><div className="section-heading"><div><span className="eyebrow">NỘI DUNG GẦN VỚI CỬA HÀNG</span><h2>Không chỉ một kiểu video.</h2></div><p>Mỗi mục tiêu cần một cách kể.<br/>Đây là vài hướng để bắt đầu trao đổi.</p></div><div className="video-grid">{videoTypes.map(v => <article className="video-type" key={v.number}><div className="type-image"><img src={v.image} alt={v.alt} loading="lazy"/><span className="image-index">{v.number} / MINH HỌA</span><button className="type-link icon-button" onClick={() => startDemo(v.need)} aria-label={`Thử nhu cầu: ${v.label.toLowerCase()}`}><ArrowUpRight size={23}/></button></div><span className="small-label">{v.label}</span><h3>{v.title}</h3><p>{v.description}</p></article>)}</div><p className="image-caption">Ảnh tham khảo từ Unsplash. Không phải video hay dự án của người làm nội dung trên nền tảng.</p></section>

      <section id="creator" className="creator-section"><div className="container creator-layout"><div className="creator-visual"><img src={images.pouring} alt="Cận cảnh thao tác pha chế để minh họa góc nhìn người quay nội dung" loading="lazy"/><div className="creator-image-label"><Clapperboard size={19}/><span>GÓC NHÌN CỦA BẠN.<br/>CÂU CHUYỆN CỦA CỬA HÀNG.</span></div><span className="creator-credit">Ảnh minh họa · Nathan Dumlao / Unsplash</span></div><div className="creator-copy"><span className="eyebrow">DÀNH CHO NGƯỜI LÀM NỘI DUNG</span><h2>Để kỹ năng của bạn<br/>gặp đúng câu chuyện.</h2><p>Bạn quay, dựng hoặc kể chuyện bằng video? Ý tưởng này dành một không gian để bạn giới thiệu cách làm việc và phối hợp trực tiếp với cửa hàng.</p><ol className="creator-points"><li><span>01</span><div><h3>Thể hiện góc nhìn riêng</h3><p>Giới thiệu kỹ năng và sản phẩm bạn có quyền chia sẻ.</p></div></li><li><span>02</span><div><h3>Hiểu yêu cầu trước khi bắt đầu</h3><p>Trao đổi kịch bản, lịch quay và phạm vi công việc.</p></div></li><li><span>03</span><div><h3>Theo dõi góp ý theo phiên bản</h3><p>Cùng cửa hàng nhìn lại bản nháp và điều chỉnh có ngữ cảnh.</p></div></li></ol><a className="button primary" href="#trial" onClick={() => setRole('creator')}>Xem thử tham gia với vai trò creator <ArrowUpRight size={17}/></a></div></div></section>

      <section id="fees" className="fees-section container section-space"><div className="fees-intro"><span className="eyebrow">RÕ TỪ ĐẦU, DỄ PHỐI HỢP HƠN</span><h2>Tiền công cho người làm.<br/>Phí cho nền tảng.</h2><p>Hai khoản có mục đích khác nhau. Nhóm đang nghiên cứu cách tính phù hợp và chưa chốt mức phí.</p><span className="outline-tag">Chưa có bảng giá hoặc chính sách thương mại</span></div><div className="fees-explanation"><article><span className="fee-number">01</span><div><h3>Tiền công sản xuất video</h3><p>Cửa hàng và người làm nội dung dự kiến thống nhất theo kịch bản, thời gian quay, dựng, số lần chỉnh sửa và quyền sử dụng.</p><span>Gắn với công việc người được thuê trực tiếp thực hiện.</span></div></article><article><span className="fee-number">02</span><div><h3>Phí nền tảng</h3><p>Khoản dự kiến để hỗ trợ kết nối và phối hợp công việc. Mức phí, cách thu và các điều kiện vẫn đang được nhóm nghiên cứu.</p><span>Không có khoản thu hay thanh toán trong bản concept.</span></div></article></div></section>

      <section id="faq" className="faq-section container section-space"><div><span className="eyebrow">CÓ THỂ BẠN ĐANG THẮC MẮC</span><h2>Hiểu rõ hơn<br/>về ý tưởng.</h2><p className="muted">Một vài câu trả lời trước khi cùng thử.</p></div><div className="faq-list">{faqs.map(([q, a], i) => <details key={q} open={i === 0 ? true : undefined}><summary>{q}<span><ChevronDown size={19}/></span></summary><p>{a}</p></details>)}</div></section>

      <section id="trial" className="trial-section"><div className="container trial-layout"><div className="trial-copy"><span className="eyebrow">CÙNG HOÀN THIỆN Ý TƯỞNG</span><div className="trial-heading-stage"><h2>Bạn muốn thử<br/>cách kết nối này?</h2><div className="trial-assembly" aria-hidden="true"><div className="trial-piece trial-piece-quan"><img src={images.cafe} alt=""/><span>QUÁN MỘC</span></div><div className="trial-piece trial-piece-matcha"><img src={images.matcha} alt=""/></div><div className="trial-piece trial-piece-brief"><Film size={19}/><span>Một yêu cầu.<br/>Một góc nhìn mới.</span><Check size={15}/></div></div></div><p>Nhóm dự kiến tìm hiểu nhu cầu từ cửa hàng và người làm nội dung trước khi xây phiên bản thử nghiệm.</p><div className="preview-callout"><Sparkles size={19}/><p><strong>Biểu mẫu đang ở chế độ xem thử.</strong><br/>Chưa có nơi nhận đăng ký. Thông tin bạn nhập không được gửi hoặc lưu sau khi tải lại trang.</p></div></div><form className="trial-form" onSubmit={previewRegistration}><fieldset className="role-selector"><legend>Bạn là…</legend><div>{[['store', 'Cửa hàng', Store], ['creator', 'Người làm nội dung', Video]].map(([value, label, Icon]) => { const RoleIcon = Icon as typeof Store; return <label key={String(value)} className={role === value ? 'selected' : ''}><input type="radio" name="role" value={String(value)} checked={role === value} onChange={() => { setRole(String(value)); setRegistrationPreview(null) }}/><RoleIcon size={18}/><span>{String(label)}</span>{role === value && <Check size={15}/>}</label> })}</div></fieldset><label className="form-label" htmlFor="trial-name">Tên của bạn hoặc cửa hàng<input id="trial-name" name="name" autoComplete="name" placeholder="Ví dụ: Quán Mộc" required maxLength={100} onChange={e => { e.target.setCustomValidity(''); setRegistrationPreview(null) }}/></label><label className="form-label" htmlFor="trial-email">Email<input id="trial-email" name="email" type="email" autoComplete="email" placeholder="ban@example.com" required maxLength={150} onChange={() => setRegistrationPreview(null)}/></label><button className="button primary" type="submit">Xem trước thông tin đăng ký <ArrowRight size={18}/></button><p className="local-note">Thao tác này chỉ tạo bản xem trước. Không gửi đăng ký.</p>{registrationPreview && <div className="registration-preview" tabIndex={-1} ref={previewRef}><strong>Bản xem trước · Chưa gửi</strong><dl><div><dt>Tên</dt><dd>{registrationPreview.name}</dd></div><div><dt>Vai trò</dt><dd>{registrationPreview.role}</dd></div><div><dt>Email</dt><dd>{registrationPreview.email}</dd></div></dl><p>Chưa có nơi nhận đăng ký. Đây chỉ là nội dung để bạn xem lại trên trang.</p></div>}</form></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><a className="brand" href="#"><span className="brand-icon"><Play size={17} fill="currentColor" strokeWidth={0}/></span>{SITE_NAME}<span className="brand-period">.</span></a><p>Đề tài EXE101 · Nền tảng kết nối cửa hàng<br/>với người trực tiếp sản xuất nội dung.</p><a href="#demo" className="text-button">Thử lại demo <ArrowUpRight size={16}/></a></div><div className="footer-bottom"><p>Concept · Dữ liệu minh họa · Chưa mở giao dịch</p><details className="sources"><summary>Nguồn ảnh & quyền sử dụng <ChevronDown size={14}/></summary><div><p>Ảnh tham khảo, không đại diện quán thật hoặc sản phẩm của hồ sơ minh họa.</p>{sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.name}<ArrowUpRight size={13}/></a>)}<a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Giấy phép Unsplash <ArrowUpRight size={13}/></a></div></details></div></div></footer>
  </div>
}

export default App
