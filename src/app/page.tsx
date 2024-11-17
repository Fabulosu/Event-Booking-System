import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Head from 'next/head';
import { QuoteIcon } from "lucide-react";
import { MdEventAvailable, MdSecurity, MdSupportAgent } from "react-icons/md";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  image: string;
  quote: string;
  name: string;
}

const features: Feature[] = [
  {
    icon: <MdEventAvailable className="w-12 h-12 text-[#24AE7C]" />,
    title: "Easy to Use",
    description: "Intuitive interface for creating and managing events effortlessly."
  },
  {
    icon: <MdSecurity className="w-12 h-12 text-[#24AE7C]" />,
    title: "Secure Payments",
    description: "Trusted by thousands for seamless and secure transactions."
  },
  {
    icon: <MdSupportAgent className="w-12 h-12 text-[#24AE7C]" />,
    title: "24/7 Support",
    description: "Dedicated support team available to assist you anytime."
  }
];

const testimonials: Testimonial[] = [
  {
    image: "/images/user1.jpg",
    quote: "The easiest platform I've ever used to organize my events. Simply brilliant!",
    name: "Sarah L."
  },
  {
    image: "/images/user2.jpg",
    quote: "Booking tickets was a breeze, and the event experience was amazing!",
    name: "Michael T."
  },
  {
    image: "/images/user3.jpg",
    quote: "Highly recommend! The team is super supportive, and the features are top-notch.",
    name: "Emily R."
  }
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>EventBooking - Simple Event Management Platform</title>
        <meta name="description" content="Create and manage your events easily with EventBooking. Start selling tickets in minutes!" />
        <meta name="keywords" content="event booking, event management, ticket sales" />
        <meta property="og:title" content="EventBooking - Simple Event Management Platform" />
        <meta property="og:description" content="Create and manage your events easily with EventBooking." />
        <meta property="og:image" content="/images/og-image.jpg" />
      </Head>

      <div className="relative w-full min-h-screen">
        <Navbar background={false} />

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-0" />
          <Image
            src="/images/landing.png"
            width={1440}
            height={741}
            alt="Event booking platform hero image"
            priority
            className="w-full h-[741px] object-cover -z-10"
          />
          <div className="absolute inset-0 flex flex-col items-center gap-10 pt-48 container mx-auto px-4">
            <h1 className="text-white text-5xl sm:text-6xl font-extrabold text-center leading-tight animate-fade-in">
              Event Booking <span className="text-[#24AE7C]">Made Simple</span>
            </h1>
            <p className="text-gray-200 text-lg sm:text-3xl font-medium text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Start selling tickets in just 2 minutes
            </p>
            <Link
              href="/events/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#24AE7C] hover:bg-[#329c75] w-[200px] h-[50px] text-lg animate-fade-in"
              )}
              style={{ animationDelay: "0.4s" }}
            >
              Create Event
            </Link>

            <div className="flex-col gap-3 pt-24 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p className="font-bold text-white text-lg sm:text-xl text-center mb-6">
                Trusted by
              </p>
              <div className="flex justify-evenly gap-6">
                {[1, 2, 3].map((i) => (
                  <Image
                    key={i}
                    src="/images/org1.png"
                    width={1200}
                    height={1200}
                    alt={`Organization ${i} logo`}
                    className="w-[64px] h-[64px] sm:w-[128px] sm:h-[128px] hover:scale-105 transition-all duration-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="bg-gray-100 py-24 px-6 sm:px-12">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Why Choose <span className="text-[#24AE7C]">Us?</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="mb-6 p-4 bg-gray-50 rounded-full group-hover:bg-[#24AE7C]/10 transition-colors duration-300">
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24 px-6 sm:px-12">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              What Our <span className="text-[#24AE7C]">Users Say</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.name}'s testimonial`}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-[#24AE7C] w-[80px] h-[80px]"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#24AE7C] rounded-full p-2">
                      <QuoteIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                  <span className="text-sm font-semibold text-[#24AE7C]">{testimonial.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#24AE7C] py-20 px-6 sm:px-12">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Event Journey?
            </h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful event organizers who trust our platform
            </p>
            <Link
              href="/events/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-[#24AE7C] hover:bg-gray-100 w-[200px] h-[50px] text-lg"
              )}
            >
              Get Started Free
            </Link>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-300 py-12 px-6 sm:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-white text-lg font-bold">SwitftSeats</h3>
                <p className="text-sm text-gray-400">
                  Making event management simple and efficient.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Quick Links</h4>
                <nav className="flex flex-col space-y-2">
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </nav>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Features</h4>
                <nav className="flex flex-col space-y-2">
                  <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                    Event Management
                  </Link>
                  <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                    Ticket Sales
                  </Link>
                  <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                    Analytics
                  </Link>
                </nav>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Connect</h4>
                <nav className="flex flex-col space-y-2">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    LinkedIn
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Facebook
                  </a>
                </nav>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-sm">© 2024 SwitftSeats. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}