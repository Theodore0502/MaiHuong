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
  const clusterBg = document.getElementById('cluster-bg');
  const clusterMid = document.getElementById('cluster-mid');
  const clusterFg = document.getElementById('cluster-fg');
  const clusterSf = document.getElementById('cluster-sf');
  const clusterTop = document.getElementById('cluster-top');

  if (!stageWrapper || !clusterBg || !clusterMid || !clusterFg) return;

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

  // Device Orientation for Mobile / Tablet Gyroscope
  function onDeviceOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    // gamma: left-to-right [-90, 90], beta: front-to-back [-180, 180]
    const normX = Math.max(-1, Math.min(1, e.gamma / 30));
    const normY = Math.max(-1, Math.min(1, (e.beta - 40) / 30));

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
    // 1. Cluster BG: Subtle reverse translation for infinite depth
    const bgX = (x * -14).toFixed(1);
    const bgY = (y * -8).toFixed(1);
    if (clusterBg) clusterBg.style.transform = `translate3d(${bgX}px, ${bgY}px, 0)`;

    // 2. Cluster MID (Nhân vật C1 & C1_1): Làm tròn pixel nguyên (Math.round) & translate3d để triệt tiêu hoàn toàn mờ sub-pixel
    const midX = Math.round(x * 12);
    const midY = Math.round(y * 7);
    if (clusterMid) clusterMid.style.transform = `translate3d(${midX}px, ${midY}px, 0)`;

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

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);

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
  }, { capture: true });

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
  const flowerBox = document.getElementById('opening-flower-box');

  if (!openingScreen || !playBtn || !flowerBox) return;

  playBtn.addEventListener('click', () => {
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
