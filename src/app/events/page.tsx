// EventsPage.tsx
"use client";
import Navbar from "@/components/navbar";
import EventCard from "@/components/ui/event-card";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
    category: string;
}

export default function EventsPage() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/user/events?userId=${session?.user.id}`);
                if (response && response.data.success) {
                    setEvents(response.data.events);
                }
            } catch (error) {
                setError("Failed to load events. Please try again later.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        if (session?.user.id) {
            fetchUserEvents();
        }
    }, [session?.user.id])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar className="relative w-full z-50" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Your Events</h1>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/events/new"
                        className="bg-[#24AE7C] hover:bg-[#329c75] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        Create New Event
                    </motion.a>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-[#24AE7C]" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : events.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-6"
                    >
                        {events.map((event) => (
                            <EventCard key={event._id} data={event} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No events yet</h3>
                        <p className="text-gray-500 mb-6">Create your first event to get started!</p>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/events/create"
                            className="inline-block bg-[#24AE7C] hover:bg-[#329c75] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            Create Event
                        </motion.a>
                    </div>
                )}
            </div>
        </div>
    );
}