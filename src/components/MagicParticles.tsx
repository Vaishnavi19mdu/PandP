import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

export const MagicParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Fit canvas to display size or container
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Color swatches for subtle magic aura
    const colors = [
      "rgba(230, 192, 106, 0.45)", // Soft Gold
      "rgba(103, 141, 198, 0.35)", // Lavender blue
      "rgba(244, 241, 236, 0.50)", // Stardust White
      "rgba(233, 203, 172, 0.40)", // Cream sparkle
    ];

    const createParticle = (initYAtBottom = false): Particle => {
      const w = canvas.width;
      const h = canvas.height;
      return {
        x: Math.random() * w,
        y: initYAtBottom ? h + 10 : Math.random() * h,
        size: Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -(Math.random() * 0.6 + 0.15),
        opacity: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.003 + 0.001,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Initialize initial pool of floating dust motes
    const initialCount = Math.min(65, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < initialCount; i++) {
      particles.push(createParticle(false));
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Gentle horizontal sway
        p.x += p.speedX;
        p.y += p.speedY;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Render a soft glow around slightly larger particles
        if (p.size > 2.0) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#E6C06A";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Recycle particle if it drifts off top, side or fades fully
        if (p.y < 0 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = createParticle(true);
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none mix-blend-screen z-0"
      style={{ opacity: 0.85 }}
    />
  );
};

export default MagicParticles;
