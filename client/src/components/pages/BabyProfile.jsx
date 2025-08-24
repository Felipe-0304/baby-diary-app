import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Heart, Camera, Stethoscope, Smile, Baby, ImageIcon, MapPin, Calendar, Star, Filter, Search } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import MediaUpload from '../common/MediaUpload';
import LoadingSpinner from '../common/LoadingSpinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BabyDiary = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMemory, setCurrentMemory] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo
  useEffect(() => {
    setTimeout(() => {
      setMemories([
        {
          id: 1,
          title: 'Primera patadita',
          text: '¡Hoy sentí la primera patadita del bebé! Fue una sensación mágica e indescriptible. Estaba sentada leyendo cuando de repente sentí un pequeño movimiento. Mi corazón se llenó de alegría.',
          date: new Date().toISOString(),
          category: 'Hitos',
          mood: 'Feliz',
          location: 'Casa',
          tags: ['primer movimiento', 'emocionante'],
          isFavorite: true,
          weather: 'Soleado',
          image: null
        },
        {
          id: 2,
          title: 'Ecografía 20 semanas',
          text: 'Hoy fue la ecografía de las 20 semanas. Pudimos ver perfectamente al bebé, sus manitas, piecitos y carita. El doctor dice que todo está perfecto.',
          date: new Date(Date.now() - 86400000).toISOString(),
          category: 'Médico',
          mood: 'Emocionado',
          location: 'Hospital Central',
          tags: ['ecografía', 'desarrollo normal'],
          isFavorite: true,
          weather: 'Nublado',
          image: null
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['Todos', 'Hitos', 'Fotos', 'Videos', 'Médico', 'Emocional', 'Síntomas'];
  const moods = ['Feliz', 'Neutral', 'Triste', 'Emocionado', 'Ansioso'];

  const moodIcons = {
    'Feliz': '😊',
    'Neutral': '😐',
    'Triste': '😢',
    'Emocionado': '🤩',
    'Ansioso': '😰'
  };

  const categoryIcons = {
    'Hitos': <Baby size={20} className="text-yellow-500" />,
    'Fotos': <ImageIcon size={20} className="text-blue-500" />,
    'Videos': <Camera size={20} className="text-purple-500" />,
    'Médico': <Stethoscope size={20} className="text-red-500" />,
    'Emocional': <Heart size={20} className="text-pink-500" />,
    'Síntomas': <Stethoscope size={20} className="text-orange-500" />
  };

  const handleOpenModal = (memory = null) => {
    setCurrentMemory(memory || {
      title: '',
      text: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Hitos',
      mood: 'Feliz',
      location: '',
      tags: [],
      isFavorite: false,
      weather: '',
      image: null
    });
    setIsModalOpen(true);
  };

  const handleSaveMemory = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const memoryData = {
      ...currentMemory,
      title: formData.get('title'),
      text: formData.get('text'),
      date: formData.get('date'),
      category: formData.get('category'),
      mood: formData.get('mood'),
      location: formData.get('location'),
      weather: formData.get('weather'),
      tags: currentMemory.tags || []
    };

    if (currentMemory.id) {
      setMemories(memories.map(m => m.id === currentMemory.id ? { ...memoryData, id: currentMemory.id } : m));
    } else {
      setMemories([{ ...memoryData, id: Date.now() }, ...memories]);
    }
    
    setIsModalOpen(false);
    setCurrentMemory(null);
  };

  const handleDeleteMemory = (id) => {
    if (window.confirm('¿Estás segura de que quieres eliminar este recuerdo?')) {
      setMemories(memories.filter(m => m.id !== id));
    }
  };

  const toggleFavorite = (id) => {
    setMemories(memories.map(m => 
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    ));
  };

  const filteredMemories = memories.filter(memory => {
    const matchesFilter = filter === 'Todos' || memory.category === filter;
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addTag = (tag) => {
    if (tag && !currentMemory.tags.includes(tag)) {
      setCurrentMemory({
        ...currentMemory,
        tags: [...currentMemory.tags, tag]
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentMemory({
      ...currentMemory,
      tags: currentMemory.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Diario de Recuerdos del Bebé</h2>
          <p className="text-gray-600 mt-1">Guarda cada momento especial de tu embarazo</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          icon={<Plus size={20} />}
          size="lg"
          className="shadow-lg"
        >
          Añadir Recuerdo
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar en tus recuerdos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center mr-3">
              <Filter size={16} className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Categorías:</span>
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  filter === cat 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Memories Timeline */}
      <div className="space-y-6">
        {filteredMemories.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 to-secondary-300"></div>
            
            {filteredMemories.map((memory, index) => (
              <div key={memory.id} className="relative pl-10 pb-8">
                {/* Timeline Dot */}
                <div className="absolute left-2 top-6 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg"></div>
                
                <Card className="hover:shadow-lg transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {categoryIcons[memory.category]}
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{memory.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {format(new Date(memory.date), 'dd MMMM yyyy', { locale: es })}
                          </span>
                          {memory.location && (
                            <span className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {memory.location}
                            </span>
                          )}
                          <span className="flex items-center">
                            <span className="mr-1">{moodIcons[memory.mood]}</span>
                            {memory.mood}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(memory.id)}
                        icon={
                          <Star 
                            size={18} 
                            className={memory.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'} 
                          />
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(memory)}
                        icon={<Edit size={18} />}
                        className="text-blue-600 hover:text-blue-800"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMemory(memory.id)}
                        icon={<Trash2 size={18} />}
                        className="text-red-600 hover:text-red-800"
                      />
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{memory.text}</p>

                  {memory.image && (
                    <div className="mb-4">
                      <img 
                        src={memory.image} 
                        alt={memory.title}
                        className="rounded-lg max-h-64 w-auto object-cover"
                      />
                    </div>
                  )}

                  {memory.tags && memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <Baby size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || filter !== 'Todos' ? 'No se encontraron recuerdos' : 'Tu diario está esperando'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filter !== 'Todos' 
                ? 'Intenta cambiar los filtros o el término de búsqueda'
                : 'Comienza a documentar los momentos especiales de tu embarazo'
              }
            </p>
            <Button onClick={() => handleOpenModal()} icon={<Plus size={20} />}>
              Crear tu Primer Recuerdo
            </Button>
          </Card>
        )}
      </div>

      {/* Memory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentMemory(null);
        }}
        title={currentMemory?.id ? 'Editar Recuerdo' : 'Nuevo Recuerdo'}
        size="lg"
      >
        <form onSubmit={handleSaveMemory} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Recuerdo
            </label>
            <input
              type="text"
              name="title"
              defaultValue={currentMemory?.title || ''}
              placeholder="Ej: Primera patadita, Ecografía 20 semanas..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          {/* Date and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                defaultValue={currentMemory?.date?.split('T')[0] || new Date().toISOString().split('T')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                name="category"
                defaultValue={currentMemory?.category || 'Hitos'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="text"
              rows="4"
              defaultValue={currentMemory?.text || ''}
              placeholder="Describe este momento especial..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              required
            />
          </div>

          {/* Mood and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Ánimo
              </label>
              <select
                name="mood"
                defaultValue={currentMemory?.mood || 'Feliz'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {moodIcons[mood]} {mood}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación (opcional)
              </label>
              <input
                type="text"
                name="location"
                defaultValue={currentMemory?.location || ''}
                placeholder="¿Dónde sucedió?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Weather */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clima (opcional)
            </label>
            <input
              type="text"
              name="weather"
              defaultValue={currentMemory?.weather || ''}
              placeholder="Ej: Soleado, Lluvioso, Nublado..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentMemory?.tags?.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-400 hover:text-primary-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Añadir etiqueta..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = e.target.parentElement.querySelector('input');
                  addTag(input.value);
                  input.value = '';
                }}
              >
                Añadir
              </Button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjuntar Foto/Video (opcional)
            </label>
            <MediaUpload
              onFileSelect={(file) => {
                setCurrentMemory({
                  ...currentMemory,
                  image: file
                });
              }}
              acceptedTypes={['image/*', 'video/*']}
              maxSize={50}
              showPreview={true}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setCurrentMemory(null);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" size="lg">
              {currentMemory?.id ? 'Actualizar Recuerdo' : 'Guardar Recuerdo'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BabyDiary;
