import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Navbar from "@/components/navbar";

export default function HomePage() {
  return (
    <div className="relative w-full h-full">
      <Navbar background={false} />
      <Image
        src="/images/landing.png"
        width={1440}
        height={741}
        alt="background"
        className="w-full h-[741px] object-cover -z-10"
      />
      <div className="absolute inset-0 flex flex-col items-center gap-10 pt-48">
        <h1 className="text-white text-6xl font-bold">
          Event booking made simple
        </h1>
        <p className="text-muted font-semibold text-3xl">Start selling tickets in 2 minutes</p>

        <Link
          href="/events/new"
          className={cn(buttonVariants({ size: "lg" }), "bg-[#24AE7C] hover:bg-[#329c75] w-[200px] h-[50px] text-lg")}
        >
          Create Event
        </Link>

        <div className="flex-col gap-3 pt-24">
          <p className="font-bold text-white text-xl text-center">Trusted by</p>
          <div className="flex justify-evenly gap-2">
            <Image src="/images/org1.png" width={1200} height={1200} alt="Organization image" className="w-[128px] h-[128px] hover:scale-105 transition-all" />
            <Image src="/images/org1.png" width={1200} height={1200} alt="Organization image" className="w-[128px] h-[128px] hover:scale-105 transition-all" />
            <Image src="/images/org1.png" width={1200} height={1200} alt="Organization image" className="w-[128px] h-[128px] hover:scale-105 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
