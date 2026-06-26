'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  title?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export function CTASection({
  title = 'Ready to embark on your next adventure?',
  primaryText = 'Explore Tours',
  primaryLink = '/tours',
  secondaryText = 'Contact Us',
  secondaryLink = '/contact-us',
}: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-teal-500 to-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{title}</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={primaryLink}>
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3">
              {primaryText}
            </Button>
          </Link>
          <Link href={secondaryLink}>
            <Button
              size="lg"
              variant="secondary"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3"
            >
              {secondaryText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}