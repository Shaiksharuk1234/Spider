import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const Spider = () => {
  const canvasRef = useRef(null);

  // Cursor position tracking
  const cursorX = useMotionValue(window.innerWidth / 2);
  const cursorY = useMotionValue(window.innerHeight / 2);

  // Smooth cursor movement (faster response)
  const smoothX = useSpring(cursorX, { stiffness: 80, damping: 10 });
  const smoothY = useSpring(cursorY, { stiffness: 80, damping: 10 });

  // Insect movement variables
  const angle = useMotionValue(0);
  let insectRadius = 40; // Default distance from cursor

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let web = [];

    function createWeb() {
      web = [];
      for (let i = 0; i < 100; i++) {
        web.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
        });
      }
    }

    function drawWeb() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.5;

      const cursor = { x: smoothX.get(), y: smoothY.get() };

      web.forEach((point, index) => {
        let dx = cursor.x - point.x;
        let dy = cursor.y - point.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Faster attraction speed toward cursor
        let speedFactor = 0.03;
        point.vx += (dx / distance) * speedFactor;
        point.vy += (dy / distance) * speedFactor;

        // Apply velocity with damping
        point.vx *= 0.92;
        point.vy *= 0.92;
        point.x += point.vx;
        point.y += point.vy;

        // Draw web points
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Draw web connections
        for (let j = index + 1; j < web.length; j++) {
          const dist = Math.hypot(point.x - web[j].x, point.y - web[j].y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(web[j].x, web[j].y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(drawWeb);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createWeb();
    }

    window.addEventListener("resize", resizeCanvas);

    createWeb();
    drawWeb();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    // Animate insect movement faster
    const interval = setInterval(() => {
      angle.set(angle.get() + 0.1); // 🔥 Increased speed
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  const moveCursor = (e) => {
    // Adjust insect radius based on speed
    let speed = Math.hypot(e.movementX, e.movementY);
    insectRadius = Math.min(80, Math.max(20, speed * 4)); // Dynamic radius

    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  return (
    <div onMouseMove={moveCursor} className="relative w-screen h-screen bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0" />

      {/* 🕷️ Insect moving around cursor */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          transform: `translate(${Math.cos(angle.get()) * insectRadius}px, ${
            Math.sin(angle.get()) * insectRadius
          }px)`,
        }}
        className="absolute w-6 h-6 text-yellow-400 text-2xl"
      >
        🐜 {/* Replace with an image if needed */}
      </motion.div>
    </div>
  );
};

export default Spider;
