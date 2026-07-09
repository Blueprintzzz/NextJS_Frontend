'use client';

const indicators = [
  {
    name: 'TripAdvisor',
    color: '#00AF87',
    svg: (
      <svg viewBox="0 0 512 512" className="w-8 h-8" fill="#00AF87">
        <path d="M383.9 235.3c0 26.4-21.4 47.8-47.8 47.8s-47.8-21.4-47.8-47.8 21.4-47.8 47.8-47.8 47.8 21.4 47.8 47.8zm-207.9 0c0 26.4-21.4 47.8-47.8 47.8s-47.8-21.4-47.8-47.8 21.4-47.8 47.8-47.8 47.8 21.4 47.8 47.8zm231.7-96.1c-37.3-34.4-87.3-55.4-140.7-56.8h-1.9c-.3 0-.7 0-1 0-53.9 0-103.2 19.8-141 52.6l-35.1-35.1H0l88.4 88.4C75 210.2 67 232.8 67 257.3c0 104.8 84.9 189.7 189.7 189.7S446.4 362.1 446.4 257.3c0-46.1-16.4-88.3-43.5-121.1l73.6-73.6h-88.5l-20.3 76.6zm-151.7 248c-74.1 0-134.2-60.1-134.2-134.2s60.1-134.2 134.2-134.2 134.2 60.1 134.2 134.2-60.1 134.2-134.2 134.2zm0-220.7c-47.8 0-86.6 38.8-86.6 86.6s38.8 86.6 86.6 86.6 86.6-38.8 86.6-86.6-38.8-86.6-86.6-86.6zm0 134.2c-26.3 0-47.6-21.3-47.6-47.6s21.3-47.6 47.6-47.6 47.6 21.3 47.6 47.6-21.3 47.6-47.6 47.6z"/>
      </svg>
    ),
  },
  {
    name: 'Booking.com',
    color: '#003580',
    svg: (
      <svg viewBox="0 0 512 200" className="h-8 w-auto" fill="none">
        <text x="0" y="160" fontSize="160" fontWeight="900" fill="#003580" fontFamily="Arial, sans-serif">B.</text>
        <text x="110" y="160" fontSize="120" fontWeight="700" fill="#003580" fontFamily="Arial, sans-serif">ooking</text>
        <text x="110" y="195" fontSize="38" fontWeight="400" fill="#003580" fontFamily="Arial, sans-serif">.com</text>
      </svg>
    ),
  },
  {
    name: 'Google Reviews',
    color: '#4285F4',
    svg: (
      <svg viewBox="0 0 272 92" className="h-8 w-auto">
        <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
        <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
        <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
        <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
        <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
        <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.67l-22.49.03z" fill="#4285F4"/>
      </svg>
    ),
  },
  {
    name: 'Expedia',
    color: '#FFC72C',
    svg: (
      <svg viewBox="0 0 180 60" className="h-8 w-auto" fill="none">
        <circle cx="30" cy="30" r="28" fill="#FFC72C"/>
        <path d="M30 10 L34 24 L48 24 L37 32 L41 46 L30 38 L19 46 L23 32 L12 24 L26 24 Z" fill="white"/>
        <text x="62" y="40" fontSize="28" fontWeight="800" fill="#1A1A2E" fontFamily="Arial, sans-serif">expedia</text>
      </svg>
    ),
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted by Leading Travel Platforms
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {indicators.map((indicator) => (
            <div
              key={indicator.name}
              className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default"
              title={indicator.name}
            >
              <div className="flex items-center justify-center h-10">
                {indicator.svg}
              </div>
              <span className="text-xs font-medium text-gray-500">{indicator.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
