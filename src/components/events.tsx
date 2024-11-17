"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Event from "./ui/event";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "./ui/skeleton";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

interface Event {
    _id: string;
    title: string;
    address: string;
    city: string;
    date: string;
    price: number;
    availableSeats: number;
    bookedSeats: number;
    imageUrl: string;
}

const EventsGrid = ({ events }: { events: Event[] }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
        <AnimatePresence>
            {events.map((event, index) => (
                <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Event data={event} />
                </motion.div>
            ))}
        </AnimatePresence>
    </motion.div>
);

const NoEvents = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center"
    >
        <Image
            src="/images/no-events.svg"
            alt="No events found"
            width={256}
            height={256}
            className="w-48 h-48 mb-4 opacity-50"
        />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No events found
        </h3>
        <p className="text-gray-500">
            Try adjusting your search or filters to find more events
        </p>
    </motion.div>
);

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const { ref, inView } = useInView();

    const fetchEvents = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const query = Object.fromEntries(searchParams.entries());
            query.page = String(page);

            const queryString = new URLSearchParams(query).toString();
            const response = await fetch(`/api/events?${queryString}`);
            const data = await response.json();

            if (response.ok) {
                if (page === 1) {
                    setEvents(data.events);
                } else {
                    setEvents((prev) => [...prev, ...data.events]);
                }
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchEvents(1);
    }, [searchParams, fetchEvents]);

    useEffect(() => {
        if (inView && !loading && currentPage < totalPages) {
            fetchEvents(currentPage + 1);
        }
    }, [inView, loading, currentPage, totalPages, fetchEvents]);

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {events.length > 0 ? (
                <>
                    <EventsGrid events={events} />
                    {currentPage < totalPages && (
                        <div ref={ref} className="flex justify-center py-8">
                            {loading ? (
                                <Skeleton className="h-10 w-32" />
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => fetchEvents(currentPage + 1)}
                                >
                                    Load More
                                </Button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <NoEvents />
            )}
        </div>
    );
};

export default Events;