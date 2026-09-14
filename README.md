# Kết nối nội dung — Concept EXE101

Landing page tiếng Việt giới thiệu nền tảng kết nối cửa hàng với người trực tiếp sản xuất video và hỗ trợ phối hợp công việc. Đây là concept, chưa phải sàn nhận giao dịch.

Bản xem chung của nhóm: **https://nhanduong21.github.io/landing-page-exe101/**.

## Chạy local

Đã chạy với Node.js 24 và npm 11. Trong thư mục dự án:

```sh
npm ci
npm run dev
```

Mở địa chỉ Local mà Vite in trong terminal. Vite chọn cổng tiếp theo nếu 5173 đang được sử dụng. Có thể chỉ định cổng:

```sh
npm run dev -- --port 5174
```

Kiểm tra và xem bản build:

```sh
npm run build
npm run preview
```

Stack: React, Vite, TypeScript, Tailwind CSS. Motion dùng thống nhất GSAP với ScrollTrigger và Flip. Icon: Lucide (ISC). Font hệ thống; mở trang không tải font từ bên thứ ba.

## Xem các chuyển cảnh

Mở URL gốc, ví dụ **http://localhost:5174/**, rồi tải lại để xem mở cảnh hero. URL có `#demo` hoặc `#trial` sẽ đi thẳng tới phần tương ứng.

- Tiêu đề mở qua mask theo dòng; ảnh quán, khung matcha và thẻ yêu cầu vào theo nhịp chồng nhau. Sau intro, ba lớp chuyển động liên tục với chu kỳ khác nhau, đồng thời ảnh bên trong khung pan/zoom chậm. Intro không chạy lại. Trên mobile, cụm ảnh chỉ mở khi đi vào viewport.
- Cuộn một đoạn từ hero xuống demo để thấy thẻ yêu cầu thu gọn, di chuyển và nối vào tóm tắt công việc. Cuộn ngược để xem chuyển cảnh đảo chiều. Scroll chỉ đổi trình bày, không đổi dữ liệu hay bước demo.
- CTA **Thử một yêu cầu mẫu** vào thẳng demo ngay cả khi intro đang chạy.
- Chọn nhu cầu → xem và chọn hồ sơ → sang góp ý: yêu cầu và hồ sơ chuyển thành các thẻ tóm tắt đi cùng công việc. Mobile mở cách phối hợp trong sheet; Escape đóng sheet và trả focus.
- Đổi v1/v2 để xem indicator trượt, preview chuyển cảnh và lời giải thích cập nhật. Chọn góp ý có thời gian để chuyển đúng cảnh; thêm góp ý để thấy danh sách và vùng nhập dịch chuyển.
- Bấm **Chạy chuỗi ảnh** để chạy pan/zoom, chữ và chuyển cảnh của ba ảnh; nút dừng giữ đúng vị trí phát. Đây là trình diễn ảnh, không phải video đã sản xuất.
- Ảnh ở phần dành cho người làm nội dung pan/zoom trong khung. Cuộn xuống lời mời tham gia để xem ba khung ảnh tụ lại, rồi hai ảnh tiếp tục chuyển crop trong khung. Navbar chuyển sang trạng thái nổi khi rời hero; menu mobile mở theo trình tự.

Nút tròn tạm dừng ở navbar dừng các chuyển động tự chạy. Các thao tác và chuyển cảnh theo tương tác vẫn dùng được. `prefers-reduced-motion` bỏ chuyển động trang và pan/zoom; người dùng vẫn có thể chủ động chạy chuỗi ảnh. Không có màn intro chặn thao tác hoặc đoạn cuộn ghim nhiều màn hình.

Các loop chỉ chạy khi vùng ảnh tương ứng đang trong viewport và trang đang hiển thị. Khi quay lại, chúng tiếp tục từ vị trí đã dừng. Loop của thẻ yêu cầu tạm dừng trong chuyển cảnh hero → demo để giữ đúng đường di chuyển. Ambient motion không thay đổi bất kỳ lựa chọn, phiên bản, cảnh hay góp ý nào trong demo.

## Luồng demo

1. Chọn hướng video, kênh đăng và thời lượng cho matcha mới của **Quán Mộc** (tình huống hư cấu).
2. Xem cách phối hợp của hồ sơ A/B/C và chọn một hồ sơ. Các hồ sơ là hư cấu; nhãn phù hợp dựa trên hướng video đã chọn.
3. Chuyển v1/v2, chọn khung ảnh/mốc thời gian, chạy hoặc dừng chuỗi ảnh và thêm góp ý mẫu. Góp ý giữ riêng theo phiên bản.

Quay lại các bước vẫn giữ lựa chọn trong phiên. **Làm lại** trả demo về trạng thái ban đầu. Chuỗi ảnh chỉ chạy sau thao tác chủ động và tự dừng ở khung cuối.

## Những phần đang là mô phỏng

- Quán Mộc, món mới của quán, yêu cầu và toàn bộ hồ sơ đều là dữ liệu minh họa.
- Bản nháp là trình diễn ảnh có pan/zoom, chữ và chuyển cảnh, không phải video do creator sản xuất. Mốc thời gian là dữ liệu minh họa của bản nháp.
- Góp ý chỉ giữ trong state của React; tải lại trang sẽ mất dữ liệu.
- Biểu mẫu chỉ tạo bản xem trước, ghi rõ **Chưa gửi**. Không có nơi nhận đăng ký, không gửi dữ liệu và không lưu vào browser storage.
- Tiền công và phí nền tảng là phần giải thích ý tưởng; chưa có mức phí, bảng giá, cam kết hoặc khoản thu.

Không có đăng nhập, backend giao dịch, thanh toán, chatbot AI, dữ liệu khách hàng hoặc đánh giá thật. GitHub Pages chỉ phục vụ bản frontend concept để nhóm xem chung.

## Đổi tên và nội dung

- Tên hiển thị: `SITE_NAME` trong [src/config.ts](src/config.ts).
- Title, description và theme color: [index.html](index.html).
- Nhu cầu và hồ sơ hư cấu: [src/demoData.ts](src/demoData.ts). Các phần landing page và FAQ: [src/App.tsx](src/App.tsx).
- Luồng demo: [src/Demo.tsx](src/Demo.tsx); trình diễn ảnh: [src/IllustratedPreview.tsx](src/IllustratedPreview.tsx); sheet mobile: [src/ProfileSheet.tsx](src/ProfileSheet.tsx).
- Dàn dựng motion và cleanup: [src/motion.ts](src/motion.ts). Mỗi lớp transform có wrapper riêng khi phối hợp intro, ambient và scroll.
- Styling component, responsive và trạng thái: các utility Tailwind hoàn chỉnh trong [src/ui.ts](src/ui.ts), giữ các class hook để GSAP và giao diện tiếp tục hoạt động. [src/tailwind.css](src/tailwind.css) chỉ còn đầu vào Tailwind, design token và các rule nền cho font, reset, focus và reduced motion. Không dùng lại hai stylesheet component cũ hoặc một khối `@apply`.
- `useSampleDemoTool.ts`: API WebMCP tùy chọn chỉ mở bước đầu của demo. Trình duyệt không hỗ trợ vẫn dùng giao diện bình thường. Đây không phải chatbot và không truyền dữ liệu.

## Nguồn ảnh và quyền sử dụng

Ba ảnh lưu local trong `public/images`, sử dụng theo [Unsplash License](https://unsplash.com/license). Nguồn cũng có trong footer. Ảnh chỉ để tham khảo, không phải sản phẩm của các hồ sơ hư cấu hoặc ảnh của một quán tham gia nền tảng.

- `matcha.jpg`: [Cody Chan — A glass of refreshing matcha iced latte](https://unsplash.com/photos/a-glass-of-refreshing-matcha-iced-latte-Oog-4Ox0rv8).
- `cafe-interior.jpg`: [Haberdoedas — Cozy restaurant interior with green wall and pendant lights](https://unsplash.com/photos/cozy-restaurant-interior-with-green-wall-and-pendant-lights-u3GMueY9uF8).
- `coffee-pouring.jpg`: [Nathan Dumlao — Milk pouring on coffee](https://unsplash.com/photos/milk-pouring-on-coffee-R44u2AMWsv4).

## Kiểm tra và tài liệu local

Đã đối chiếu bốn vùng hero, góp ý, người làm nội dung và cuối trang ở 320, 390, 768 và 1440px, cùng state demo và reduced motion để cố định hình ảnh. Đã kiểm tra bản production, thao tác trong khi animation chạy, cuộn hai chiều, bàn phím, pause/resume, reduced motion và resize; quay đoạn đứng yên hơn 30 giây trên desktop/mobile và theo dõi ít nhất hai chu kỳ của mỗi loop.

Screenshot trước/sau, video MP4, reference build và log audit nằm trong `artifacts/`; ghi chú ở `QA.md`. Chúng được giữ local và gitignore, không đi vào repository hoặc bản deploy. Chỉ ba ảnh sử dụng trên trang trong `public/images/` và favicon được đưa cùng mã nguồn. Phạm vi kiểm thử là Chromium của môi trường phát triển, chưa có WebKit/Safari hoặc thiết bị thật.

## GitHub Pages

[Workflow Pages](.github/workflows/pages.yml) tự build và deploy khi push lên `main`, hoặc có thể chạy thủ công bằng `workflow_dispatch`. Workflow dùng Node.js 24, `npm ci` và bản build ở mode `github-pages`; không cần commit thư mục `dist/`.

Mode này đặt base `/landing-page-exe101/` cho JavaScript, CSS, favicon và ảnh local. Dev và build mặc định vẫn dùng base `/` và các cổng cũ. Để thử đúng đường dẫn của Pages trước khi push:

```sh
npm run build -- --mode github-pages
npm run preview -- --mode github-pages --port 4173
```

Mở **http://localhost:4173/landing-page-exe101/**. Nếu đổi tên repository, cập nhật base trong [vite.config.ts](vite.config.ts) và URL xem chung ở đầu README.

Tài liệu triển khai motion: [GSAP trong React](https://gsap.com/resources/React/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Flip](https://gsap.com/docs/v3/Plugins/Flip/).
