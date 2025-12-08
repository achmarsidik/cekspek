// src/app/api/og/route.tsx
// Dynamic Open Graph Image Generator menggunakan @vercel/og

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Ambil parameter dari URL
    const title = searchParams.get('title') || 'CekSpek.id';
    const subtitle = searchParams.get('subtitle') || 'Database Smartphone Indonesia';
    const brand = searchParams.get('brand') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(to bottom right, #1e3a8a, #7c3aed)',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}
            >
              📱
            </div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              CekSpek.id
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              maxWidth: '900px',
              textAlign: 'center',
              padding: '0 50px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#e2e8f0',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
            {brand && (
              <div
                style={{
                  fontSize: '24px',
                  color: '#cbd5e1',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '12px 32px',
                  borderRadius: '999px',
                  marginTop: '20px',
                }}
              >
                {brand}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '20px',
              color: '#94a3b8',
            }}
          >
            🔍 Bandingkan • 📊 Spesifikasi • ⭐ Review
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

// Cara pakai:
// 1. Install package: npm install @vercel/og
// 2. Generate OG image dengan URL:
//    https://cekspek.vercel.app/api/og?title=Samsung Galaxy S24&brand=Samsung
// 3. Gunakan di metadata:
//    openGraph: {
//      images: ['/api/og?title=Samsung Galaxy S24&brand=Samsung']
//    }