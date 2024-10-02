"use client";
import { Suspense } from 'react';
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import Events from "@/components/events";
import Filter from '@/components/ui/filter-card';
import { DateRange } from 'react-day-picker';

function SearchParamsHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (filters: { category?: string; date?: DateRange }) => {
        const currentQuery = new URLSearchParams(searchParams.toString());

        if (filters.category) {
            currentQuery.set('category', filters.category);
        }

        if (filters.date?.from) {
            currentQuery.set('dateFrom', filters.date.from.toISOString());
        }

        if (filters.date?.to) {
            currentQuery.set('dateTo', filters.date.to.toISOString());
        }

        router.push(`/explore?${currentQuery.toString()}`);
    };

    return <Filter onFilterChange={handleFilterChange} />;
}

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
        <div className="w-full h-full">
            <Navbar className="fixed w-full z-50" />
            <Image
                src="/images/explorebg.png"
                width={1920}
                height={446}
                alt="background"
                className="w-full object-cover h-[250px] md:h-[446px] -z-10 pt-20"
            />
            <div className="relative w-full h-full inset-0 flex flex-col gap-10 -mt-56 sm:-mt-64">
                <h1 className="text-white mt-20 sm:mt-28 md:mt-0 text-xl md:text-5xl md:w-[600px] font-bold text-left text-wrap ml-4 sm:ml-[17.5%]">
                    Discover events for all the things you love!
                </h1>
                <div className="flex flex-row ml-4 gap-[0.4] sm:gap-0 sm:ml-[17.5%]">
                    <div className="relative">
                        <IoLocationOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            className="w-[120px] placeholder:text-xs placeholder:-ml-6 md:w-[200px] rounded-none pl-10"
                            name="location"
                            type="text"
                            placeholder="Enter Location"
                            ref={locationRef}
                        />
                    </div>
                    <div className="relative">
                        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            className="w-[120px] placeholder:text-xs placeholder:-ml-6 md:w-[200px] rounded-none pl-10"
                            name="event"
                            type="text"
                            placeholder="Search Event"
                            ref={eventRef}
                        />
                    </div>
                    <Button
                        className="rounded-none text-xs w-[70px] md:w-[150px] bg-[#24AE7C] hover:bg-[#329c75]"
                        onClick={handleFindEvents}
                    >
                        Find Events
                    </Button>
                </div>
                <div className="w-full flex flex-row">
                    <Suspense fallback={<div>Loading Filters...</div>}>
                        <SearchParamsHandler />
                    </Suspense>
                    <Suspense fallback={<div>Loading Events...</div>}>
                        <Events />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}