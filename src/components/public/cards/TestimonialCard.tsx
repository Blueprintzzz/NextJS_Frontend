'use client';

import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
}

export function TestimonialCard({
  name,
  location,
  rating,
  text,
  avatar = 'https://picsum.photos/100/100?random=avatar',
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image src={avatar} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.56-.921 1.861 0l1.07 3.292a1 1 0 00.93.693h3.11c.94 0 1.341 1.24.588 1.81l-2.618 1.98a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.618-1.98a1 1 0 00-1.175 0l-2.618 1.98c-.775.57-1.83-.197-1.54-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.618-1.98c-.753-.57-.36-1.81.588-1.81h3.11a1 1 0 00.93-.693l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="text-gray-600 text-sm italic flex-1">"{text}"</p>
    </div>
  );
}