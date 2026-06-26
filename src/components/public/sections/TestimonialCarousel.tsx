'use client';

import { useState, useEffect } from 'react';
import { TestimonialCard } from '../cards/TestimonialCard';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'London, UK',
    rating: 5,
    text: 'An absolutely incredible experience! The guides were knowledgeable and the itinerary was perfectly planned. Sri Lanka exceeded all our expectations.',
  },
  {
    id: '2',
    name: 'Marco Rossi',
    location: 'Rome, Italy',
    rating: 5,
    text: 'The cultural tour was amazing. We got to experience the authentic side of Sri Lanka that most tourists miss. Highly recommended!',
  },
  {
    id: '3',
    name: 'Emma Chen',
    location: 'Singapore',
    rating: 5,
    text: 'From the moment we landed to our departure, everything was seamless. The hotels were beautiful and the service was exceptional.',
  },
  {
    id: '4',
    name: 'David Miller',
    location: 'Sydney, Australia',
    rating: 4,
    text: 'Great value for money. The wildlife safari was the highlight of our trip. Will definitely book with them again.',
  },
  {
    id: '5',
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5,
    text: 'As a fellow South Asian, I appreciated the attention to cultural details and the warm hospitality throughout our journey.',
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleItems = [];
  for (let i = 0; i < 3; i++) {
    const index = (current + i) % testimonials.length;
    visibleItems.push(testimonials[index]);
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from travelers who experienced the magic of Sri Lanka with us
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleItems.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                location={testimonial.location}
                rating={testimonial.rating}
                text={testimonial.text}
                avatar={testimonial.avatar}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current ? 'bg-teal-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}