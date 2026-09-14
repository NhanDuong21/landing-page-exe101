# Kiểm tra concept và motion refinement

Kiểm tra trực tiếp bằng Chromium trên localhost, gồm bản dev và bản production preview. Không chỉ dùng screenshot để đánh giá chuyển động.

## Kết quả

- `npm run build` thành công: TypeScript và Vite. Bản production preview tải được; không có lỗi hoặc cảnh báo console trong lần tải mới cuối cùng.
- Bước góp ý không tràn ngang tại 320, 360, 390, 768, 1024, 1280 và 1440px. Lựa chọn, bước và góp ý giữ nguyên xuyên suốt resize; document không bị tải lại.
- Bước chọn nhu cầu không tràn ngang tại 320, 390, 768, 1024 và 1440px. Chữ hero không bị cắt dấu hoặc tràn dòng ngoài khung.
- Không còn lỗi đã phát hiện trong phạm vi kiểm tra này.

## Hero, scroll và chuyển động tự chạy

- Tải URL gốc để quan sát mask theo dòng và intro ảnh/thẻ chồng nhịp; CTA bấm giữa intro vẫn vào demo.
- Cuộn xuống/lên qua hero → demo: thẻ di chuyển, thu gọn và nối vào tóm tắt; không tự chọn nhu cầu, hồ sơ hoặc bước. Lựa chọn và góp ý không reset khi dùng liên kết navbar hoặc cuộn qua lại.
- Tại mobile 320 × 640, cụm ảnh còn gần ngoài màn hình chưa chạy intro; khi cuộn vào viewport mới mở cảnh.
- Theo dõi transform trong lúc screencast chạy: ảnh quán và khung matcha chuyển động chậm khác nhịp. Tạm dừng giữ nguyên transform qua lần đọc tiếp theo; chữ/CTA ổn định.
- Navbar giữ trạng thái nổi ở các phần dưới; menu mobile mở có trình tự, thử mở/đóng nhanh và Escape. Menu đóng là inert.
- Phần cuối tụ các khung ảnh theo đoạn scroll ngắn; không ghim màn hình hoặc giữ vùng nhập góp ý.

## Demo trong lúc animation chạy

- Đổi nhu cầu, kênh đăng và thời lượng; quay lại vẫn giữ lựa chọn. Thời lượng 15 giây có mốc kết 00:12; 45 giây có 00:35.
- Tiến trình và dấu hoàn thành dựa trên state thật. Chưa chọn hồ sơ thì nút tiếp bước 2 bị khóa.
- Yêu cầu giữ thành thẻ tóm tắt; hồ sơ được chọn chuyển thành thẻ đi cùng sang góp ý. Thử chọn A/B, đổi lựa chọn nhanh, tiếp/quay lại liên tục bằng chuột và Enter; trạng thái cuối đúng và góp ý không mất.
- Mở/đóng hồ sơ desktop; mobile mở sheet, chọn hồ sơ, Escape và trả focus. Resize từ sheet đang mở sang desktop đóng dialog và giữ chi tiết hồ sơ tương ứng.
- Làm lại trả về nhu cầu ban đầu, xóa góp ý, khóa các bước chưa hoàn thành và đưa focus đến tiêu đề bước 1.
- Vị trí nút điều hướng ổn định trong khi thẻ Flip di chuyển; không còn đợt smooth scroll cũ đuổi theo bước mới.

## Phiên bản, trình diễn ảnh và góp ý

- v1/v2 đổi indicator, lời giải thích và preview; đổi nhanh nhiều lần không để lại lớp preview cũ.
- Trong lúc wipe, lớp ảnh mới và lớp đi ra đều hiển thị đúng; không có khung xanh trống giữa chuyển cảnh.
- Chuỗi ảnh có pan/zoom thật. Dừng giữ nguyên vị trí và transform; chạy tiếp nối từ vị trí đã dừng. Hết ba cảnh thì tự dừng. Đồng hồ chỉ điều khiển stack hiện tại, không tính bản sao dùng cho chuyển phiên bản.
- Mốc 00:08 dẫn tới cảnh tương ứng. Chọn góp ý 00:00 của v1 chuyển về v1/cảnh đầu và làm nổi góp ý.
- Thêm góp ý mẫu làm comment vào danh sách và các phần khác dịch chuyển. Góp ý lưu riêng theo phiên bản, giữ khi quay lại; không có phản hồi creator tự sinh hoặc thông báo AI sửa video.
- Nhãn trình diễn ảnh và mốc minh họa được ghi ngay cạnh preview.

## Bàn phím, reduced motion và biểu mẫu

- Enter/Space dùng được cho nút và phiên bản; radio dùng phím mũi tên. Có skip link, focus hiển thị, label và live region.
- Chỉ thao tác chuyển bước mới focus tiêu đề; tải trang không tự focus demo ngoài viewport.
- Sheet dùng dialog với focus trap; Escape đóng sheet/menu và trả focus.
- Với `prefers-reduced-motion: reduce` trên production: chuyển động tự chạy ở trạng thái dừng, không có portal thẻ bay, pan/zoom là `none`; chọn hồ sơ, chuyển bước, phiên bản và mốc góp ý vẫn hoạt động. Đã trả media emulation và viewport về mặc định.
- FAQ mở/đóng bằng Enter; nguồn ảnh có đủ bốn liên kết.
- Biểu mẫu chặn trường trống, tên chỉ có khoảng trắng và email sai. Thông tin hợp lệ chỉ tạo **Bản xem trước · Chưa gửi** và focus bản xem trước.
- Quan sát Network trong thao tác xem trước đăng ký: **0 yêu cầu gửi dữ liệu**.

## Lỗi phát hiện và đã sửa

- Thẻ Flip làm thay đổi vị trí nút khi chuyển bước: giữ chiều cao holder và đặt phần tử đang chuyển trong lớp riêng.
- Focus/scroll cũ đuổi theo thao tác mới: chuyển bước cuộn tức thời, chỉ focus theo hành động đang có hiệu lực.
- Bản sao preview bị tính như cảnh phát thật: scope đồng hồ vào stack hiện tại và cleanup stack chuyển tiếp.
- Indicator phiên bản quay về vị trí đầu khi đổi nhanh: giữ context và ghi đè tween từ vị trí hiện tại.
- Intro mobile không kích hoạt ổn định: dùng trạng thái viewport của ScrollTrigger và ngưỡng vào màn hình.
- Bản sao thẻ yêu cầu gây tràn ngang ngay sau resize: đặt trong portal cố định có clipping, dùng tọa độ viewport.
- Navbar mất trạng thái nổi ở cuối trang: cập nhật cả khi trigger qua biên cuối.
- Tăng tương phản lớp màu CTA và nút dừng khi focus/hover.

## Bằng chứng và giới hạn

[Video desktop](artifacts/motion-desktop.mp4) và [video mobile](artifacts/motion-mobile.mp4) là bản quay trình duyệt qua CDP screencast, dựng thành MP4 theo timestamp từng frame, không có âm thanh. Chúng ghi thao tác thực tế với intro, scroll, demo, phiên bản, góp ý và sheet/menu. PNG trong `artifacts/motion-*` được trích từ các bản quay này.

Đã thử trên Chromium của môi trường này, chưa thử Safari hoặc thiết bị iOS/Android thật. Chưa có backend/giao dịch để kiểm tra. Hồ sơ, yêu cầu và bản nháp là minh họa; góp ý giữ trong state local, đăng ký chỉ xem trước. Không deploy hoặc mua dịch vụ.
