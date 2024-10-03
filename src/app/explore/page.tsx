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
        <div>
            <Navbar className="absolute w-full z-50" />
            <Image
                src="/images/explorebg.png"
                width={1920}
                height={446}
                alt="background"
                className="w-full object-cover h-[250px] md:h-[446px] -z-10 pt-20"
            />
            <div className='flex flex-col w-full lg:ml-64 -mt-36 md:-mt-64 justify-center'>
                <h1 className='text-white text-center lg:text-left lg:pl-2 lg:w-[500px] lg:text-4xl text-xl font-bold'>
                    Discover events for all the things you love!
                </h1>
                <div className='flex flex-row items-center mt-6 px-2'>
                    <div className='relative'>
                        <IoLocationOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            className="w-[120px] placeholder:text-xs md:w-auto rounded-none pl-10"
                            name="location"
                            type="text"
                            placeholder="Enter Location"
                            ref={locationRef}
                        />
                    </div>
                    <div className="relative">
                        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            className="w-[120px] placeholder:text-xs md:w-auto rounded-none pl-10"
                            name="event"
                            type="text"
                            placeholder="Search Event"
                            ref={eventRef}
                        />
                    </div>
                    <Button
                        className="rounded-none text-xs w-[65px] md:w-[150px] bg-[#24AE7C] hover:bg-[#329c75]"
                        onClick={handleFindEvents}
                    >
                        Search
                    </Button>
                </div>
            </div>
            <div className="w-full flex flex-col -mt-10 items-center lg:flex-row lg:items-start md:mt-20 lg:mt-32">
                <Suspense fallback={<div>Loading Filters...</div>}>
                    <SearchParamsHandler />
                </Suspense>
                <Suspense fallback={<div>Loading Events...</div>}>
                    <Events />
                </Suspense>
                <div className='lg:w-80' />
            </div>
        </div>
    );
}