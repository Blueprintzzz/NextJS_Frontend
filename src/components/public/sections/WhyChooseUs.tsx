'use client';

import Image from 'next/image';
import { Heart, Shield, Leaf, Users, Clock, Award } from 'lucide-react';

interface WhyItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const whyItems: WhyItem[] = [
  {
    icon: <Heart className="w-8 h-8 text-teal-600" />,
    title: 'Hospitality & Local Expertise',
    description:
      'Our team of local experts ensures authentic experiences with personalized attention to every detail.',
  },
  {
    icon: <Leaf className="w-8 h-8 text-teal-600" />,
    title: 'Sustainable Tourism',
    description:
      'We are committed to responsible travel that preserves Sri Lanka\'s natural beauty for future generations.',
  },
  {
    icon: <Clock className="w-8 h-8 text-teal-600" />,
    title: '24/7 Customer Support',
    description: 'Our dedicated support team is available around the clock to assist with any needs.',
  },
  {
    icon: <Shield className="w-8 h-8 text-teal-600" />,
    title: 'Safety & Quality Assurance',
    description: 'All our tours meet international safety standards with verified quality partners.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Sri Way Tours
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crafting memorable experiences with passion and expertise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              src="https://c8.alamy.com/comp/BPR7X8/collage-of-images-of-sri-lanka-BPR7X8.jpg"
              alt="Why Choose Us"
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {whyItems.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}