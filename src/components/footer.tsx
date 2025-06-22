"use client";

import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="relative bg-black text-gray-300 pt-12 px-6 md:px-20 border-t border-blue-900 overflow-hidden">
      {/* Footer content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Logo and tagline */}
        <div>
          <h2 className="text-2xl font-bold text-white">The <span className="text-blue-500">Wrap</span></h2>
          <p className="text-sm mt-2">your ai compass</p>
          <div className="flex gap-4 mt-6 text-blue-400 text-xl">
            <FaXTwitter className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaLinkedin className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-white font-semibold mb-4">Products</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="opacity-50">Tools</span></li>
            <li><span className="opacity-50">Search</span></li>
            <li><span className="opacity-50">Recommendations</span></li>
            <li><span className="opacity-50">Analytics</span></li>
            <li><span className="opacity-50">Workflows</span></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="opacity-50">Docs</span></li>
            <li><span className="opacity-50">Privacy Policy</span></li>
            <li><span className="opacity-50">Terms of Service</span></li>
            <li><span className="opacity-50">Pricing Policy</span></li>
            <li><span className="opacity-50">Refund Policy</span></li>
          </ul>
        </div>
      </div>
    
      {/* Background gradient */}
       <div className="w-full text-center mt-20 select-none pointer-events-none">
            <h1 className="text-[120px] md:text-[180px] font-extrabold bg-gradient-to-b from-blue-500 via-blue-700 to-black text-transparent bg-clip-text tracking-tight opacity-50">
                THE WRAP
            </h1>
        </div>

      {/* Copyright */}
      <div className="relative z-10 mt-12 border-t border-gray-800 pt-6 text-sm text-center text-gray-500">
        © 2025 The Wrap. All rights reserved.
      </div>

    </div>
  );
}
