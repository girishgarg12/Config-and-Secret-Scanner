import React from 'react';
import { ShieldCheck, LayoutDashboard, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="border-b border-slate-700 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-primary-DEFAULT font-bold text-xl">
                            <ShieldCheck size={28} />
                            <span>ConfigSecure</span>
                        </Link>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <Link to="/history" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <History size={18} /> History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
