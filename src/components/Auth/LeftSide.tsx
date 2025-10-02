import React from 'react';
import Image from 'next/image';
import authLogo from "@/assets/authLogo.svg";

const LeftSide = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E3A8A]">
            <div className=" w-2/3 m-auto">
                <h1 className="text-white text-2xl">Welcome to</h1>
                <div className="flex items-center gap-6 my-6">
                    <Image
                        src={authLogo}
                        height={80}
                        width={80}
                        alt="Fishing boat in blue ocean waters"
                        className="object-cover h-16 xl:h-20 w-16 xl:w-20"
                        priority
                    />
                    <h1 className="text-white text-4xl xl:text-5xl 2xl:text-6xl font-extrabold">Dar El Chimal</h1>
                </div>
                <p className="text-white text-xl">
                    Your all-in-one hub for learning, teaching, growing together.
                    <br /><br />
                    Join a community of teachers and students making education simple, fun, and accessible—anytime, anywhere.
                </p>
            </div>
        </div>
    );
};

export default LeftSide;