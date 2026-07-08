import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  scaleY: number;
}

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = [
      '#f59e0b', // Brand Amber
      '#ef4444', // Red-500
      '#3b82f6', // Blue-500
      '#10b981', // Green-500
      '#8b5cf6', // Purple-500
      '#ec4899', // Pink-500
      '#14b8a6', // Teal-500
    ];

    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    const particles: Particle[] = [];

    // Initialize particles from left and right sides (like a celebration blast)
    const createParticle = (side: 'left' | 'right' | 'center'): Particle => {
      const isLeft = side === 'left';
      const isRight = side === 'right';

      let x = width / 2;
      let y = height + 20;
      let vx = (Math.random() - 0.5) * 15;
      let vy = -Math.random() * 20 - 10;

      if (isLeft) {
        x = -10;
        y = height * 0.8;
        vx = Math.random() * 20 + 5;
        vy = -Math.random() * 18 - 8;
      } else if (isRight) {
        x = width + 10;
        y = height * 0.8;
        vx = -Math.random() * 20 - 5;
        vy = -Math.random() * 18 - 8;
      }

      return {
        x,
        y,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        vx,
        vy,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        scaleY: 1,
      };
    };

    // Spawn initial bursts
    for (let i = 0; i < 70; i++) {
      particles.push(createParticle('left'));
      particles.push(createParticle('right'));
    }

    // Occasional extra center bursts for the first 1.5 seconds
    const interval = setInterval(() => {
      if (particles.length < 250) {
        for (let i = 0; i < 5; i++) {
          particles.push(createParticle('left'));
          particles.push(createParticle('right'));
        }
      }
    }, 100);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const gravity = 0.4;
    const airResistance = 0.98;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.vx *= airResistance;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.scaleY = Math.sin(p.rotation * 0.05); // Simulated flipping in 3D space

        // Slowly fade out as they reach the lower part of screen or live too long
        if (p.y > height * 0.7) {
          p.opacity -= 0.015;
        }

        if (p.opacity <= 0 || p.x < -50 || p.x > width + 50) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(1, p.scaleY);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        if (p.shape === 'circle') {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'triangle') {
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    // Cleanup
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
}
