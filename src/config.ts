// Đổi tên hiển thị tại đây; cập nhật thêm title trong index.html nếu đổi thương hiệu.
export const SITE_NAME = 'Kết nối nội dung'
const imageBase = `${import.meta.env.BASE_URL}images/`
export const images = {
  matcha: `${imageBase}matcha.jpg`,
  cafe: `${imageBase}cafe-interior.jpg`,
  pouring: `${imageBase}coffee-pouring.jpg`,
}
export const sources = [
  { name: 'Cody Chan · ảnh matcha', url: 'https://unsplash.com/photos/a-glass-of-refreshing-matcha-iced-latte-Oog-4Ox0rv8' },
  { name: 'Haberdoedas · không gian quán', url: 'https://unsplash.com/photos/cozy-restaurant-interior-with-green-wall-and-pendant-lights-u3GMueY9uF8' },
  { name: 'Nathan Dumlao · pha chế', url: 'https://unsplash.com/photos/milk-pouring-on-coffee-R44u2AMWsv4' },
]
