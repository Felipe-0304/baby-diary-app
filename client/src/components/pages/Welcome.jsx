import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Heart, Camera, BookOpen, Calendar, CheckSquare, Baby, Sparkles, ArrowRight, Star } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const Welcome = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const slides = [
    {
      id: 1,
      title: "¡Bienvenida a tu Diario del Embarazo!",
      subtitle: "Tu compañero perfecto para esta hermosa aventura",
      icon: <Baby size={80} className="text-white" />,
      description: "Guarda cada momento especial, desde la primera patadita hasta el primer ultrasonido. Tu historia de amor comienza aquí.",
      color: "from-pink-400 to-purple-500",
      features: []
    },
    {
      id: 2,
      title: "Memorias que Duran para Siempre",
      subtitle: "Fotos, videos y recuerdos en un solo lugar",
      icon: <Camera size={80} className="text-white" />,
      description: "Sube fotos y videos, añade ubicaciones, estados de ánimo y etiquetas. Cada momento cuenta y merece ser recordado.",
      features: [
        "📸 Fotos y videos ilimitados", 
        "📍 Ubicaciones automáticas", 
        "😊 Estados de ánimo", 
        "🏷️ Etiquetas personalizadas"
      ],
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 3,
      title: "Tu Diario Personal",
      subtitle: "Reflexiones, sentimientos y pensamientos",
      icon: <BookOpen size={80} className="text-white" />,
      description: "Escribe sobre tus experiencias, síntomas, emociones y momentos de gratitud. Tu espacio personal y privado.",
      features: [
        "✍️ Entradas diarias", 
        "💭 Seguimiento de ánimo", 
        "🩺 Registro de síntomas", 
        "🙏 Momentos de gratitud"
      ],
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 4,
      title: "Organiza tu Preparación",
      subtitle: "Tareas, citas y seguimiento médico",
      icon: <CheckSquare size={80} className="text-white" />,
      description: "Mantén todo organizado: lista de compras, citas médicas, tareas pendientes y seguimiento de tu salud.",
      features: [
        "✅ Lista de tareas inteligente", 
        "🏥 Citas médicas", 
        "📊 Registros de salud", 
        "📅 Calendario integrado"
      ],
      color: "from-orange-400 to-red-500"
    },
    {
      id: 5,
      title: "¡Todo Listo para Comenzar!",
      subtitle: "Comienza tu hermoso viaje",
      icon: <Sparkles size={80} className="text-white" />,
      description: "Ya tienes todo lo necesario para comenzar. ¡Que comience la magia de documentar tu embarazo!",
      color: "from-purple-400 to-pink-500",
      isLast: true,
      features: [
        "🎯 Interfaz intuitiva",
        "📱 Responsive en todos los dispositivos",
        "🔒 Datos seguros y privados",
        "💖 Hecho con amor para ti"
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      localStorage.setItem('welcomeCompleted', 'true');
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentSlideData = slides[currentSlide];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-100 to-purple-100 flex items-center justify-center p-4">
      <Card className={`w-full max-w-4xl mx-auto bg-gradient-to-r ${currentSlideData.color} text-white relative overflow-hidden transition-all duration-700 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} padding="none">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-white animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-white animate-pulse delay-500"></div>
          <div className="absolute top-20 right-1/4 w-8 h-8 rounded-full bg-white animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12">
          {/* Skip Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              Saltar
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : index < currentSlide 
                      ? 'bg-white/60' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center space-y-6 min-h-96 flex flex-col justify-center">
            {/* Icon */}
            <div className="flex justify-center mb-6 animate-bounce-gentle">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                {currentSlideData.icon}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold font-cursive animate-fade-in">
              {currentSlideData.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 animate-fade-in">
              {currentSlideData.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              {currentSlideData.description}
            </p>

            {/* Features */}
            {currentSlideData.features && currentSlideData.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto mt-8">
                {currentSlideData.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-2 text-white/90 bg-white/10 rounded-lg p-3 backdrop-blur-sm animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-white border-white/30 hover:bg-white/10 disabled:opacity-30"
              icon={<ChevronLeft size={20} />}
            >
              Anterior
            </Button>

            <div className="flex items-center space-x-2 text-sm text-white/70">
              <span>{currentSlide + 1}</span>
              <span>de</span>
              <span>{slides.length}</span>
            </div>

            {!currentSlideData.isLast ? (
              <Button
                variant="ghost"
                onClick={nextSlide}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Siguiente
                <ChevronRight size={20} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                icon={<ArrowRight size={20} />}
                size="lg"
              >
                ¡Empezar mi Diario!
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Welcome;
