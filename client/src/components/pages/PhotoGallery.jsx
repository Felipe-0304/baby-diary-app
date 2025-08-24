import React, { useState, useEffect } from 'react';
import { Camera, Search, Filter, Heart, Calendar, MapPin, Download, Share, ZoomIn, Grid, List } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo
  useEffect(() => {
    setTimeout(() => {
      setPhotos([
        {
          id: 1,
          title: 'Primera ecografía',
          description: 'Nuestra primera imagen del bebé a las 8 semanas',
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop',
          date: new Date().toISOString(),
          category: 'Médico',
          location: 'Hospital Central',
          tags: ['ecografía', 'primer vistazo'],
          isFavorite: true
        },
        {
          id: 2,
          title: 'Test de embarazo positivo',
          description: 'El momento que cambió nuestras vidas para siempre',
          image: 'https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?w=500&h=500&fit=crop',
          date: new Date(Date.now() - 86400000).toISOString(),
          category: 'Hitos',
          location: 'Casa',
          tags: ['test positivo', 'inicio'],
          isFavorite: true
        },
        {
          id: 3,
          title: 'Primeras compras del bebé',
          description: 'Los primeros regalitos para nuestro pequeño',
          image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
          date: new Date(Date.now() - 172800000).toISOString(),
          category: 'Preparativos',
          location: 'Centro Comercial',
          tags: ['compras', 'preparativos'],
          isFavorite: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['Todos', 'Hitos', 'Médico', 'Preparativos', 'Familia', 'Ecografías'];

  const filteredPhotos = photos.filter(photo => {
    const matchesFilter = filter === 'Todos' || photo.category === filter;
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setPhotos(photos.map(photo => 
      photo.id === id ? { ...photo, isFavorite: !photo.isFavorite } : photo
    ));
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
          <h2 className="text-3xl font-bold text-gray-800">Galería de Fotos</h2>
          <p className="text-gray-600 mt-1">
            {filteredPhotos.length} foto{filteredPhotos.length !== 1 ? 's' : ''} 
            {filter !== 'Todos' ? ` en ${filter}` : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            icon={<Grid size={16} />}
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            icon={<List size={16} />}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar fotos por título, descripción o etiquetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filters */}
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

      {/* Photo Grid/List */}
      {filteredPhotos.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {filteredPhotos.map(photo => (
            <Card 
              key={photo.id} 
              className={`group cursor-pointer hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
              }`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className={`relative overflow-hidden ${
                viewMode === 'grid' 
                  ? 'aspect-square rounded-lg mb-4' 
                  : 'md:w-48 md:h-32 aspect-video md:aspect-auto rounded-lg md:mr-4 mb-4 md:mb-0'
              }`}>
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn size={32} className="text-white" />
                </div>
                
                {/* Favorite Badge */}
                {photo.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Heart size={20} className="text-red-500 fill-current" />
                  </div>
                )}
              </div>
              
              <div className={viewMode === 'list' ? 'flex-1' : ''}>
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                  {photo.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {photo.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{format(new Date(photo.date), 'dd MMM yyyy', { locale: es })}</span>
                  </div>
                  
                  {photo.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span className="truncate max-w-20">{photo.location}</span>
                    </div>
                  )}
                </div>
                
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {photo.tags.length > 2 && (
                      <span className="text-gray-400 text-xs py-1">
                        +{photo.tags.length - 2} más
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Camera size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchTerm || filter !== 'Todos' ? 'No se encontraron fotos' : 'Tu galería está vacía'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filter !== 'Todos' 
              ? 'Intenta cambiar los filtros o el término de búsqueda'
              : 'Comienza a subir fotos de tu embarazo en el "Diario del Bebé"'
            }
          </p>
        </Card>
      )}

      {/* Photo Modal */}
      <Modal 
        isOpen={!!selectedPhoto} 
        onClose={() => setSelectedPhoto(null)}
        size="lg"
        title={selectedPhoto?.title}
      >
        {selectedPhoto && (
          <div className="space-y-6">
            {/* Photo */}
            <div className="relative">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(selectedPhoto.id)}
                  icon={
                    <Heart 
                      size={18} 
                      className={selectedPhoto.isFavorite ? 'text-red-500 fill-current' : 'text-white'} 
                    />
                  }
                  className="bg-black/50 text-white hover:bg-black/70"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download size={18} />}
                  className="bg-black/50 text-white hover:bg-black/70"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Share size={18} />}
                  className="bg-black/50 text-white hover:bg-black/70"
                />
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{format(new Date(selectedPhoto.date), 'dd MMMM yyyy', { locale: es })}</span>
                  </div>
                  
                  {selectedPhoto.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{selectedPhoto.location}</span>
                    </div>
                  )}
                  
                  <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs">
                    {selectedPhoto.category}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {selectedPhoto.description}
              </p>
              
              {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPhoto.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PhotoGallery;
