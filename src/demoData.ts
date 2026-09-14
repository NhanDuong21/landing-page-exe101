import { Coffee, Store, Video } from 'lucide-react'

export const needs = [
  { id: 'product', title: 'Làm nổi bật món mới', description: 'Cận cảnh matcha, lớp sữa và khoảnh khắc thưởng thức.', icon: Coffee, style: 'Cận cảnh sản phẩm' },
  { id: 'story', title: 'Kể câu chuyện của quán', description: 'Từ góc quầy pha chế đến ly matcha trên bàn.', icon: Store, style: 'Câu chuyện không gian' },
  { id: 'review', title: 'Trải nghiệm một cách tự nhiên', description: 'Một người dẫn chuyện thử món và chia sẻ cảm nhận.', icon: Video, style: 'Có người dẫn chuyện' },
]
export const profiles = [
  { id: 'a', name: 'Hồ sơ A', initials: 'A', title: 'Góc nhìn ẩm thực', tag: 'Cận cảnh sản phẩm', description: 'Tập trung vào chất liệu, ánh sáng và chuyển động của đồ uống.', skills: ['Quay tại quán', 'Dựng video dọc'], work: 'Cận cảnh món → pha chế → thành phẩm', fits: 'product' },
  { id: 'b', name: 'Hồ sơ B', initials: 'B', title: 'Kể chuyện không gian', tag: 'Câu chuyện không gian', description: 'Kết nối món mới với nhịp sống và những góc nhỏ trong quán.', skills: ['Kịch bản ngắn', 'Quay & dựng'], work: 'Không gian → câu chuyện → món mới', fits: 'story' },
  { id: 'c', name: 'Hồ sơ C', initials: 'C', title: 'Trải nghiệm có lời kể', tag: 'Có người dẫn chuyện', description: 'Dẫn dắt bằng lời kể gần gũi, có phụ đề dễ theo dõi.', skills: ['Dẫn chuyện', 'Dựng & phụ đề'], work: 'Mở lời → thử món → cảm nhận', fits: 'review' },
]
