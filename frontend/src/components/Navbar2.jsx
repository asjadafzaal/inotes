import React from 'react'

const Navbar2 = () => {
    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">

                    {/* Logo */}
                    <img
                        src="/icon.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="text-2xl font-semibold text-blue-600">INotes</div>

                    {/* Centered Search Bar */}
                    <div className="flex-1 flex justify-center pl-20 mx-6">
                        <div className="relative w-full max-w-md">
                        </div>
                    </div>

                </div>
            </nav>
        </>
    )
}

export default Navbar2
