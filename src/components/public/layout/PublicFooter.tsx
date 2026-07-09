'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Compass } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About Us' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/tours', label: 'Tours' },
  { href: '/contact-us', label: 'Contact Us' },
];

const services = [
  { href: '/destinations', label: 'Destination Guides' },
  { href: '/tours', label: 'Tour Packages' },
  { href: '/vehicles', label: 'Vehicle Rental' },
  { href: '/contact-us', label: 'Group Bookings' },
];

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Compass className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-white tracking-tight">Sri Way</span>
                <span className="font-semibold text-xs text-teal-400 tracking-widest uppercase">Tours</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Crafting unforgettable journeys across Sri Lanka with authentic experiences and
              exceptional hospitality.
            </p>
            <div className="flex gap-3">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors group">
                <svg className="w-4 h-4 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/sri_way_tours?igsh=MWE0Nm96N3R6b2d1Yw%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] flex items-center justify-center transition-all group">
                <svg className="w-4 h-4 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* TripAdvisor */}
              <a href="#" aria-label="TripAdvisor" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#34E0A1] flex items-center justify-center transition-colors group">
                <svg className="w-4 h-4 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M12.006 4.295c-2.67 0-5.34.617-7.74 1.867L0 6.289l2.16 2.16c-1.2 1.44-1.92 3.24-1.92 5.22 0 4.56 3.72 8.28 8.28 8.28 2.28 0 4.32-.9 5.88-2.4l1.56 1.56 1.56-1.56c1.56 1.5 3.6 2.4 5.88 2.4 4.56 0 8.28-3.72 8.28-8.28 0-1.98-.72-3.78-1.92-5.22l2.16-2.16-4.266-.127c-2.4-1.25-5.07-1.867-7.746-1.867zm-3.54 4.26c2.4 0 4.32 1.92 4.32 4.32s-1.92 4.32-4.32 4.32-4.32-1.92-4.32-4.32 1.92-4.32 4.32-4.32zm7.08 0c2.4 0 4.32 1.92 4.32 4.32s-1.92 4.32-4.32 4.32-4.32-1.92-4.32-4.32 1.92-4.32 4.32-4.32zm-7.08 1.68a2.64 2.64 0 100 5.28 2.64 2.64 0 000-5.28zm7.08 0a2.64 2.64 0 100 5.28 2.64 2.64 0 000-5.28zm-7.08 1.32a1.32 1.32 0 110 2.64 1.32 1.32 0 010-2.64zm7.08 0a1.32 1.32 0 110 2.64 1.32 1.32 0 010-2.64z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors group">
                <svg className="w-4 h-4 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-teal-400 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p>info@sriwaytours.lk</p>
                  <p>bookings@sriwaytours.lk</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-400 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p>+94 77 123 4567</p>
                  <p>+94 11 234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className='w-4 h-4 text-teal-400 mt-0.5' />
                <div className="text-sm text-gray-400">
                  <p>123 Galle Road,</p>
                  <p>Colombo 03, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Sri Way Tours. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}