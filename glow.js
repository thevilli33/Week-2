/**
 * Fractal noise glow animation for pricing cards.
 * Uses SVG feTurbulence (Perlin-like noise) to drive organic pulse movement.
 */
(function () {
  // Fractal noise approximation: layered sine waves for organic, non-repeating movement
  function fractNoise(t) {
    const a = Math.sin(t * 1.1) * 43758.5453;
    const b = Math.sin(t * 2.3 + 1) * 23421.631;
    const c = Math.sin(t * 3.7 + 2) * 19191.919;
    const x = (a - Math.floor(a)) + (b - Math.floor(b)) + (c - Math.floor(c));
    return ((x / 3) * 1000) % 1000;
  }

  function initGlow() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;';
    svg.innerHTML = `
      <defs>
        <filter id="glow-noise" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="0" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="28" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    `;
    document.body.insertBefore(svg, document.body.firstChild);

    const turbulence = svg.querySelector('feTurbulence');
    if (!turbulence) return;

    let start = performance.now();
    function animate(now) {
      const t = (now - start) * 0.001;
      turbulence.setAttribute('seed', fractNoise(t));
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlow);
  } else {
    initGlow();
  }
})();
