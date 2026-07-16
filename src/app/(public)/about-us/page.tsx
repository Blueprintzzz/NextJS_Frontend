import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart, Leaf, Award, Users, Lightbulb, Shield,
  CheckCircle, Phone, Mail
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us – Gamanalk',
  description: 'Learn about Gamanalk – our story, values, team and commitment to sustainable Sri Lanka tourism.',
};

const values = [
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'We believe in genuine experiences that connect travellers with the real soul of Sri Lanka.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Every journey is designed with environmental responsibility and community uplift in mind.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards in hospitality, safety and service quality.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Tourism that gives back – supporting local artisans, guides and small businesses.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Continuously evolving our experiences to match the modern traveller\'s expectations.',
  },
];

const milestones = [
  { year: '2003', title: 'Founded', description: 'Gamanalk was established in Colombo with a vision to showcase Sri Lanka\'s hidden treasures.' },
  { year: '2008', title: 'National Recognition', description: 'Awarded Best Tour Operator by the Sri Lanka Tourism Development Authority.' },
  { year: '2014', title: 'Sustainability Pledge', description: 'Launched our carbon-neutral tour programme and partnered with local conservation groups.' },
  { year: '2020', title: 'Digital Expansion', description: 'Brought our booking experience fully online, serving travellers across 50+ countries.' },
  { year: '2024', title: '10,000+ Travellers', description: 'Celebrated crossing the milestone of 10,000 happy guests exploring Sri Lanka with us.' },
];

const team = [
  { name: 'Priya Liyanage', title: 'Founder & CEO', bio: '20+ years in hospitality. Priya\'s passion for Sri Lanka drives every journey we craft.', image: 'https://picsum.photos/400/400?random=team1' },
  { name: 'Ruwan Perera', title: 'Head of Operations', bio: 'Ex-hotelier who ensures every itinerary runs like clockwork with genuine local insight.', image: 'https://picsum.photos/400/400?random=team2' },
  { name: 'Dilani Fernando', title: 'Experience Designer', bio: 'Curates our signature experiences, weaving culture, adventure and relaxation seamlessly.', image: 'https://picsum.photos/400/400?random=team3' },
  { name: 'Kamal Silva', title: 'Guest Relations', bio: 'Dedicated to making every guest feel at home, from inquiry to safe return.', image: 'https://picsum.photos/400/400?random=team4' },
];

const sustainability = [
  { icon: Leaf, title: 'Carbon-Neutral Tours', description: 'All tour emissions are offset through certified reforestation projects in Sri Lanka.' },
  { icon: Users, title: 'Local Community Support', description: 'Minimum 60% of our guides and partners are sourced from the communities we visit.' },
  { icon: Shield, title: 'Wildlife Conservation', description: 'Active contributor to elephant corridor protection and sea turtle nesting programmes.' },
  { icon: CheckCircle, title: 'Responsible Practices', description: 'Plastic-free travel kits, eco-lodges preferred, and responsible wildlife viewing guidelines enforced.' },
];

export default function AboutUsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080?random=about"
          alt="About Gamanalk"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Where Our Story Begins
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            Discover the Essence of Hospitality
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://picsum.photos/800/600?random=story"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Two Decades of Crafting Unforgettable Sri Lankan Journeys
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2003 in the heart of Colombo, Gamanalk was born from a single conviction - that Sri Lanka is one of the world&apos;s most extraordinary destinations, and that every traveller deserves to experience it authentically. What started as a boutique operation has grown into a full-spectrum travel company trusted by guests from over 50 countries.
              </p>
              <div className="bg-teal-50 border-l-4 border-teal-500 pl-6 py-4 rounded-r-lg">
                <p className="text-teal-800 font-semibold text-lg italic">
                  &ldquo;Our mission is to create journeys that are not just trips, but transformative life experiences that respect people, place and planet.&rdquo;
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our vision is to be Sri Lanka&apos;s most trusted travel partner - one that continually raises the bar for personalised, sustainable, and culturally rich tourism. Every itinerary we craft reflects our deep love for this island and our commitment to the communities that make it extraordinary.
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Journey</h3>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-teal-100 hidden md:block" />
              <div className="space-y-10">
                {milestones.map((m, i) => (
                  <div
                    key={m.year}
                    className={`flex flex-col md:flex-row gap-4 md:gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className={`md:w-1/2 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                      <span className="text-teal-500 font-bold text-lg">{m.year}</span>
                      <h4 className="font-bold text-gray-900 text-xl mt-0.5">{m.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{m.description}</p>
                    </div>
                    <div className="hidden md:flex w-10 h-10 rounded-full bg-teal-600 text-white items-center justify-center font-bold text-sm flex-shrink-0 z-10">
                      {i + 1}
                    </div>
                    <div className="md:w-1/2 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="text-center space-y-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                  <v.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">The People Behind Your Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="group text-center space-y-3">
                <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="144px" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-teal-600 text-sm font-medium">{member.title}</p>
                <p className="text-gray-600 text-sm px-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Awards & Recognition</h2>
            <p className="text-gray-600 mt-2">Industry recognition for our commitment to excellence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['SLTDA Excellence', 'TripAdvisor Travellers Choice', 'Sustainable Tourism Award', 'Green Globe Certified'].map((award, i) => (
              <div key={award} className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-gray-800 text-center">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-24 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-200 font-semibold uppercase tracking-widest text-sm mb-2">Green Travel</p>
            <h2 className="text-3xl md:text-4xl font-bold">Committed to Sustainable Tourism</h2>
            <p className="text-teal-100 mt-3 max-w-2xl mx-auto">
              We believe travel should enrich the destination, not diminish it. Our sustainability initiatives reflect this promise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sustainability.map((item) => (
              <div key={item.title} className="space-y-3 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <item.icon className="w-8 h-8 text-teal-200" />
                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                <p className="text-teal-100 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Learn More About Our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to travel responsibly?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of travellers who have trusted us to craft their perfect Sri Lankan story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tours"
              className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Plan Your Journey
            </Link>
            <Link
              href="/contact-us"
              className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
