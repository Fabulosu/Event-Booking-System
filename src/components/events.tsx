import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Event from "./ui/event";

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

    const fetchEvents = async (page: number) => {
        setLoading(true); // Start loading
        try {
            const query: { location?: string; name?: string; category?: string; page: number } = { page };

            if (location) {
                query.location = location;
            }

            if (eventName) {
                query.name = eventName;
            }

            if (category) {
                query.category = category;
            }

            const queryString = new URLSearchParams(query as any).toString();
            const response = await fetch(`/api/events?${queryString}`);
            const data = await response.json();

            if (response.ok) {
                if (page === 1) {
                    setEvents(data.events); // Reset events on new query or page 1
                } else {
                    setEvents((prevEvents) => [...prevEvents, ...data.events]); // Append for subsequent pages
                }
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } else {
                console.error("Failed to fetch events:", data.error);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Fetch events when search parameters change or page changes
    useEffect(() => {
        fetchEvents(1); // Fetch the first page on new search
    }, [location, eventName, category]);

    // Load more events for pagination
    const loadMoreEvents = () => {
        if (currentPage < totalPages && !loading) {
            fetchEvents(currentPage + 1);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {events.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-10 md:gap-y-20 mt-10 sm:mt-20 mb-10 mx-4 md:mx-10 lg:mx-20">
                        {events.map((event) => (
                            <Event key={event._id} data={event} />
                        ))}
                    </div>

                    {currentPage < totalPages && (
                        <div className="flex justify-center">
                            <button
                                className="my-10 px-4 py-2 bg-[#329c75] text-white rounded"
                                onClick={loadMoreEvents}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-96">
                    <p className="font-bold text-center">No events found.</p>
                </div>
            )}
        </div>
    );
};

export default Events;