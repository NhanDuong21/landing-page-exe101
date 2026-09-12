# Kiểm tra bản concept local

## Kết quả

- TypeScript và Vite build thành công; trang local trả HTTP 200.
- Không có lỗi hoặc cảnh báo runtime trong lần tải mới cuối cùng.
- Bước chọn nhu cầu không tràn ngang tại 320, 360, 390, 768, 1024 và 1440px.
- Bước góp ý không tràn ngang tại 320, 390, 768, 1024 và 1440px.
- Đã xem trực quan hero desktop/mobile, hồ sơ ở 320px, bước góp ý và bản xem trước đăng ký.

## Thao tác đã thử

- CTA hero, menu mobile, Escape, liên kết phí và CTA cho creator.
- Ba nhu cầu; đổi kênh đăng và thời lượng 15 giây. Lựa chọn giữ khi quay lại.
- Nút tiếp ở bước 2 bị khóa khi chưa chọn hồ sơ.
- Xem/đóng cách phối hợp và chọn đủ hồ sơ A, B, C.
- v1/v2 đổi câu mở đầu và nội dung điều chỉnh; góp ý v2 không xuất hiện trong v1, vẫn còn khi quay lại v2.
- Góp ý tại 00:08, chạy/dừng chuỗi ảnh, tự dừng tại khung cuối.
- Yêu cầu 15 giây có mốc kết 00:12, không dùng 00:20.
- Làm lại xóa demo và khóa các bước chưa hoàn thành.
- Ba nút loại video mở bước 1 với nhu cầu tương ứng.
- Năm FAQ mở/đóng bằng Enter; nguồn ảnh mở/đóng và hiển thị đủ bốn liên kết.
- Biểu mẫu chặn trường trống, tên chỉ có khoảng trắng, email sai. Thông tin hợp lệ tạo bản xem trước và đưa focus đến bản xem trước.
- Quan sát Network trong thao tác xem trước đăng ký: **0 yêu cầu gửi dữ liệu**.

## Bàn phím và chuyển động

- Phím mũi tên đổi radio; Enter/Space chọn phiên bản và thực hiện nút.
- Chuyển bước đưa focus đến tiêu đề và cuộn demo vào vùng nhìn thấy.
- Escape đóng menu và trả focus về nút mở menu.
- Có skip link, label cho form, focus hiển thị và live region thông báo góp ý.
- Với `prefers-reduced-motion: reduce`: cuộn `auto`, animation `none`, transition `0s`. Demo vẫn dùng được bằng thao tác chủ động.
- Đã trả media emulation và viewport override về mặc định sau kiểm tra.

## Các lỗi đã sửa

- Giữ kênh đăng khi quay lại; điều chỉnh mốc theo thời lượng.
- Cuộn và focus khi đổi bước; tăng cỡ chữ phụ, diện tích chạm và tương phản focus.
- Khung video tỷ lệ 9:16; nhãn ảnh quán không bị video che chữ trên mobile.
- Xác thực tên chỉ có khoảng trắng; xóa lỗi khi nhập lại tên.
- Bỏ badge trong nút phiên bản trên mobile để giảm ngắt dòng.
- Thu gọn ghi chú trên desktop và đặt ghi chú dưới ảnh trên mobile để không che chữ trong khung video.

## API demo tùy chọn

`start_sample_request` đăng ký đúng schema/annotations. Input `review` mở bước 1 và chọn đúng nhu cầu. Input sai bị từ chối, không thay đổi lựa chọn. API chỉ đổi giao diện local, không tạo yêu cầu thuê.

## Giới hạn

Đã thử trên Chromium trong môi trường này; chưa thử trên thiết bị iOS/Android thật hoặc Safari. Không có backend/giao dịch để kiểm tra. Không deploy.
