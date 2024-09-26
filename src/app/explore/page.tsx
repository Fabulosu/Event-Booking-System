import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Events from "@/components/events";

export default function EventsPage() {
    const router = useRouter();
    const locationRef = useRef<HTMLInputElement>(null);
    const eventRef = useRef<HTMLInputElement>(null);

    const handleFindEvents = () => {
        const location = locationRef.current?.value;
        const event = eventRef.current?.value;

        const query: { location?: string; event?: string } = {};

        if (location && location.length > 0) {
            query.location = location;
        }

        if (event && event.length > 0) {
            query.event = event;
        }

        const queryString = new URLSearchParams(query).toString();
        router.push(`/explore${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <div className="relative w-full h-full">
            <Navbar className="fixed" />
            <Image
                src="/images/explorebg.png"
                width={1920}
                height={446}
                alt="background"
                className="w-full -z-10 pt-20"
            />
            <div className="absolute w-full h-full inset-0 flex flex-col gap-10 pt-48">
                <h1 className="text-white text-5xl w-[600px] font-bold text-left text-wrap ml-[21.54rem]">
                    Discover events for all the things you love!
                </h1>
                <div className="flex flex-row ml-[21.54rem]">
                    <div className="relative">
                        <IoLocationOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            className="w-[200px] rounded-none pl-10"
                            name="location"
                            type="text"
                            placeholder="Enter Location"
                            ref={locationRef}
                        />
                    </div>
                    <div className="relative">
                        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            className="w-[200px] rounded-none pl-10"
                            name="event"
                            type="text"
                            placeholder="Search Event"
                            ref={eventRef}
                        />
                    </div>
                    <Button
                        className="rounded-none w-[150px] bg-[#24AE7C] hover:bg-[#329c75]"
                        onClick={handleFindEvents}
                    >
                        Find Events
                    </Button>
                </div>
                <Events />
            </div>
        </div>
    );
}