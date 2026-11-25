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

    // Auto-sleep when motion converges to destination (saves CPU/GPU)
    if (Math.abs(dx) < 0.0003 && Math.abs(dy) < 0.0003) {
      currentX = targetX;
      currentY = targetY;
      applyTransform(currentX, currentY);
      isLoopRunning = false;
      return;
    }

    // Lerp smoothing
    currentX += dx * 0.08;
    currentY += dy * 0.08;
    applyTransform(currentX, currentY);

    requestAnimationFrame(updateParallax);
  }

  function applyTransform(x, y) {
    // 1.1 Cluster B1: Bầu trời xa vô cực - dịch chuyển ngược chiều sâu nhất
    const b1X = (x * -24).toFixed(1);
    const b1Y = (y * -14).toFixed(1);
    if (clusterB1) clusterB1.style.transform = `translate3d(${b1X}px, ${b1Y}px, 0)`;

    // 1.2 Cluster B2 (B2, B2_1): Kiến trúc viễn cảnh - tách mạnh khỏi B1
    const b2X = (x * -12).toFixed(1);
    const b2Y = (y * -7).toFixed(1);
    if (clusterB2) clusterB2.style.transform = `translate3d(${b2X}px, ${b2Y}px, 0)`;

    // 1.3 Cluster B3: Cảnh quan trung hậu - tách độc lập
    const b3X = (x * -2).toFixed(1);
    const b3Y = (y * -1).toFixed(1);
    if (clusterB3) clusterB3.style.transform = `translate3d(${b3X}px, ${b3Y}px, 0)`;

    // 1.4 Cluster B4: Cảnh quan trung cảnh sau - tách độc lập khỏi B3
    const b4X = (x * 5).toFixed(1);
    const b4Y = (y * 3).toFixed(1);
    if (clusterB4) clusterB4.style.transform = `translate3d(${b4X}px, ${b4Y}px, 0)`;

    // 2. Cluster MID (Nhân vật C1): Làm tròn pixel nguyên (Math.round) & translate3d để triệt tiêu hoàn toàn mờ sub-pixel
    const midX = Math.round(x * 12);
    const midY = Math.round(y * 7);
    if (clusterMid) clusterMid.style.transform = `translate3d(${midX}px, ${midY}px, 0)`;

    // 2.1 Cluster C1_1 (Phụ kiện C1_1 tách độc lập khỏi C1)
    const c1_1X = Math.round(x * 14);
    const c1_1Y = Math.round(y * 8);
    if (clusterC1_1) clusterC1_1.style.transform = `translate3d(${c1_1X}px, ${c1_1Y}px, 0)`;

    // 3. Cluster FG (Bộ F: F0, F1, F2, F3)
    const fgX = (x * 28).toFixed(1);
    const fgY = (y * 18).toFixed(1);
    if (clusterFg) clusterFg.style.transform = `translate3d(${fgX}px, ${fgY}px, 0)`;

    // 4. Cluster SF: Tách riêng độc lập khỏi bộ F, độ sâu cận cảnh cao hơn
    const sfX = (x * 38).toFixed(1);
    const sfY = (y * 24).toFixed(1);
    if (clusterSf) clusterSf.style.transform = `translate3d(${sfX}px, ${sfY}px, 0)`;

    // 5. Cluster TOP: Lớp SSF1 trên cùng
    const topX = (x * 42).toFixed(1);
    const topY = (y * 26).toFixed(1);
    if (clusterTop) clusterTop.style.transform = `translate3d(${topX}px, ${topY}px, 0)`;
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

  // Phương pháp đo độ trễ: Khi DevTools đóng, lệnh debugger chạy trong 0.01ms (không kích hoạt)
  // Chỉ khi người dùng thực sự mở tab DevTools, trình duyệt mới bị hoãn (t1 - t0 > 100ms)
  setInterval(() => {
    const t0 = performance.now();
    (function() { return false; }["constructor"]("debugger")());
    const t1 = performance.now();

    if (t1 - t0 > 100) {
      triggerProtection(true);
    } else if (isDevToolsOpen) {
      triggerProtection(false);
    }
  }, 1000);
}

/* ==========================================================================
   OPENING CONTROLLER: PLAY BUTTON -> ROTATING FLOWER -> SPLIT SCREEN
   ========================================================================== */
function initOpeningFlow() {
  const openingScreen = document.getElementById('opening-screen');
  const playBtn = document.getElementById('opening-play-btn');
  const playWrapper = document.getElementById('opening-play-wrapper');
  const flowerBox = document.getElementById('opening-flower-box');

  if (!openingScreen || !flowerBox) return;

  let hasStarted = false;

  function handleStart() {
    if (hasStarted) return;
    hasStarted = true;

    // Xin quyền cảm biến con quay hồi chuyển trên iOS 13+ khi người dùng click/touch
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }

    // 1. Cụm play mờ và thu nhỏ dần
    if (playWrapper) {
      playWrapper.classList.add('fade-out');
    } else if (playBtn) {
      playBtn.classList.add('fade-out');
    }

    // 2. Hiển thị bông hoa xoay tròn ở chính giữa
    setTimeout(() => {
      if (playWrapper) playWrapper.style.display = 'none';
      else if (playBtn) playBtn.style.display = 'none';
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
      document.body.classList.add('artwork-revealed');
    }, 3500);
  }

  if (playBtn) {
    playBtn.addEventListener('click', handleStart);
  }
  if (playWrapper) {
    playWrapper.addEventListener('click', handleStart);
  }
}
