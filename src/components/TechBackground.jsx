import React, { useEffect, useRef } from 'react';

const TechBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const particleCount = 120;
    const connectionDistance = 180;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        type: Math.random() > 0.7 ? 'data' : 'node'
      });
    }

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.03;
          particle.vy += (dy / distance) * force * 0.03;
          
          // Add repulsion effect for closer particles
          if (distance < 50) {
            particle.vx -= (dx / distance) * force * 0.05;
            particle.vy -= (dy / distance) * force * 0.05;
          }
        }

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        if (particle.type === 'data') {
          // Data particles (smaller, more numerous)
          ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
          ctx.fill();
          
          // Add glow effect
          ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Add inner glow
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
          ctx.fill();
        } else {
          // Node particles (larger, connection points)
          ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity})`;
          ctx.fill();
          
          // Add pulse effect
          const pulse = Math.sin(Date.now() * 0.005 + index) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity * pulse})`;
          ctx.fill();
          
          // Add outer ring
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(37, 99, 235, ${particle.opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
              const opacity = (connectionDistance - distance) / connectionDistance * 0.3;
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      // Draw tech grid lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add floating tech elements
      const time = Date.now() * 0.001;
      
      // Circuit paths with multiple paths
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 2;
      
      // Path 1
      ctx.beginPath();
      ctx.moveTo(100 + Math.sin(time) * 50, 100 + Math.cos(time) * 30);
      ctx.lineTo(300 + Math.cos(time * 0.7) * 40, 150 + Math.sin(time * 0.7) * 50);
      ctx.lineTo(500 + Math.sin(time * 0.5) * 60, 200 + Math.cos(time * 0.5) * 40);
      ctx.stroke();
      
      // Path 2
      ctx.beginPath();
      ctx.moveTo(canvas.width - 100 + Math.sin(time * 0.8) * 40, 80 + Math.cos(time * 0.8) * 40);
      ctx.lineTo(canvas.width - 300 + Math.cos(time * 0.6) * 50, 120 + Math.sin(time * 0.6) * 60);
      ctx.lineTo(canvas.width - 500 + Math.sin(time * 0.4) * 70, 180 + Math.cos(time * 0.4) * 50);
      ctx.stroke();

      // Data flow lines with varying speeds
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const x = (canvas.width / 8) * (i + 1);
        const y = canvas.height / 2 + Math.sin(time * (0.5 + i * 0.2)) * 120;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Add data points along the flow
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }
      
      // Add scanning lines effect
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 1;
      const scanY = (Math.sin(time * 0.3) * 0.5 + 0.5) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();
      
      // Add scanning line glow
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Add floating tech symbols
      const symbols = ['⚡', '🔗', '💻', '🌐', '🔧', '📡', '🚀', '⚙️', '🔮', '🎯'];
      for (let i = 0; i < 8; i++) {
        const x = (canvas.width / 9) * (i + 1) + Math.sin(time * (0.3 + i * 0.5)) * 40;
        const y = 80 + Math.cos(time * (0.2 + i * 0.3)) * 30;
        ctx.font = '20px Arial';
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(time + i) * 0.1})`;
        ctx.textAlign = 'center';
        ctx.fillText(symbols[i % symbols.length], x, y);
        
        // Add glow effect to symbols
        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 10;
        ctx.fillText(symbols[i % symbols.length], x, y);
        ctx.shadowBlur = 0;
      }
      
      // Add additional floating symbols in different areas
      const additionalSymbols = ['💡', '🎪', '🔬', '🧠', '🎨', '🔋'];
      for (let i = 0; i < 6; i++) {
        const x = 100 + (i * 150) % (canvas.width - 200) + Math.sin(time * (0.4 + i * 0.3)) * 25;
        const y = canvas.height - 150 + Math.cos(time * (0.3 + i * 0.4)) * 20;
        ctx.font = '18px Arial';
        ctx.fillStyle = `rgba(37, 99, 235, ${0.25 + Math.sin(time + i * 2) * 0.1})`;
        ctx.textAlign = 'center';
        ctx.fillText(additionalSymbols[i], x, y);
        
        // Add subtle glow
        ctx.shadowColor = 'rgba(37, 99, 235, 0.3)';
        ctx.shadowBlur = 8;
        ctx.fillText(additionalSymbols[i], x, y);
        ctx.shadowBlur = 0;
      }
      
      // Add matrix-style falling characters
      ctx.font = '12px monospace';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      for (let i = 0; i < 20; i++) {
        const x = (i * 50) % canvas.width;
        const y = (time * 50 + i * 30) % canvas.height;
        const char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
        ctx.fillText(char, x, y);
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default TechBackground; 