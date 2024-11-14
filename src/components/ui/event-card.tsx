import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsFillPeopleFill } from "react-icons/bs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoTicket } from 'react-icons/io5';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface EventData {
    _id: string;
    date: string | Date;
    title: string;
    price: number;
    city: string;
    availableSeats: number;
    bookedSeats: number;
    imageUrl: string;
}

interface Props {
    data: EventData;
}

const EventCard: React.FC<Props> = ({ data }) => {
    const [bookingsData, setBookingsData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data._id) {
            const fetchBookingsData = async () => {
                try {
                    const response = await fetch(`/api/bookings/${data._id}`);
                    const result = await response.json();
                    if (result.success && Array.isArray(result.bookings)) {
                        const today = new Date();
                        const last10Days = Array.from({ length: 10 }, (_, i) => {
                            const date = new Date(today);
                            date.setDate(today.getDate() - i);
                            return date.toISOString().split('T')[0];
                        }).reverse();

                        const counts = last10Days.map(day => (
                            result.bookings.filter((booking: { bookingDate: string }) =>
                                new Date(booking.bookingDate).toISOString().split('T')[0] === day
                            ).length
                        ));
                        setBookingsData(counts);
                    }
                } catch (error) {
                    console.error("Failed to fetch bookings data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBookingsData();
        }
    }, [data._id]);

    const chartData = {
        labels: Array.from({ length: 10 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (9 - i));
            return date.toLocaleDateString();
        }),
        datasets: [
            {
                label: 'Bookings per day',
                data: bookingsData,
                borderColor: '#24AE7C',
                backgroundColor: 'rgba(36, 174, 124, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className="min-w-3/4 w-3/4 flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
            <Image
                src={data.imageUrl ? `/uploads/${data.imageUrl}` : "/images/mockhead.jpg"}
                alt="Event Image"
                width={400}
                height={300}
                className="w-full lg:w-1/3 h-48 lg:h-auto object-cover"
            />

            <div className="flex flex-col justify-between p-4 lg:w-2/3">
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold mb-2">{data.title}</h2>
                    <p className="text-gray-600 text-sm lg:text-base mb-4">
                        {data.city}, {new Date(data.date).toLocaleDateString()}
                    </p>

                    {loading && (
                        <p>Graph is loading...</p>
                    )}

                    {!loading && bookingsData.length > 0 && (
                        <div className="w-full h-32 mb-4">
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                    },
                                    scales: {
                                        y: { beginAtZero: true, grid: { display: false } },
                                        x: { grid: { display: false } },
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3 text-gray-700">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex items-center gap-2">
                                    <BsFillPeopleFill />
                                    <span>{data.bookedSeats}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{data.bookedSeats} attendees</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex items-center gap-2">
                                    <IoTicket />
                                    <span>{data.availableSeats - data.bookedSeats}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{data.availableSeats - data.bookedSeats} tickets left</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Link
                        href={`/events/edit/${data._id}`}
                        className="px-4 py-2 bg-[#24AE7C] hover:bg-[#329c75] text-white font-semibold rounded-lg transition"
                    >
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;