'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 20, suffix: '+', label: 'Years in Operation' },
  { value: 10000, suffix: '+', label: 'Happy Clients' },
  { value: 25, suffix: '', label: 'Destinations Covered' },
  { value: 50, suffix: '+', label: 'Tours Offered' },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Journey in Numbers
          </h2>
          <p className="text-teal-100 max-w-2xl mx-auto">
            Two decades of creating unforgettable travel experiences
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({ value, suffix, label }: Stat) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count}
        <span className="text-teal-200">{suffix}</span>
      </div>
      <p className="text-teal-100 text-sm md:text-base">{label}</p>
    </div>
  );
}