import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Event from "./ui/event";
import { Button } from "./ui/button";

interface Event {
    _id: string;
    title: string;
    location: string;
    date: string;
    price: number;
    availableSeats: number;
    bookedSeats: number;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();

    const location = searchParams.get("location");
    const eventName = searchParams.get("event");
    const category = searchParams.get("category");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const fetchEvents = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const query: { location?: string; name?: string; category?: string; page: string; dateFrom?: string; dateTo?: string } = { page: `${page}` };

            if (location) {
                query.location = location;
            }

            if (eventName) {
                query.name = eventName;
            }

            if (category) {
                query.category = category;
            }

            if (dateFrom) {
                query.dateFrom = dateFrom;
            }

            if (dateTo) {
                query.dateTo = dateTo;
            }

            const queryString = new URLSearchParams(query as Record<string, string>).toString();
            const response = await fetch(`/api/events?${queryString}`);
            const data = await response.json();

            if (response.ok) {
                if (page === 1) {
                    setEvents(data.events);
                } else {
                    setEvents((prevEvents) => [...prevEvents, ...data.events]);
                }
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } else {
                console.error("Failed to fetch events:", data.error);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    }, [location, eventName, category, dateFrom, dateTo]);

    useEffect(() => {
        fetchEvents(1);
    }, [location, eventName, category, dateFrom, dateTo, fetchEvents]);

    const loadMoreEvents = () => {
        if (currentPage < totalPages && !loading) {
            fetchEvents(currentPage + 1);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {events.length > 0 ? (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2">
                        {events.map((event) => (
                            <Event key={event._id} data={event} />
                        ))}
                    </div>
                    {currentPage < totalPages && (
                        <div className="flex justify-center">
                            <Button
                                className="my-10 px-4 py-2 bg-[#24AE7C] hover:bg-[#329c75] text-white rounded"
                                onClick={loadMoreEvents}
                            >
                                Load More
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[68vw] text-center">
                        <p className="font-bold">No events found!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;