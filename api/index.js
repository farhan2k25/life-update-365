// api/index.js
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  
  // 1. Get Date Logic
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
  const percent = ((dayOfYear / totalDays) * 100).toFixed(1);

  // 2. Dots Logic
  const dots = [];
  for (let i = 1; i <= totalDays; i++) {
    let color = '#1c1c1e'; // Future
    let shadow = 'none';
    let scale = '1';

    if (i < dayOfYear) {
      color = '#ff3b30'; // Passed
    } else if (i === dayOfYear) {
      color = '#ffffff'; // Today
      shadow = '0 0 15px #fff';
      scale = '1.4';
    }
    dots.push({ color, shadow, scale });
  }

  // 3. Render as PNG Image
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: '#000',
          backgroundImage: 'linear-gradient(to bottom, #1a1c2c, #000)',
          paddingTop: '180px',
        }}
      >
        <div style={{ color: '#8e8e93', fontSize: 35, fontStyle: 'italic', marginBottom: 10 }}>Action is everything</div>
        <div style={{ color: 'white', fontSize: 130, fontWeight: 900, marginBottom: 10 }}>{year}</div>
        <div style={{ color: 'white', fontSize: 35, fontWeight: 800, letterSpacing: '4px' }}>
          {dayOfYear} / {totalDays} • {percent}%
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '330px', marginTop: '60px', gap: '11px' }}>
          {dots.map((dot, i) => (
            <div
              key={i}
              style={{
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                backgroundColor: dot.color,
                boxShadow: dot.shadow,
                transform: `scale(${dot.scale})`,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 2220,
    }
  );
                   }
