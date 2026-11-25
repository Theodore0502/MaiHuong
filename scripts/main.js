/**
 * MAI HUONG - 2.5D MULTI-LAYER PARALLAX ENGINE
 * High Performance Parallax Controller with Lerp Easing & Idle Auto-Sleep
 */

document.addEventListener('DOMContentLoaded', () => {
  initParallaxEngine();
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
    if (clusterBg) clusterBg.style.transform = `translate(${bgX}px, ${bgY}px)`;

    // 2. Cluster MID: Medium forward translation (Focuses on Mai Huong)
    const midX = (x * 16).toFixed(1);
    const midY = (y * 10).toFixed(1);
    if (clusterMid) clusterMid.style.transform = `translate(${midX}px, ${midY}px)`;

    // 3. Cluster FG (Bộ F: F1, F2, F3)
    const fgX = (x * 28).toFixed(1);
    const fgY = (y * 18).toFixed(1);
    if (clusterFg) clusterFg.style.transform = `translate(${fgX}px, ${fgY}px)`;

    // 4. Cluster SF: Tách riêng độc lập khỏi bộ F, độ sâu cận cảnh cao hơn
    const sfX = (x * 38).toFixed(1);
    const sfY = (y * 24).toFixed(1);
    if (clusterSf) clusterSf.style.transform = `translate(${sfX}px, ${sfY}px)`;

    // 5. Cluster TOP: Lớp SSF1 trên cùng
    const topX = (x * 42).toFixed(1);
    const topY = (y * 26).toFixed(1);
    if (clusterTop) clusterTop.style.transform = `translate(${topX}px, ${topY}px)`;
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
