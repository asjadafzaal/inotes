import React from 'react';

const Background = () => {
    return (
        <div className="flex flex-col items-center justify-center h-60 bg-white">
            <img
                src="/bgnote.png"
                alt="background"
                className="w-40 max-w-sm h-40 object-cover rounded mb-5"
            />
            <p className="text-gray-800 text-center text-sm md:text-base font-medium leading-relaxed tracking-wide px-2">
                Welcome to <span className="font-semibold text-blue-600">iNotes App</span>!
                Press the <span className="font-bold text-blue-500">plus</span> icon to add a Note.
            </p>

        </div>
    );
};

export default Background;
