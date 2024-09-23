import Image from 'next/image';
import React from 'react';
import { FaRegClock } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import Link from 'next/link';

interface Props {
    data: any
}

const Event: React.FC<Props> = ({ data }) => {

    return (
        <Link key={data._id} href={`/event/${data._id}`} className="h-[400px] w-[400px] flex flex-col justify-between hover:cursor-pointer transition-transform transform hover:scale-105 hover:z-10">
            <div className="relative">
                <Image
                    src="/images/mockhead.png"
                    alt="Mockup event image"
                    width={400}
                    height={250}
                    className="w-[400px] h-[250px]"
                />
                <div className="absolute top-4 left-4 w-[50px] h-[50px] bg-[#24AE7C] text-white font-bold flex flex-col items-center justify-center rounded-full shadow-lg">
                    <p className="text-xl font-bold">{new Date(data.date).getDate()}</p>
                    <p className="text-sm -mt-1 font-bold">{new Date(data.date).toLocaleString("en-US", { month: "short" })}</p>
                </div>
                <h3 className="text-3xl font-semibold mt-1 text-wrap">{data.title}</h3>
            </div>
            <div className="flex flex-col">
                <p className="font-bold text-lg">{data.price === 0 ? "FREE" : `$${data.price}`}</p>
                <p className="text-gray-600 flex flex-row gap-1 items-center">
                    <IoLocationOutline /> {data.location.split(',')[0]}
                </p>
                <p className="text-gray-600 flex flex-row gap-1 items-center">
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
    )
}

export default Event;