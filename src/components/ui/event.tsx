import Image from 'next/image';
import React from 'react';
import { FaRegClock } from 'react-icons/fa';
import { IoLocationOutline, IoTicketOutline } from 'react-icons/io5';
import Link from 'next/link';
import DateCircle from './date-circle';

interface EventData {
    _id: string;
    date: string | Date;
    title: string;
    price: number;
    location: string;
    availableSeats: number;
    bookedSeats: number;
}

interface Props {
    data: EventData
}

const Event: React.FC<Props> = ({ data }) => {
    return (
        <Link href={`/event/${data._id}`} className="h-[300px] sm:h-[350px] md:h-[439px] w-auto flex flex-col justify-between hover:cursor-pointer transition-transform transform hover:scale-105 hover:z-10">
            <div className="relative">
                <Image
                    src="/images/mockhead.png"
                    alt="Mockup event image"
                    width={400}
                    height={250}
                    className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[250px] object-cover"
                />
                <DateCircle date={data.date} />
                <h3 className="text-xl sm:text-2xl xl:text-3xl font-semibold mt-1 text-wrap h-16">{data.title}</h3>
            </div>
            <div className="flex flex-col">
                <p className="font-bold text-sm sm:text-base md:text-lg pt-5">{data.price === 0 ? "FREE" : `$${data.price}`}</p>
                {(data.availableSeats - data.bookedSeats) < 10 && (
                    <p className="text-gray-600 text-sm sm:text-base flex flex-row gap-1 items-center">
                        <IoTicketOutline /> {data.availableSeats - data.bookedSeats} Remaining
                    </p>
                )}
                <p className="text-gray-600 text-sm sm:text-base flex flex-row gap-1 items-center">
                    <IoLocationOutline /> {data.location.split(',')[1]}
                </p>
                <p className="text-gray-600 text-sm sm:text-base flex flex-row gap-1 items-center">
                    <FaRegClock />
                    {new Intl.DateTimeFormat("en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    }).format(new Date(data.date))}
                </p>
            </div>
        </Link>
    );
}

export default Event;