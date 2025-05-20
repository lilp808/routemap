import React, { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Map, Upload, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

interface NavbarProps {
  currentPage: 'route' | 'upload';
}

const MobileNavbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Map className="text-yellow-500" size={24} />
          <h1 className="text-xl font-bold text-gray-800">ATSOKO</h1>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu}
          className="lg:hidden block text-gray-800"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link href="/">
            <div className={`flex items-center gap-1 font-medium cursor-pointer ${currentPage === 'route' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>
              <Map size={18} />
              <span>แผนเส้นทาง</span>
            </div>
          </Link>
          <Link href="/upload">
            <div className={`flex items-center gap-1 font-medium cursor-pointer ${currentPage === 'upload' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>
              <Upload size={18} />
              <span>อัพโหลดข้อมูล</span>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 font-medium hover:text-red-700"
          >
            <LogOut size={18} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Mobile menu (slide down) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-md absolute w-full border-t border-gray-100 slide-in-top">
          <div className="flex flex-col px-4 py-2 space-y-3">
            <Link href="/">
              <div 
                className={`flex items-center gap-2 py-3 px-2 rounded-md cursor-pointer ${currentPage === 'route' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Map size={18} />
                <span>แผนเส้นทาง</span>
              </div>
            </Link>
            <Link href="/upload">
              <div 
                className={`flex items-center gap-2 py-3 px-2 rounded-md cursor-pointer ${currentPage === 'upload' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Upload size={18} />
                <span>อัพโหลดข้อมูล</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 py-3 px-2 text-red-600 rounded-md w-full text-left"
            >
              <LogOut size={18} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;