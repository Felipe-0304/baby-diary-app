import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Camera, CheckSquare, Baby, TrendingUp, Clock, Star } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    daysLeft: 0,
    babyName: 'Mi Bebé',
    currentWeek: 20,
    totalMemories: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalPhotos: 0,
    nextAppointment: null
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        daysLeft: 120,
        babyName: 'Mi Bebé',
        currentWeek: 20,
        totalMemories: 15,
        totalTasks: 12,
        completedTasks: 8,
        totalPhotos: 25,
        nextAppointment: {
          title: 'Control prenatal',
          date: '2025-08-25',
          doctor: 'Dr. García'
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ icon, title, value, subtitle, color = "text-primary-500", onClick }) => (
    <Card 
      className="text-center hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105" 
      onClick={onClick}
    >
      <div className={`inline-flex p-3 rounded-full bg-opacity-10 mb-3 ${color.replace('text-', 'bg-').replace('-500', '-100')}`}>
        {React.cloneElement(icon, { size: 24, className: color })}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </Card>
  );

  const ProgressBar = ({ label, current, total, color = "bg-primary-500" }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-gray-500">{current}/{total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <Card className="text-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-cursive mb-2">
            ¡Hola, futura mamá! 👋
          </h1>
          <p className="text-lg opacity-90">
            Bienvenida a tu espacio especial para guardar cada momento mágico
          </p>
        </div>
      </Card>

      {/* Countdown */}
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Días restantes para conocer a
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-primary-600 font-cursive mb-4">
            {stats.babyName}
          </h3>
        </div>
        
        <Card className="inline-block bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
          <div className="text-center">
            <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 tracking-wider">
              {stats.daysLeft}
            </div>
            <p className="text-lg font-semibold text-gray-600 mt-2">días</p>
            <p className="text-sm text-gray-500">Semana {stats.currentWeek} de embarazo</p>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Heart />}
          title="Recuerdos Guardados"
          value={stats.totalMemories}
          subtitle="Momentos especiales"
          color="text-red-500"
        />
        <StatCard
          icon={<Camera />}
          title="Fotos Subidas"
          value={stats.totalPhotos}
          subtitle="Imágenes guardadas"
          color="text-blue-500"
        />
        <StatCard
          icon={<CheckSquare />}
          title="Tareas Completadas"
          value={`${stats.completedTasks}/${stats.totalTasks}`}
          subtitle="Lista de pendientes"
          color="text-green-500"
        />
        <StatCard
          icon={<Baby />}
          title="Semanas"
          value={`${stats.currentWeek}w`}
          subtitle="De embarazo"
          color="text-purple-500"
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-primary-500" size={24} />
            Tu Progreso
          </h3>
          <div className="space-y-4">
            <ProgressBar
              label="Tareas Completadas"
              current={stats.completedTasks}
              total={stats.totalTasks}
              color="bg-green-500"
            />
            <ProgressBar
              label="Progreso del Embarazo"
              current={stats.currentWeek}
              total={40}
              color="bg-primary-500"
            />
            <ProgressBar
              label="Recuerdos este Mes"
              current={stats.totalMemories}
              total={30}
              color="bg-blue-500"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="mr-2 text-secondary-500" size={24} />
            Próxima Cita
          </h3>
          {stats.nextAppointment ? (
            <div className="space-y-3">
              <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                <h4 className="font-semibold text-gray-800">{stats.nextAppointment.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  📅 {new Date(stats.nextAppointment.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  👨‍⚕️ {stats.nextAppointment.doctor}
                </p>
              </div>
              <Button variant="outline" size="sm" fullWidth>
                Ver Detalles
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-2 opacity-50" />
              <p>No tienes citas programadas</p>
              <Button variant="primary" size="sm" className="mt-3">
                Programar Cita
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Star className="mr-2 text-yellow-500" size={24} />
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto space-y-2 hover:border-red-300 hover:bg-red-50"
          >
            <Heart className="text-red-500" size={32} />
            <span className="text-sm font-medium">Nuevo Recuerdo</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto space-y-2 hover:border-blue-300 hover:bg-blue-50"
          >
            <Camera className="text-blue-500" size={32} />
            <span className="text-sm font-medium">Subir Foto</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto space-y-2 hover:border-green-300 hover:bg-green-50"
          >
            <CheckSquare className="text-green-500" size={32} />
            <span className="text-sm font-medium">Nueva Tarea</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto space-y-2 hover:border-purple-300 hover:bg-purple-50"
          >
            <Calendar className="text-purple-500" size={32} />
            <span className="text-sm font-medium">Ver Calendario</span>
          </Button>
        </div>
      </Card>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💕 Pensamiento del Día</h3>
          <p className="text-gray-700 italic">
            "Cada día que pasa, tu bebé crece y se desarrolla. Cada momento que documentes 
            será un tesoro invaluable en el futuro."
          </p>
          <p className="text-sm text-gray-500 mt-2">— Tu Diario del Embarazo</p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
