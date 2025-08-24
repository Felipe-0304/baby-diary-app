import React from 'react';
import { 
  Calendar, 
  Heart, 
  Camera, 
  BookOpen, 
  CheckSquare, 
  User, 
  Settings, 
  Video,
  Stethoscope,
  CalendarDays,
  Baby,
  X
} from 'lucide-react';
import Button from '../common/Button';

const Sidebar = ({ activePage, setActivePage, onItemClick, isMobile = false }) => {
  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: Calendar, 
      color: 'text-primary-500',
      description: 'Resumen general'
    },
    { 
      name: 'Diario del Bebé', 
      icon: Heart, 
      color: 'text-red-500',
      description: 'Momentos especiales'
    },
    { 
      name: 'Galería', 
      icon: Camera, 
      color: 'text-blue-500',
      description: 'Fotos y recuerdos'
    },
    { 
      name: 'Videos', 
      icon: Video, 
      color: 'text-purple-500',
      description: 'Videos guardados'
    },
    { 
      name: 'Diario Personal', 
      icon: BookOpen, 
      color: 'text-green-500',
      description: 'Reflexiones diarias'
    },
    { 
      name: 'Tareas', 
      icon: CheckSquare, 
      color: 'text-yellow-600',
      description: 'Lista de pendientes'
    },
    { 
      name: 'Calendario', 
      icon: CalendarDays, 
      color: 'text-indigo-500',
      description: 'Eventos y citas'
    },
    { 
      name: 'Registros Médicos', 
      icon: Stethoscope, 
      color: 'text-red-600',
      description: 'Seguimiento médico'
    },
    { 
      name: 'Citas', 
      icon: Calendar, 
      color: 'text-teal-500',
      description: 'Citas programadas'
    },
    { 
      name: 'Perfil del Bebé', 
      icon: Baby, 
      color: 'text-pink-500',
      description: 'Información del bebé'
    },
    { 
      name: 'Configuraciones', 
      icon: Settings, 
      color: 'text-gray-500',
      description: 'Ajustes de la app'
    }
  ];

  const handleItemClick = (itemName) => {
    setActivePage(itemName);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className={`bg-white shadow-lg h-full overflow-y-auto ${isMobile ? 'w-64' : 'w-72'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600 font-cursive">
              Diario del Bebé
            </h1>
            <p className="text-sm text-gray-500 mt-1">Tu aventura de maternidad</p>
          </div>
          {isMobile && onItemClick && (
            <Button
              variant="ghost"
              size="sm"
              icon={<X size={20} />}
              onClick={onItemClick}
              className="text-gray-500"
            />
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.name;
          
          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item.name)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary-50 border-2 border-primary-200 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                <Icon size={20} className={isActive ? 'text-primary-600' : item.color} />
              </div>
              <div className="flex-1 text-left">
                <div className={`font-medium ${isActive ? 'text-primary-800' : 'text-gray-800'}`}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Baby size={20} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">¡Cada momento cuenta!</p>
              <p className="text-xs text-gray-600">Guarda tus recuerdos especiales</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
