import React, { useState } from 'react';
import { 
  Calendar, 
  Heart, 
  Camera, 
  CheckSquare, 
  MoreHorizontal,
  BookOpen,
  Video,
  Stethoscope,
  CalendarDays,
  Baby,
  User,
  Settings
} from 'lucide-react';

const MobileNavigation = ({ activePage, setActivePage }) => {
  const [showMore, setShowMore] = useState(false);

  const mainMenuItems = [
    { name: 'Dashboard', icon: Calendar, color: 'text-primary-500' },
    { name: 'Diario del Bebé', icon: Heart, color: 'text-red-500', label: 'Diario' },
    { name: 'Galería', icon: Camera, color: 'text-blue-500' },
    { name: 'Tareas', icon: CheckSquare, color: 'text-green-500' },
    { name: 'Más', icon: MoreHorizontal, color: 'text-gray-500' }
  ];

  const moreItems = [
    { name: 'Videos', icon: Video, color: 'text-purple-500' },
    { name: 'Diario Personal', icon: BookOpen, color: 'text-green-600' },
    { name: 'Calendario', icon: CalendarDays, color: 'text-indigo-500' },
    { name: 'Registros Médicos', icon: Stethoscope, color: 'text-red-600' },
    { name: 'Citas', icon: Calendar, color: 'text-teal-500' },
    { name: 'Perfil del Bebé', icon: Baby, color: 'text-pink-500' },
    { name: 'Configuraciones', icon: Settings, color: 'text-gray-500' }
  ];

  const handleItemClick = (itemName) => {
    if (itemName === 'Más') {
      setShowMore(!showMore);
    } else {
      setActivePage(itemName);
      setShowMore(false);
    }
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" 
          onClick={() => setShowMore(false)}
        >
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto animate-fade-in">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Más opciones</h3>
                <p className="text-sm text-gray-500">Selecciona una sección</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.name;
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleItemClick(item.name)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-100 text-primary-600 scale-105 shadow-md' 
                          : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                      }`}
                    >
                      <Icon size={24} className={isActive ? 'text-primary-600' : item.color} />
                      <span className="text-xs mt-2 text-center font-medium leading-tight">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="grid grid-cols-5 h-16">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;
            const isMore = item.name === 'Más';
            const displayName = item.label || item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                  (isActive || (isMore && showMore))
                    ? `${item.color} bg-gray-50 scale-105` 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-1 rounded-lg ${(isActive || (isMore && showMore)) ? 'bg-white shadow-sm' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium leading-tight">
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
