import Image from 'next/image';
import React from 'react';
import { FaRegClock } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import Link from 'next/link';

interface EventData {
    _id: string;
    date: string | Date;
    title: string;
    price: number;
    location: string;
}

interface Props {
    data: EventData
}

const Event: React.FC<Props> = ({ data }) => {
    return (
        <Link href={`/event/${data._id}`} className="h-[300px] sm:h-[350px] md:h-[400px] w-full sm:w-[300px] lg:w-[350px] xl:w-[400px] flex flex-col justify-between hover:cursor-pointer transition-transform transform hover:scale-105 hover:z-10">
            <div className="relative">
                <Image
                    src="/images/mockhead.png"
                    alt="Mockup event image"
                    width={400}
                    height={250}
                    className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[250px] object-cover"
                />
                <div className="absolute top-4 left-4 w-[40px] sm:w-[45px] md:w-[50px] h-[40px] sm:h-[45px] md:h-[50px] bg-[#24AE7C] text-white font-bold flex flex-col items-center justify-center rounded-full shadow-lg">
                    <p className="text-sm sm:text-base md:text-lg font-bold">{new Date(data.date).getDate()}</p>
                    <p className="text-xs sm:text-sm md:text-base -mt-2 font-bold">{new Date(data.date).toLocaleString("en-US", { month: "short" })}</p>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1 text-wrap">{data.title}</h3>
            </div>
            <div className="flex flex-col">
                <p className="font-bold text-sm sm:text-base md:text-lg">{data.price === 0 ? "FREE" : `$${data.price}`}</p>
                <p className="text-gray-600 text-sm sm:text-base flex flex-row gap-1 items-center">
                    <IoLocationOutline /> {data.location.split(',')[0]}
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