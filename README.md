# Mai Hương · 2.5D Parallax Showcase

Tác phẩm minh họa nhân vật **Mai Hương** trình diễn theo phong cách **2.5D Multi-layer Parallax** tương tác trên nền tảng web hiện đại.

---

## 🎨 Cấu Trúc Các Tầng Không Gian (13 Layers)

Toàn bộ tác phẩm được bóc tách và phân tầng chính xác theo tỷ lệ chuẩn `2983 × 2000 px`:

1. **Hậu cảnh (Background Cluster - `cluster-bg`)**:
   - `b1`: Nền trời viễn cảnh đáy (100% diện tích).
   - `b2`: Kiến trúc & cảnh quan viễn xứ.
   - `b2_1`: Chi tiết kiến trúc cảnh xa phụ.
   - `b3`: Cảnh quan trung hậu.
   - `b4`: Chi tiết cảnh quan trung cảnh sau.

2. **Trung cảnh & Nhân vật (Character Cluster - `cluster-mid`)**:
   - `c1`: Nhân vật chính Mai Hương.
   - `c1_1`: Chi tiết phụ kiện nổi bật trên nhân vật.

3. **Tiền cảnh (Foreground Cluster - `cluster-fg`)**:
   - `f0`: Lớp nền tiền cảnh.
   - `f1`: Thạch đài & sàn đất phía trước.
   - `f2`: Cánh hoa & hạt sáng lơ lửng.
   - `f3`: Khí quyển & bụi sáng.

4. **Cận cảnh độc lập (`cluster-sf`)**:
   - `sf1`: Khối đá tiền cảnh cận cảnh tách biệt khỏi bộ F, tạo độ trượt chiều sâu rõ nét.

5. **Lớp viền ngoài cùng (`cluster-top`)**:
   - `ssf1`: Quang hoàn & ánh sáng viền ngoài cùng.

---

## ⚡ Tính Năng Kỹ Thuật

- **Engine Parallax 2.5D**: Xử lý tọa độ chuột mượt mà qua thuật toán làm mượt **Lerp Easing** (`dx * 0.08`) kết hợp `requestAnimationFrame`.
- **Tiết kiệm tài nguyên (Idle Auto-sleep)**: Tự động ngắt vòng lặp khi chuột đứng yên và tạm dừng khi ẩn tab (`document.hidden`).
- **Tối ưu WebP**: Chuyển đổi định dạng ảnh chất lượng cao 90, giảm tổng dung lượng từ ~15 MB xuống còn ~2.3 MB, tải tức thì đạt 60fps tuyệt đối.
- **Tương thích di động**: Hỗ trợ cảm biến con quay hồi chuyển (`deviceorientation`) trên Smartphone / Tablet.

---

© 2026 thaoquang2452 · Nguyễn Hoàng Thanh Tùng.
