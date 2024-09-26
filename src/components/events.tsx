import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Event from "./ui/event";

interface Event {
    _id: string;
    title: string;
    location: string;
    date: string;
    price: number;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const searchParams = useSearchParams();

    const location = searchParams.get("location");
    const eventName = searchParams.get("event");
    const category = searchParams.get("category");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const query: { location?: string; name?: string; category?: string } = {};

                if (location) {
                    query.location = location;
                }

                if (eventName) {
                    query.name = eventName;
                }

                if (category) {
                    query.category = category;
                }

                const queryString = new URLSearchParams(query).toString();
                const response = await fetch(`/api/events?${queryString}`);
                const data = await response.json();

                if (response.ok) {
                    setEvents(data);
                } else {
                    console.error("Failed to fetch events:", data.error);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [location, eventName, category]);

    return (
        <div className="flex justify-center">
            {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-10 md:gap-y-20 mt-10 sm:mt-20 mb-20 mx-4 md:mx-10 lg:mx-20">
                    {events.map((event) => (
                        <Event key={event._id} data={event} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-96">
                    <p className="font-bold text-center">No events found.</p>
                </div>
            )}
        </div>
    );
};

export default Events;