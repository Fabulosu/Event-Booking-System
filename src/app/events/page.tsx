"use client";
import Navbar from "@/components/navbar";
import EventCard from "@/components/ui/event-card";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

export default function EventsPage() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                const response = await axios.get(`/api/user/events?userId=${session?.user.id}`);
                if (response && response.data.success) {
                    setEvents(response.data.events);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (session?.user.id) {
            fetchUserEvents();
        }
    }, [session?.user.id])

    return (
        <div>
            <Navbar className="relative w-full z-50" />
            <div className="flex flex-col items-center">
                <h1 className="font-bold text-3xl">Manage your events</h1>
                {events.length > 0 ? (
                    <div className="flex flex-col items-center gap-3 pt-4">
                        {events.map((event) => (
                            <EventCard data={event} key={event._id} />
                        ))}
                    </div>
                ) : (
                    <div>
                        <p>No events found!</p>
                    </div>
                )}
            </div>
        </div>
    )
}