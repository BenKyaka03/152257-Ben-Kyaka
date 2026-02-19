'use client';

import { useEffect, useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const navItems = ['Book Ride', 'My Trips', 'Profile'];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-300 ${
        scrolled
          ? 'bg-gradient-to-r from-blue-500/90 to-violet-500/90 backdrop-blur text-white shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="text-xl font-bold">⚡ Catatu</div>
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item} href="#booking" className="font-medium hover:opacity-80">
              {item}
            </a>
          ))}
        </nav>
        <button onClick={() => setOpen((s) => !s)} className="rounded-md p-2 md:hidden" aria-label="menu">
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>
      {open && (
        <div className="space-y-3 bg-white px-4 pb-4 text-gray-800 shadow md:hidden">
          {navItems.map((item) => (
            <a key={item} href="#booking" className="block font-medium" onClick={() => setOpen(false)}>
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
