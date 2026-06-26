import type { Metadata } from 'next';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, ChevronDown } from 'lucide-react';
import { ContactForm } from '@/features/inquiry';

export const metadata: Metadata = {
  title: 'Contact Us – Sri Way Tours',
  description: 'Get in touch with Sri Way Tours. We respond to all inquiries within 2 hours.',
};

const faqs = [
  {
    q: 'How do I book a tour?',
    a: 'You can browse our tour packages and click "Book Now" on any tour page. Alternatively, contact us directly and we\'ll help you find the perfect package.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Cancellations made more than 7 days before the tour start date receive a full refund. Cancellations within 7 days are subject to a 50% fee. No-shows are non-refundable.',
  },
  {
    q: 'Do I need a visa to visit Sri Lanka?',
    a: 'Most nationals require an Electronic Travel Authorisation (ETA) to enter Sri Lanka. We recommend applying at eta.gov.lk at least 2 weeks before your trip.',
  },
  {
    q: 'Can I customise a tour package?',
    a: 'Absolutely! We specialise in bespoke itineraries. Contact our team and we\'ll design a journey tailored exactly to your preferences and budget.',
  },
  {
    q: 'Are your guides certified?',
    a: 'Yes. All our guides are certified by the Sri Lanka Tourism Development Authority and undergo regular training in safety, first aid, and cultural sensitivity.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, bank transfers, and PayPal. Payments are processed securely through our PCI-compliant gateway.',
  },
  {
    q: 'Is travel insurance included?',
    a: 'Travel insurance is not included in our packages but is highly recommended. We can recommend reputable providers, or you may purchase your own policy.',
  },
  {
    q: 'Do you cater for dietary requirements?',
    a: 'Yes. Please notify us of any dietary requirements when booking and we\'ll ensure all meals and refreshments on tour accommodate your needs.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-gray-200 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between p-5 cursor-pointer text-gray-900 font-medium hover:bg-gray-50 transition-colors list-none">
        {q}
        <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
      </summary>
      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
        {a}
      </div>
    </details>
  );
}

export default function ContactUsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080?random=contact"
          alt="Contact Sri Way Tours"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">Get In Touch</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Connect with Heartfelt Hospitality
          </h1>
          <p className="text-lg text-white/80">
            Where Conversations Spark Journeys
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow space-y-3">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Call Us</h3>
              <div className="text-gray-600 text-sm space-y-1">
                <p>+94 77 123 4567</p>
                <p>+94 11 234 5678</p>
              </div>
              <a href="tel:+94771234567" className="text-teal-600 font-medium text-sm hover:text-teal-700">
                Call now →
              </a>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow space-y-3">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                <Mail className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Email Us</h3>
              <div className="text-gray-600 text-sm space-y-1">
                <p>info@sriwaytours.lk</p>
                <p>bookings@sriwaytours.lk</p>
              </div>
              <a href="mailto:info@sriwaytours.lk" className="text-teal-600 font-medium text-sm hover:text-teal-700">
                Send email →
              </a>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow space-y-3">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Visit Us</h3>
              <div className="text-gray-600 text-sm space-y-1">
                <p>123 Galle Road, Colombo 03</p>
                <p>Sri Lanka</p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-medium text-sm hover:text-teal-700">
                View on map →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600">We typically respond within 2 hours during business hours.</p>
              </div>
              <ContactForm />
            </div>

            {/* Right info */}
            <div className="space-y-8">
              {/* Operating hours */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Operating Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-gray-900">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-gray-900">10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-red-500">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-teal-600 font-medium">⚡ Emergency support available 24/7</p>
              </div>

              {/* Response time */}
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <h3 className="font-bold text-teal-800 mb-2">Quick Response Guarantee</h3>
                <p className="text-teal-700 text-sm">
                  We respond to all inquiries within <strong>2 hours</strong> during business hours.
                  For urgent matters, call us directly or use the live chat.
                </p>
              </div>

              {/* Social links */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Follow Our Journeys</h3>
                <div className="flex gap-4">
                  {[
                    { name: 'Facebook', href: '#', color: 'bg-blue-100 text-blue-600' },
                    { name: 'Instagram', href: '#', color: 'bg-pink-100 text-pink-600' },
                    { name: 'Twitter', href: '#', color: 'bg-sky-100 text-sky-600' },
                    { name: 'TripAdvisor', href: '#', color: 'bg-green-100 text-green-600' },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${s.color} hover:opacity-80 transition-opacity`}
                      aria-label={s.name}
                    >
                      {s.name[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600">Common questions answered so you can travel with confidence.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-72 bg-gray-200 relative overflow-hidden">
        <Image
          src="https://picsum.photos/1920/400?random=map"
          alt="Office location map"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 text-center shadow-xl">
            <MapPin className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900">Sri Way Tours</h3>
            <p className="text-gray-600 text-sm">123 Galle Road, Colombo 03, Sri Lanka</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
