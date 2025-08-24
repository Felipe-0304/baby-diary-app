import React, { useState } from 'react';
import { Plus, Heart, Camera, CheckSquare, BookOpen, Calendar, X } from 'lucide-react';
import Button from '../common/Button';

const FloatingActionButton = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { 
      name: 'Nuevo Recuerdo', 
      icon: Heart, 
      action: () => setActivePage('Diario del Bebé'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    { 
      name: 'Subir Foto', 
      icon: Camera, 
      action: () => setActivePage('Galería'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      name: 'Nueva Tarea', 
      icon: CheckSquare, 
      action: () => setActivePage('Tareas'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      name: 'Escribir Diario', 
      icon: BookOpen, 
      action: () => setActivePage('Diario Personal'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      name: 'Nueva Cita', 
      icon: Calendar, 
      action: () => setActivePage('Citas'),
      color: 'bg-teal-500 hover:bg-teal-600'
    }
  ];

  const handleActionClick = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="fixed bottom-32 right-4 z-50 space-y-3 animate-fade-in">
          {quickActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.name}
                className="flex items-center space-x-3"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-black/70 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                  {item.name}
                </div>
                <Button
                  onClick={() => handleActionClick(item.action)}
                  className={`w-12 h-12 rounded-full ${item.color} text-white shadow-lg hover:scale-110 transition-all duration-200`}
                  icon={<Icon size={20} />}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`floating-action-btn transition-all duration-300 ${
          isOpen ? 'rotate-45 bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'
        }`}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </>
  );
};

export default FloatingActionButton;
