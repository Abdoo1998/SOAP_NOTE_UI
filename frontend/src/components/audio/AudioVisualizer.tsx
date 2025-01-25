import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

interface AudioVisualizerProps {
  stream: MediaStream | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { isDark } = useTheme();
  
  useEffect(() => {
    if (!stream) return;
    
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    source.connect(analyser);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average amplitude for glow effect
      const avgAmplitude = Array.from(dataArray).reduce((a, b) => a + b, 0) / bufferLength / 255;
      
      // Draw background glow
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (isDark) {
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.1 + avgAmplitude * 0.1})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      } else {
        gradient.addColorStop(0, `rgba(239, 246, 255, ${0.6 + avgAmplitude * 0.2})`);
        gradient.addColorStop(1, 'rgba(239, 246, 255, 0.2)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Define colors based on theme
      const colors = isDark ? [
        { stroke: 'rgba(59, 130, 246, 0.8)', fill: 'rgba(59, 130, 246, 0.2)' },
        { stroke: 'rgba(96, 165, 250, 0.6)', fill: 'rgba(96, 165, 250, 0.15)' },
        { stroke: 'rgba(147, 197, 253, 0.4)', fill: 'rgba(147, 197, 253, 0.1)' }
      ] : [
        { stroke: 'rgba(37, 99, 235, 0.7)', fill: 'rgba(37, 99, 235, 0.15)' },
        { stroke: 'rgba(59, 130, 246, 0.5)', fill: 'rgba(59, 130, 246, 0.1)' },
        { stroke: 'rgba(96, 165, 250, 0.3)', fill: 'rgba(96, 165, 250, 0.05)' }
      ];
      
      // Draw multiple waves with different phases
      const waves = 3;
      for (let wave = 0; wave < waves; wave++) {
        const phase = (wave * Math.PI * 2) / waves;
        const yOffset = height * 0.1 * wave;
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // Draw wave path
        for (let x = 0; x <= width; x += 2) {
          const index = Math.floor((x / width) * bufferLength);
          const amplitude = dataArray[index] / 255.0;
          const baseY = height * 0.5;
          const waveHeight = height * 0.3 * amplitude;
          
          // Create smooth wave using sine function
          const y = baseY + 
                   Math.sin((x * 0.02) + phase + (Date.now() * 0.002)) * waveHeight + 
                   yOffset;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Complete the path
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Fill wave
        ctx.fillStyle = colors[wave].fill;
        ctx.fill();
        
        // Stroke wave
        ctx.strokeStyle = colors[wave].stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw frequency bars on top
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i] / 255.0;
        const barHeight = height * 0.3 * amplitude;
        
        // Create gradient for bars
        const barGradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        if (isDark) {
          barGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          barGradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
        } else {
          barGradient.addColorStop(0, 'rgba(37, 99, 235, 0.7)');
          barGradient.addColorStop(1, 'rgba(37, 99, 235, 0.15)');
        }
        
        ctx.fillStyle = barGradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        // Add glow effect for active bars
        if (amplitude > 0.2) {
          ctx.fillStyle = isDark 
            ? `rgba(147, 197, 253, ${amplitude * 0.3})`
            : `rgba(37, 99, 235, ${amplitude * 0.2})`;
          ctx.fillRect(x, height - barHeight - 5, barWidth, barHeight + 5);
        }
        
        x += barWidth + 1;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      source.disconnect();
      audioContext.close();
    };
  }, [stream, isDark]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl overflow-hidden shadow-xl backdrop-blur-sm ${
        isDark 
          ? 'bg-gray-900/95' 
          : 'bg-white/95'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isDark
          ? 'from-blue-500/10 to-blue-600/5'
          : 'from-blue-100/50 to-blue-50/30'
      }`} />
      <canvas
        ref={canvasRef}
        className="w-full h-64"
        width={800}
        height={256}
      />
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-sm border ${
        isDark
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-gray-200/50'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className={`text-xs font-medium tracking-wider uppercase ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>
            Recording Active
          </span>
        </div>
      </div>
    </motion.div>
  );
};