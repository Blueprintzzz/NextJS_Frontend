'use client';

import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { ContactForm } from '@/features/inquiry';

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Gamanalk</h1>
        <p className="text-gray-500 mt-2">We'd love to help you plan your perfect Sri Lanka adventure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ContactForm />

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Get In Touch</h2>

            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Phone</p>
                <p>+94 77 123 4567</p>
                <p>+94 11 234 5678</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Email</p>
                <p>info@Gamanalk.lk</p>
                <p>bookings@Gamanalk.lk</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Business Hours</p>
                <p>Monday – Friday: 8:00 AM – 6:00 PM</p>
                <p>Saturday: 9:00 AM – 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Address</p>
                <p>123 Galle Road, Colombo 03</p>
                <p>Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
