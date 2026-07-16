import type { Metadata } from 'next';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, ChevronDown } from 'lucide-react';
import { ContactForm } from '@/features/inquiry';

export const metadata: Metadata = {
  title: 'Contact Us – Gamanalk',
  description: 'Get in touch with Gamanalk. We respond to all inquiries within 2 hours.',
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
          alt="Contact Gamanalk"
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
                <p>info@Gamanalk.lk</p>
                <p>bookings@Gamanalk.lk</p>
              </div>
              <a href="mailto:info@Gamanalk.lk" className="text-teal-600 font-medium text-sm hover:text-teal-700">
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
                <div className="flex gap-3">
                  {/* Facebook */}
                  <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[#1877F2] flex items-center justify-center transition-colors group">
                    <svg className="w-5 h-5 fill-gray-500 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://www.instagram.com/sri_way_tours?igsh=MWE0Nm96N3R6b2d1Yw%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] flex items-center justify-center transition-all group">
                    <svg className="w-5 h-5 fill-gray-500 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  {/* TripAdvisor */}
                  <a href="#" aria-label="TripAdvisor" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[#34E0A1] flex items-center justify-center transition-colors group">
                    <svg className="w-5 h-5 fill-gray-500 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                      <path d="M12.006 4.295c-2.67 0-5.34.617-7.74 1.867L0 6.289l2.16 2.16c-1.2 1.44-1.92 3.24-1.92 5.22 0 4.56 3.72 8.28 8.28 8.28 2.28 0 4.32-.9 5.88-2.4l1.56 1.56 1.56-1.56c1.56 1.5 3.6 2.4 5.88 2.4 4.56 0 8.28-3.72 8.28-8.28 0-1.98-.72-3.78-1.92-5.22l2.16-2.16-4.266-.127c-2.4-1.25-5.07-1.867-7.746-1.867zm-3.54 4.26c2.4 0 4.32 1.92 4.32 4.32s-1.92 4.32-4.32 4.32-4.32-1.92-4.32-4.32 1.92-4.32 4.32-4.32zm7.08 0c2.4 0 4.32 1.92 4.32 4.32s-1.92 4.32-4.32 4.32-4.32-1.92-4.32-4.32 1.92-4.32 4.32-4.32zm-7.08 1.68a2.64 2.64 0 100 5.28 2.64 2.64 0 000-5.28zm7.08 0a2.64 2.64 0 100 5.28 2.64 2.64 0 000-5.28zm-7.08 1.32a1.32 1.32 0 110 2.64 1.32 1.32 0 010-2.64zm7.08 0a1.32 1.32 0 110 2.64 1.32 1.32 0 010-2.64z"/>
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a href="#" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[#25D366] flex items-center justify-center transition-colors group">
                    <svg className="w-5 h-5 fill-gray-500 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
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
            <h3 className="font-bold text-gray-900">Gamanalk</h3>
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
