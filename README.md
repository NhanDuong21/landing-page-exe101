# Kết nối nội dung — Concept EXE101

Landing page tiếng Việt giới thiệu nền tảng kết nối cửa hàng với người trực tiếp sản xuất video và hỗ trợ phối hợp công việc. Đây là concept, chưa phải sàn nhận giao dịch.

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

- Tiêu đề mở qua mask theo dòng; ảnh quán, khung matcha và thẻ yêu cầu vào theo nhịp chồng nhau. Sau intro, hai lớp ảnh chuyển động chậm khác nhịp. Trên mobile, cụm ảnh chỉ mở khi đi vào viewport.
- Cuộn một đoạn từ hero xuống demo để thấy thẻ yêu cầu thu gọn, di chuyển và nối vào tóm tắt công việc. Cuộn ngược để xem chuyển cảnh đảo chiều. Scroll chỉ đổi trình bày, không đổi dữ liệu hay bước demo.
- CTA **Thử một yêu cầu mẫu** vào thẳng demo ngay cả khi intro đang chạy.
- Chọn nhu cầu → xem và chọn hồ sơ → sang góp ý: yêu cầu và hồ sơ chuyển thành các thẻ tóm tắt đi cùng công việc. Mobile mở cách phối hợp trong sheet; Escape đóng sheet và trả focus.
- Đổi v1/v2 để xem indicator trượt, preview chuyển cảnh và lời giải thích cập nhật. Chọn góp ý có thời gian để chuyển đúng cảnh; thêm góp ý để thấy danh sách và vùng nhập dịch chuyển.
- Bấm **Chạy chuỗi ảnh** để chạy pan/zoom, chữ và chuyển cảnh của ba ảnh; nút dừng giữ đúng vị trí phát. Đây là trình diễn ảnh, không phải video đã sản xuất.
- Cuộn xuống lời mời tham gia để xem ba khung ảnh tụ lại. Navbar chuyển sang trạng thái nổi khi rời hero; menu mobile mở theo trình tự.

Nút tròn tạm dừng ở navbar dừng các chuyển động tự chạy. Các thao tác và chuyển cảnh theo tương tác vẫn dùng được. `prefers-reduced-motion` bỏ chuyển động trang và pan/zoom; người dùng vẫn có thể chủ động chạy chuỗi ảnh. Không có màn intro chặn thao tác hoặc đoạn cuộn ghim nhiều màn hình.

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

Không có đăng nhập, backend giao dịch, thanh toán, chatbot AI, dữ liệu khách hàng hoặc đánh giá thật. Không mua dịch vụ hoặc deploy website.

## Đổi tên và nội dung

- Tên hiển thị: `SITE_NAME` trong [src/config.ts](src/config.ts).
- Title, description và theme color: [index.html](index.html).
- Nhu cầu và hồ sơ hư cấu: [src/demoData.ts](src/demoData.ts). Các phần landing page và FAQ: [src/App.tsx](src/App.tsx).
- Luồng demo: [src/Demo.tsx](src/Demo.tsx); trình diễn ảnh: [src/IllustratedPreview.tsx](src/IllustratedPreview.tsx); sheet mobile: [src/ProfileSheet.tsx](src/ProfileSheet.tsx).
- Dàn dựng motion và cleanup: [src/motion.ts](src/motion.ts). Mỗi lớp transform có wrapper riêng khi phối hợp intro, ambient và scroll.
- Màu sắc và responsive: [src/style.css](src/style.css); phần bố cục và motion refinement: [src/motion.css](src/motion.css).
- `useSampleDemoTool.ts`: API WebMCP tùy chọn chỉ mở bước đầu của demo. Trình duyệt không hỗ trợ vẫn dùng giao diện bình thường. Đây không phải chatbot và không truyền dữ liệu.

## Nguồn ảnh và quyền sử dụng

Ba ảnh lưu local trong `public/images`, sử dụng theo [Unsplash License](https://unsplash.com/license). Nguồn cũng có trong footer. Ảnh chỉ để tham khảo, không phải sản phẩm của các hồ sơ hư cấu hoặc ảnh của một quán tham gia nền tảng.

- `matcha.jpg`: [Cody Chan — A glass of refreshing matcha iced latte](https://unsplash.com/photos/a-glass-of-refreshing-matcha-iced-latte-Oog-4Ox0rv8).
- `cafe-interior.jpg`: [Haberdoedas — Cozy restaurant interior with green wall and pendant lights](https://unsplash.com/photos/cozy-restaurant-interior-with-green-wall-and-pendant-lights-u3GMueY9uF8).
- `coffee-pouring.jpg`: [Nathan Dumlao — Milk pouring on coffee](https://unsplash.com/photos/milk-pouring-on-coffee-R44u2AMWsv4).

## Kiểm tra và ảnh giao diện

Xem [QA.md](QA.md) và thư mục [artifacts](artifacts). Đã kiểm tra trực tiếp trên Chromium ở mobile và desktop, gồm thao tác trong khi animation đang chạy, cuộn hai chiều, bàn phím, reduced motion, resize, thông tin nhập không hợp lệ và mạng khi xem trước đăng ký.

- Video quay trình duyệt: [desktop](artifacts/motion-desktop.mp4), [mobile](artifacts/motion-mobile.mp4). Các video giữ thời gian của chuỗi screencast, không có âm thanh.
- Ảnh trích từ bản quay: [hero](artifacts/motion-desktop-hero.png), [hero → demo](artifacts/motion-desktop-handoff.png), [góp ý desktop](artifacts/motion-desktop-review.png), [sheet mobile](artifacts/motion-mobile-sheet.png), [góp ý mobile](artifacts/motion-mobile-review.png).

Tài liệu triển khai motion: [GSAP trong React](https://gsap.com/resources/React/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Flip](https://gsap.com/docs/v3/Plugins/Flip/).
