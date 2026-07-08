'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Compass } from 'lucide-react';

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
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Linkedin className="w-5 h-5" />
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