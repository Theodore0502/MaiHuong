/**
 * MAI HUONG - 2.5D MULTI-LAYER PARALLAX ENGINE
 * High Performance Parallax Controller with Lerp Easing & Idle Auto-Sleep
 */

document.addEventListener('DOMContentLoaded', () => {
  initOpeningFlow();
  initParallaxEngine();
  initSecurityShield();
});

function initParallaxEngine() {
  const stageWrapper = document.getElementById('stage-wrapper');
  const clusterB1 = document.getElementById('cluster-b1');
  const clusterB2 = document.getElementById('cluster-b2');
  const clusterB3 = document.getElementById('cluster-b3');
  const clusterB4 = document.getElementById('cluster-b4');
  const clusterMid = document.getElementById('cluster-mid');
  const clusterC1_1 = document.getElementById('cluster-c1_1');
  const clusterFg = document.getElementById('cluster-fg');
  const clusterSf = document.getElementById('cluster-sf');
  const clusterTop = document.getElementById('cluster-top');

  if (!stageWrapper || !clusterB1 || !clusterB2 || !clusterB3 || !clusterB4 || !clusterMid || !clusterFg) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isLoopRunning = false;

  // Mouse Move Event Listener
  function onMouseMove(e) {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;

    targetX = Math.max(-1, Math.min(1, normX));
    targetY = Math.max(-1, Math.min(1, normY));

    startLoop();
  }

  // Mouse Leave - return gracefully to center
  function onMouseLeave() {
    targetX = 0;
    targetY = 0;
    startLoop();
  }

  // Device Orientation for Mobile / Tablet Gyroscope (Landscape aware)
  function onDeviceOrientation(e) {
    if (e.gamma === null || e.beta === null) return;

    // Kiểm tra góc xoay màn hình (90 độ hoặc -90 độ khi xoay ngang)
    const angle = (screen.orientation && screen.orientation.angle !== undefined)
      ? screen.orientation.angle
      : (window.orientation || 0);

    let xVal = e.gamma;
    let yVal = e.beta;

    if (angle === 90) {
      xVal = -e.beta;
      yVal = e.gamma;
    } else if (angle === -90 || angle === 270) {
      xVal = e.beta;
      yVal = -e.gamma;
    }

    const normX = Math.max(-1, Math.min(1, xVal / 22));
    const normY = Math.max(-1, Math.min(1, (yVal - 25) / 22));

    targetX = normX;
    targetY = normY;
    startLoop();
  }

  function startLoop() {
    if (!isLoopRunning && !document.hidden) {
      isLoopRunning = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function updateParallax() {
    if (document.hidden) {
      isLoopRunning = false;
      return;
    }

    const dx = targetX - currentX;
    const dy = targetY - currentY;

    // Auto-sleep khi chuyển động hội tụ tới đích (tiết kiệm CPU/GPU)
    if (Math.abs(dx) < 0.0008 && Math.abs(dy) < 0.0008) {
      currentX = targetX;
      currentY = targetY;
      applyTransform(currentX, currentY);
      isLoopRunning = false;
      return;
    }

    // Lerp smoothing tối ưu 60 - 120 FPS
    currentX += dx * 0.09;
    currentY += dy * 0.09;
    applyTransform(currentX, currentY);

    requestAnimationFrame(updateParallax);
  }

  // Bộ nhớ đệm tọa độ frame trước: Chỉ ghi style.transform khi giá trị pixel thực sự thay đổi
  let prevB1X, prevB1Y;
  let prevB2X, prevB2Y;
  let prevB3X, prevB3Y;
  let prevB4X, prevB4Y;
  let prevMidX, prevMidY;
  let prevC1_1X, prevC1_1Y;
  let prevFgX, prevFgY;
  let prevSfX, prevSfY;
  let prevTopX, prevTopY;

  function applyTransform(x, y) {
    // 1.1 Cluster B1: Bầu trời xa vô cực - dịch chuyển ngược chiều sâu nhất
    const b1X = Math.round(x * -24);
    const b1Y = Math.round(y * -14);
    if (clusterB1 && (b1X !== prevB1X || b1Y !== prevB1Y)) {
      clusterB1.style.transform = `translate3d(${b1X}px,${b1Y}px,0)`;
      prevB1X = b1X; prevB1Y = b1Y;
    }

    // 1.2 Cluster B2 (B2, B2_1): Kiến trúc viễn cảnh - tách mạnh khỏi B1
    const b2X = Math.round(x * -12);
    const b2Y = Math.round(y * -7);
    if (clusterB2 && (b2X !== prevB2X || b2Y !== prevB2Y)) {
      clusterB2.style.transform = `translate3d(${b2X}px,${b2Y}px,0)`;
      prevB2X = b2X; prevB2Y = b2Y;
    }

    // 1.3 Cluster B3: Cảnh quan trung hậu - tách độc lập
    const b3X = Math.round(x * -2);
    const b3Y = Math.round(y * -1);
    if (clusterB3 && (b3X !== prevB3X || b3Y !== prevB3Y)) {
      clusterB3.style.transform = `translate3d(${b3X}px,${b3Y}px,0)`;
      prevB3X = b3X; prevB3Y = b3Y;
    }

    // 1.4 Cluster B4: Cảnh quan trung cảnh sau - tách độc lập khỏi B3
    const b4X = Math.round(x * 5);
    const b4Y = Math.round(y * 3);
    if (clusterB4 && (b4X !== prevB4X || b4Y !== prevB4Y)) {
      clusterB4.style.transform = `translate3d(${b4X}px,${b4Y}px,0)`;
      prevB4X = b4X; prevB4Y = b4Y;
    }

    // 2. Cluster MID (Nhân vật C1): Làm tròn pixel nguyên (Math.round) & translate3d triệt tiêu mờ sub-pixel
    const midX = Math.round(x * 12);
    const midY = Math.round(y * 7);
    if (clusterMid && (midX !== prevMidX || midY !== prevMidY)) {
      clusterMid.style.transform = `translate3d(${midX}px,${midY}px,0)`;
      prevMidX = midX; prevMidY = midY;
    }

    // 2.1 Cluster C1_1 (Phụ kiện C1_1 tách độc lập khỏi C1)
    const c1_1X = Math.round(x * 14);
    const c1_1Y = Math.round(y * 8);
    if (clusterC1_1 && (c1_1X !== prevC1_1X || c1_1Y !== prevC1_1Y)) {
      clusterC1_1.style.transform = `translate3d(${c1_1X}px,${c1_1Y}px,0)`;
      prevC1_1X = c1_1X; prevC1_1Y = c1_1Y;
    }

    // 3. Cluster FG (Bộ F: F0, F1, F2, F3)
    const fgX = Math.round(x * 28);
    const fgY = Math.round(y * 18);
    if (clusterFg && (fgX !== prevFgX || fgY !== prevFgY)) {
      clusterFg.style.transform = `translate3d(${fgX}px,${fgY}px,0)`;
      prevFgX = fgX; prevFgY = fgY;
    }

    // 4. Cluster SF: Tách riêng độc lập khỏi bộ F, độ sâu cận cảnh cao hơn
    const sfX = Math.round(x * 38);
    const sfY = Math.round(y * 24);
    if (clusterSf && (sfX !== prevSfX || sfY !== prevSfY)) {
      clusterSf.style.transform = `translate3d(${sfX}px,${sfY}px,0)`;
      prevSfX = sfX; prevSfY = sfY;
    }

    // 5. Cluster TOP: Lớp SSF1 trên cùng
    const topX = Math.round(x * 42);
    const topY = Math.round(y * 26);
    if (clusterTop && (topX !== prevTopX || topY !== prevTopY)) {
      clusterTop.style.transform = `translate3d(${topX}px,${topY}px,0)`;
      prevTopX = topX; prevTopY = topY;
    }
  }

  // Mouse & Touch Interaction
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);

  // Hỗ trợ Touch Drag mượt mà trên Mobile / Tablet
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      const normX = (touch.clientX / window.innerWidth) * 2 - 1;
      const normY = (touch.clientY / window.innerHeight) * 2 - 1;

      targetX = Math.max(-1, Math.min(1, normX));
      targetY = Math.max(-1, Math.min(1, normY));
      startLoop();
    }
  }, { passive: true });

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
  }

  // Handle Tab Switching
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !isLoopRunning) {
      startLoop();
    }
  });

  // Initial trigger
  startLoop();
}

/* ==========================================================================
   SECURITY & ASSET PROTECTION CONTROLLER
   1. Disable right-click context menu
   2. Disable drag & drop of visual layers
   3. Intercept DevTools & inspection keyboard shortcuts
   4. DevTools Detection & Auto-Blanking (Hides art when DevTools is opened)
   5. Debugger Trapping (Freezes sources / console when inspected)
   ========================================================================== */
function initSecurityShield() {
  // 1. Chặn chuột phải trên toàn bộ trang
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Chặn kéo thả hình ảnh
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 3. Khóa toàn bộ phím tắt mở DevTools, View Source, Save Page
  window.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Ctrl + Shift + I (Inspect) / Ctrl + Shift + J (Console) / Ctrl + Shift + C (Element picker)
    if (e.ctrlKey && e.shiftKey) {
      const k = e.key.toLowerCase();
      if (k === 'i' || k === 'j' || k === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    // Ctrl + U (View Source)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Ctrl + S (Save Page)
    if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Chặn Zoom phím tắt: Ctrl + (+), Ctrl + (-), Ctrl + 0
    if (e.ctrlKey && (
      e.key === '+' || e.key === '=' || 
      e.key === '-' || e.key === '_' || 
      e.key === '0' || e.keyCode === 187 || 
      e.keyCode === 189 || e.keyCode === 107 || 
      e.keyCode === 109 || e.keyCode === 48 || e.keyCode === 96
    )) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 4. Chặn Zoom bằng Ctrl + Lăn chuột (Mouse Wheel Zoom)
  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      return false;
    }
  }, { passive: false });

  // 5. Chặn Pinch-to-zoom (Chụm 2 ngón tay phóng to/thu nhỏ trên Touch/Trackpad)
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('gestureend', (e) => {
    e.preventDefault();
  }, { passive: false });

  // 4. Phát hiện DevTools mở bằng cơ chế Timing Debugger (Chỉ kích hoạt khi DevTools THỰC SỰ mở, không bị báo nhầm)
  let isDevToolsOpen = false;

  function triggerProtection(active) {
    if (active === isDevToolsOpen) return;
    isDevToolsOpen = active;
    if (isDevToolsOpen) {
      document.body.classList.add('devtools-active');
    } else {
      document.body.classList.remove('devtools-active');
    }
  }

  // Phương pháp đo độ trễ: Chỉ chạy trên Desktop (không chạy trên Mobile để tránh drop FPS / jank)
  const isMobileClient = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobileClient) {
    setInterval(() => {
      const t0 = performance.now();
      (function() { return false; }["constructor"]("debugger")());
      const t1 = performance.now();

      if (t1 - t0 > 100) {
        triggerProtection(true);
      } else if (isDevToolsOpen) {
        triggerProtection(false);
      }
    }, 2000);
  }
}

/* ==========================================================================
   OPENING CONTROLLER: PLAY BUTTON -> ROTATING FLOWER -> SPLIT SCREEN
   ========================================================================== */
function initOpeningFlow() {
  const openingScreen = document.getElementById('opening-screen');
  const playBtn = document.getElementById('opening-play-btn');
  const flowerBox = document.getElementById('opening-flower-box');

  if (!openingScreen || !playBtn || !flowerBox) return;

  playBtn.addEventListener('click', () => {
    // Xin quyền cảm biến con quay hồi chuyển trên iOS 13+ khi người dùng click
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }

    // 1. Nút play mờ và thu nhỏ dần
    playBtn.classList.add('fade-out');

    // 2. Hiển thị bông hoa xoay tròn ở chính giữa
    setTimeout(() => {
      playBtn.style.display = 'none';
      flowerBox.classList.add('spinning');
    }, 320);

    // 3. Sau khi bông hoa xoay ngắm nhìn (khoảng 1.5s), bông hoa nở tan biến
    setTimeout(() => {
      flowerBox.classList.add('flower-fade');
    }, 1800);

    // 4. Màn hình split làm 2 trượt sang 2 bên
    setTimeout(() => {
      openingScreen.classList.add('doors-open');
    }, 2200);

    // 5. Kết thúc hiệu ứng, loại bỏ opening overlay để thao tác bình thường
    setTimeout(() => {
      openingScreen.style.display = 'none';
    }, 3500);
  });
}
