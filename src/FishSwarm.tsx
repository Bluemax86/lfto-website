import React, { useEffect, useRef } from 'react';

interface Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const FishSwarm: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let fishes: Fish[] = [];
    const fishCount = 80;
    const speedLimit = 0.8; // Much slower for "ebbing" feel
    const visualRange = 150;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFishes();
    };

    const initFishes = () => {
      fishes = [];
      const colors = [
        '#26619C', // Lapis
        '#2E8B57', // Sea Green
        '#D2B48C', // Light Brown
        '#20B2AA', // Light Sea Green
      ];

      for (let i = 0; i < fishCount; i++) {
        fishes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: 1 + Math.random() * 2, // Back to smaller size
          color: colors[i % colors.length] + '88' // Increased alpha (was 33)
        });
      }
    };

    const distance = (f1: {x:number, y:number}, f2: {x:number, y:number}) => {
      return Math.sqrt((f1.x - f2.x) ** 2 + (f1.y - f2.y) ** 2);
    };

    const keepWithinBounds = (fish: Fish) => {
      const margin = 200;
      const turnFactor = 0.05; // Gentle turning

      if (fish.x < margin) fish.vx += turnFactor;
      if (fish.x > canvas.width - margin) fish.vx -= turnFactor;
      if (fish.y < margin) fish.vy += turnFactor;
      if (fish.y > canvas.height - margin) fish.vy -= turnFactor;
    };

    const flyTowardsCenter = (fish: Fish) => {
      const centeringFactor = 0.001; // Very gentle
      let centerX = 0;
      let centerY = 0;
      let neighbors = 0;

      for (let otherFish of fishes) {
        if (distance(fish, otherFish) < visualRange) {
          centerX += otherFish.x;
          centerY += otherFish.y;
          neighbors++;
        }
      }

      if (neighbors) {
        centerX = centerX / neighbors;
        centerY = centerY / neighbors;
        fish.vx += (centerX - fish.x) * centeringFactor;
        fish.vy += (centerY - fish.y) * centeringFactor;
      }
    };

    const avoidOthers = (fish: Fish) => {
      const minDistance = 40; // Spread them out more
      const avoidFactor = 0.01; // Very gentle avoidance
      let moveX = 0;
      let moveY = 0;

      for (let otherFish of fishes) {
        if (otherFish !== fish) {
          if (distance(fish, otherFish) < minDistance) {
            moveX += fish.x - otherFish.x;
            moveY += fish.y - otherFish.y;
          }
        }
      }

      fish.vx += moveX * avoidFactor;
      fish.vy += moveY * avoidFactor;
    };

    const matchVelocity = (fish: Fish) => {
      const matchingFactor = 0.02; // Smoothly align
      let avgVX = 0;
      let avgVY = 0;
      let neighbors = 0;

      for (let otherFish of fishes) {
        if (distance(fish, otherFish) < visualRange) {
          avgVX += otherFish.vx;
          avgVY += otherFish.vy;
          neighbors++;
        }
      }

      if (neighbors) {
        avgVX = avgVX / neighbors;
        avgVY = avgVY / neighbors;
        fish.vx += (avgVX - fish.vx) * matchingFactor;
        fish.vy += (avgVY - fish.vy) * matchingFactor;
      }
    };

    const limitSpeed = (fish: Fish) => {
      const speed = Math.sqrt(fish.vx ** 2 + fish.vy ** 2);
      if (speed > speedLimit) {
        fish.vx = (fish.vx / speed) * speedLimit;
        fish.vy = (fish.vy / speed) * speedLimit;
      }
      
      // Add slight drag
      fish.vx *= 0.99;
      fish.vy *= 0.99;
    };

    const drawFish = (fish: Fish, time: number) => {
      // Add a subtle sine-wave drift to the visual orientation
      const drift = Math.sin(time * 0.001 + fish.x * 0.01) * 0.2;
      const angle = Math.atan2(fish.vy, fish.vx) + drift;
      
      ctx.save();
      ctx.translate(fish.x, fish.y);
      ctx.rotate(angle);
      ctx.fillStyle = fish.color;
      
      // Softer, smaller shape (pill-like or tiny diamond)
      ctx.beginPath();
      ctx.ellipse(0, 0, fish.size * 2, fish.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let fish of fishes) {
        // Add a gentle global current/drift
        fish.vx += Math.sin(time * 0.0005) * 0.01;
        fish.vy += Math.cos(time * 0.0007) * 0.01;

        flyTowardsCenter(fish);
        avoidOthers(fish);
        matchVelocity(fish);
        limitSpeed(fish);
        keepWithinBounds(fish);

        fish.x += fish.vx;
        fish.y += fish.vy;

        drawFish(fish, time);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10, // Move to front so it's visible over solid backgrounds
        pointerEvents: 'none',
        opacity: 0.6 // Slightly reduced since it's now on top of content
      }}
    />
  );
};

export default FishSwarm;
