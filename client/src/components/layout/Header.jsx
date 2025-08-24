import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import Button from '../common/Button';

const Header = ({ activePage, onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          icon={<Menu size={20} />}
          onClick={onMenuClick}
          className="text-gray-600"
        />

        {/* Center: Page Title */}
        <h1 className="text-lg font-semibold text-gray-800 font-cursive">
          {activePage}
        </h1>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Bell size={18} />}
            className="text-gray-600 relative"
          >
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon={<User size={18} />}
            className="text-gray-600"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
