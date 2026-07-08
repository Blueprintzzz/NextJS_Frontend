'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

interface HeroSectionProps {
  slides: HeroSlide[];
  autoRotateInterval?: number;
}

export function HeroSection({ slides, autoRotateInterval = 5000 }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, autoRotateInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoRotateInterval, slides.length]);

  if (!slides.length) return null;

  const slide = slides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover transition-transform duration-700"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
            {slide.title.split(' ').map((word, i) => (
              <span key={i} className="block sm:inline">
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md max-w-2xl mx-auto">
            {slide.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {slide.ctaText && slide.ctaLink && (
              <Link href={slide.ctaLink}>
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3">
                  {slide.ctaText}
                </Button>
              </Link>
            )}
            {slide.secondaryCtaText && slide.secondaryCtaLink && (
              <Link href={slide.secondaryCtaLink}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30 font-semibold px-8 py-3"
                >
                  {slide.secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            suppressHydrationWarning
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            suppressHydrationWarning
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              suppressHydrationWarning
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-teal-400 w-8' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}