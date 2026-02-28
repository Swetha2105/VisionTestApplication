import { useEffect, useRef } from 'react';
import { ISHIHARA_PALETTES } from '../../data/constants';
import { lightenHex } from '../../utils/helpers';

export function IshiharaCanvas({ plate, size = 260 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const R = size / 2;
    const pal = ISHIHARA_PALETTES[plate.type] || ISHIHARA_PALETTES.normal;

    ctx.clearRect(0, 0, size, size);

    // Background circle with radial gradient
    const bgGrd = ctx.createRadialGradient(R * 0.7, R * 0.7, 2, R, R, R);
    bgGrd.addColorStop(0, '#ddd0bb');
    bgGrd.addColorStop(1, '#bfb0a0');
    ctx.beginPath();
    ctx.arc(R, R, R - 1, 0, Math.PI * 2);
    ctx.fillStyle = bgGrd;
    ctx.fill();

    // Render number to offscreen canvas to create dot mask
    const off = document.createElement('canvas');
    off.width = size; off.height = size;
    const otx = off.getContext('2d');
    otx.font = `900 ${Math.round(R * 0.65)}px Georgia,serif`;
    otx.textAlign = 'center';
    otx.textBaseline = 'middle';
    otx.fillStyle = '#000';
    otx.fillText(plate.number, R, R);
    const imgData = otx.getImageData(0, 0, size, size);

    const onNum = (x, y) => {
      const px = Math.round(x), py = Math.round(y);
      if (px < 0 || py < 0 || px >= size || py >= size) return false;
      return imgData.data[(py * size + px) * 4 + 3] > 80;
    };

    // Generate dots (Poisson-disc inspired)
    const dots = [];
    for (let i = 0; i < 1200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = Math.sqrt(Math.random()) * (R - 9);
      const x = R + dist * Math.cos(angle);
      const y = R + dist * Math.sin(angle);
      const r = 4 + Math.random() * 7;

      if (dots.some(d => Math.hypot(d.x - x, d.y - y) < d.r + r + 1.5)) continue;
      dots.push({ x, y, r, onNum: onNum(x, y) });
    }

    // Draw dots with 3D gradient
    dots.forEach(d => {
      const palette = d.onNum ? pal.fg : pal.bg;
      const base = palette[Math.floor(Math.random() * palette.length)];
      const grd = ctx.createRadialGradient(
        d.x - d.r * 0.28, d.y - d.r * 0.28, 1,
        d.x, d.y, d.r
      );
      grd.addColorStop(0, lightenHex(base, 24));
      grd.addColorStop(1, base);
      ctx.shadowBlur = 2;
      ctx.shadowColor = 'rgba(0,0,0,0.14)';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    // Outer border
    ctx.beginPath();
    ctx.arc(R, R, R - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [plate, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{ borderRadius:'50%', display:'block', boxShadow:'0 8px 32px rgba(0,0,0,0.18)' }}
    />
  );
}
