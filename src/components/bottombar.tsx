import React from 'react'
import { Button } from './ui/button';

interface Props {
    price?: number;
    eventId?: string;
}

const BottomBar: React.FC<Props> = ({ price }) => {
    return (
        <div className='flex fixed z-50 bottom-0 px-12 justify-between items-center w-screen h-[80px] bg-white shadow-inner shadow-neutral-400'>
            <p className="font-bold text-2xl">{price === 0 ? "FREE" : `$${price}`}</p>
            <Button className='bg-[#24AE7C] hover:bg-[#329c75] text-white scale-110'>Purchase Ticket</Button>
        </div>
    )
}

export default BottomBar;