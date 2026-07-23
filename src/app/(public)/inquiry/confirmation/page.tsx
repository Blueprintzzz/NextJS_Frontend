'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function InquiryConfirmationPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiry Submitted Successfully</h1>
        <p className="text-gray-500 mt-2">We'll get back to you within 24 hours.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600 space-y-1 text-left">
        <p className="font-medium text-gray-800 mb-2">What happens next?</p>
        <p>✓ Your inquiry has been received and logged.</p>
        <p>✓ A confirmation will be sent to your email.</p>
        <p>✓ Our team will respond within 24 hours.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Back to Home
        </Link>
        <Link href="/destinations" className="px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors">
          Continue Exploring
        </Link>
        <Link href="/packages" className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
          Browse Packages
        </Link>
      </div>
    </div>
  );
}
