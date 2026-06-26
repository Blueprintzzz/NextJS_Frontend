'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated with Exclusive Offers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join 5,000+ travelers receiving travel tips & exclusive deals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white border-gray-300 focus:border-teal-500"
              required
            />
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 whitespace-nowrap">
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}