import { FaRegBookmark } from "react-icons/fa";

interface DateCircleProps {
    date: string | Date;
}

const DateCircle: React.FC<DateCircleProps> = ({ date }) => {
    return (
        <div className="group absolute top-4 left-4 w-[40px] sm:w-[45px] md:w-[50px] h-[40px] sm:h-[45px] md:h-[50px] bg-[#24AE7C] text-white font-bold flex items-center justify-center rounded-full shadow-lg [perspective:1000px]">
            <div className="relative w-full h-full rounded-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Side */}
                <div className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]">
                    <p className="text-sm sm:text-base md:text-lg font-bold">
                        {new Date(date).getDate()}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base -mt-2 font-bold">
                        {new Date(date).toLocaleString('en-US', { month: 'short' })}
                    </p>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <FaRegBookmark size={28} />
                </div>
            </div>
        </div>
    );
};

export default DateCircle;
