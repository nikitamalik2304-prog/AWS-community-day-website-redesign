/**
 * Cursor Ring Field Animation Engine
 * Creates a dynamic particle grid field & cursor ring magnet hover effect
 * across the entire AWS Student Community Day website.
 */
(function () {
  "use strict";

  // Check reduced motion preference
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Create or grab canvas
  let canvas = document.getElementById("cursor-ring-field-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "cursor-ring-field-canvas";
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // State variables
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Mouse state with smooth Lerp tracking
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 150,
    targetRadius: 150,
    isHovering: false,
    activeCard: null,
  };

  // Ring visual effect state
  const ring = {
    x: -1000,
    y: -1000,
    size: 40,
    targetSize: 40,
    opacity: 0,
    targetOpacity: 0,
  };

  // Grid particles
  const GRID_SPACING = 36;
  let particles = [];

  // Colors Palette matching AWS Theme
  const COLORS = [
    { r: 255, g: 153, b: 0 },   // AWS Orange
    { r: 59,  g: 130, b: 246 },  // Cloud Blue
    { r: 148, g: 163, b: 184 },  // Slate Accent
    { r: 226, g: 232, b: 240 }   // Light Silver
  ];

  class Particle {
    constructor(x, y) {
      this.x0 = x;
      this.y0 = y;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      
      // Randomize color accent
      const colIdx = Math.random() < 0.35 ? 0 : (Math.random() < 0.7 ? 1 : Math.floor(Math.random() * COLORS.length));
      this.color = COLORS[colIdx];
      this.baseRadius = 1.2 + Math.random() * 1.2;
      this.radius = this.baseRadius;
      this.baseAlpha = 0.15 + Math.random() * 0.18;
      this.alpha = this.baseAlpha;
      this.angle = Math.random() * Math.PI * 2;
    }

    update(cursorX, cursorY, ringRadius) {
      const dx = cursorX - this.x0;
      const dy = cursorY - this.y0;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Ring repulsion / magnetic field alignment effect
      if (dist < ringRadius && dist > 0) {
        // Distance ratio (0 at center, 1 at boundary)
        const normDist = dist / ringRadius;
        
        // Peak displacement around the perimeter ring zone (normDist ~ 0.7 to 0.95)
        const ringDistFactor = Math.sin(normDist * Math.PI);
        const force = (1 - normDist) * 22 * ringDistFactor;

        const angle = Math.atan2(dy, dx);
        
        // Tangential swirl + radial push
        const targetX = this.x0 - Math.cos(angle) * force + Math.sin(angle) * 4;
        const targetY = this.y0 - Math.sin(angle) * force - Math.cos(angle) * 4;

        this.x += (targetX - this.x) * 0.15;
        this.y += (targetY - this.y) * 0.15;

        // Scale up and glow near ring
        this.radius = this.baseRadius + ringDistFactor * 2.8;
        this.alpha = Math.min(0.9, this.baseAlpha + (1 - normDist) * 0.65);
      } else {
        // Return smoothly to grid origin
        this.x += (this.x0 - this.x) * 0.08;
        this.y += (this.y0 - this.y) * 0.08;
        this.radius += (this.baseRadius - this.radius) * 0.08;
        this.alpha += (this.baseAlpha - this.alpha) * 0.08;
      }
    }

    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha.toFixed(2)})`;
      context.fill();
    }
  }

  function initGrid() {
    particles = [];
    const cols = Math.ceil(width / GRID_SPACING) + 1;
    const rows = Math.ceil(height / GRID_SPACING) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * GRID_SPACING;
        const y = j * GRID_SPACING;
        particles.push(new Particle(x, y));
      }
    }
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.scale(dpr, dpr);
    initGrid();
  }

  // Pointer position listeners
  function onMouseMove(e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    ring.targetOpacity = 1;

    // Check if hovering interactive element
    const interactiveTarget = e.target.closest(
      "a, button, input, select, textarea, .card-3d, .speaker-card, .team-card, .btn, .audience-card, .value-card, .essentials-card, .video-preview-card, .glimpse-card, .glimpse-reel, .faq-item"
    );

    if (interactiveTarget) {
      mouse.targetRadius = 210;
      ring.targetSize = 58;
      mouse.isHovering = true;
    } else {
      mouse.targetRadius = 150;
      ring.targetSize = 36;
      mouse.isHovering = false;
    }

    // Card spotlight mouse relative coordinates update
    const cardTarget = e.target.closest(
      ".card-3d, .speaker-card, .team-card, .audience-card, .value-card, .essentials-card, .video-preview-card, .glimpse-card, .glimpse-reel, .session-card, .btn"
    );

    if (cardTarget) {
      const rect = cardTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      cardTarget.style.setProperty("--mouse-x", `${relX}px`);
      cardTarget.style.setProperty("--mouse-y", `${relY}px`);
      cardTarget.style.setProperty("--mouse-x-pct", `${(relX / rect.width) * 100}%`);
      cardTarget.style.setProperty("--mouse-y-pct", `${(relY / rect.height) * 100}%`);
    }
  }

  function onMouseLeave() {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
    ring.targetOpacity = 0;
  }

  // Render Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Lerp mouse coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.12;
    mouse.y += (mouse.targetY - mouse.y) * 0.12;
    mouse.radius += (mouse.targetRadius - mouse.radius) * 0.1;

    ring.x += (mouse.targetX - ring.x) * 0.18;
    ring.y += (mouse.targetY - ring.y) * 0.18;
    ring.size += (ring.targetSize - ring.size) * 0.15;
    ring.opacity += (ring.targetOpacity - ring.opacity) * 0.1;

    // Draw particle field
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(mouse.x, mouse.y, mouse.radius);
      particles[i].draw(ctx);
    }

    // Draw Cursor Field Ring Aura if on screen
    if (ring.opacity > 0.01 && mouse.x > -500) {
      ctx.save();

      // Outer Expanding Field Ring Wave
      const ringGlow = ctx.createRadialGradient(
        ring.x, ring.y, ring.size * 0.4,
        ring.x, ring.y, mouse.radius
      );
      
      if (mouse.isHovering) {
        ringGlow.addColorStop(0, "rgba(255, 153, 0, 0.22)");
        ringGlow.addColorStop(0.5, "rgba(59, 130, 246, 0.12)");
        ringGlow.addColorStop(1, "rgba(255, 153, 0, 0)");
      } else {
        ringGlow.addColorStop(0, "rgba(59, 130, 246, 0.14)");
        ringGlow.addColorStop(0.6, "rgba(255, 153, 0, 0.08)");
        ringGlow.addColorStop(1, "rgba(59, 130, 246, 0)");
      }

      ctx.beginPath();
      ctx.arc(ring.x, ring.y, mouse.radius, 0, Math.PI * 2);
      ctx.fillStyle = ringGlow;
      ctx.fill();

      // Cursor Precision Ring Perimeter
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.size / 2, 0, Math.PI * 2);
      ctx.lineWidth = mouse.isHovering ? 2 : 1.5;
      ctx.strokeStyle = mouse.isHovering
        ? `rgba(255, 153, 0, ${0.85 * ring.opacity})`
        : `rgba(59, 130, 246, ${0.65 * ring.opacity})`;
      ctx.stroke();

      // Inner Core Dot
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.isHovering ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = mouse.isHovering
        ? `rgba(255, 153, 0, ${0.9 * ring.opacity})`
        : `rgba(255, 255, 255, ${0.95 * ring.opacity})`;
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  // Setup Event Listeners
  window.addEventListener("resize", resize);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseleave", onMouseLeave);

  // Initialize
  resize();
  requestAnimationFrame(render);
})();
