import React, { useState, useMemo } from 'react';
import { Play, Calendar, MapPin, Heart } from 'lucide-react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import VideoPlayer from '../common/VideoPlayer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const VideoGallery = ({ memories }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filter, setFilter] = useState('Todos');

  const videos = useMemo(() => {
    return memories
      .filter(m => m.video || m.media_type === 'video' || m.media_type === 'both')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [memories]);

  const filteredVideos = useMemo(() => {
    if (filter === 'Todos') return videos;
    return videos.filter(video => video.category === filter);
  }, [videos, filter]);

  const categories = ['Todos', 'Hitos', 'Videos', 'Médico', 'Emocional'];

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Galería de Videos</h2>
        <div className="text-sm text-gray-500">
          {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtros */}
      {videos.length > 0 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                ${filter === cat 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Videos */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Card 
              key={video.id} 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <video
                  src={video.video}
                  poster={video.image}
                  className="w-full h-full object-cover"
                  muted
                />
                
                {/* Overlay de Play */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary-500 text-white p-4 rounded-full">
                    <Play size={24} fill="white" />
                  </div>
                </div>
                
                {/* Duración */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {formatDuration(video.duration)}
                  </div>
                )}
                
                {/* Favorito */}
                {video.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Heart size={20} className="text-red-500 fill-current" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {video.text}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{format(new Date(video.date), 'dd MMM yyyy', { locale: es })}</span>
                  </div>
                  
                  {video.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span className="truncate max-w-20">{video.location}</span>
                    </div>
                  )}
                </div>
                
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {video.tags.length > 2 && (
                      <span className="text-gray-400 text-xs py-1">
                        +{video.tags.length - 2} más
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
          <div className="text-gray-400 mb-4">
            <Play size={64} className="mx-auto" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No hay videos todavía
          </h3>
          <p className="text-gray-600 mb-6">
            Sube tu primer video en "Diario del Bebé" para verlo aquí
          </p>
        </Card>
      )}

      {/* Modal de Reproducción */}
      <Modal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)}
        size="lg"
        title={selectedVideo?.title}
      >
        {selectedVideo && (
          <div className="space-y-6">
            {/* Video Player */}
            <VideoPlayer
              src={selectedVideo.video}
              poster={selectedVideo.image}
              className="w-full aspect-video"
            />
            
            {/* Información */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{format(new Date(selectedVideo.date), 'dd MMMM yyyy', { locale: es })}</span>
                  </div>
                  
                  {selectedVideo.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{selectedVideo.location}</span>
                    </div>
                  )}
                </div>
                
                {selectedVideo.isFavorite && (
                  <Heart size={20} className="text-red-500 fill-current" />
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {selectedVideo.text}
              </p>
              
              {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag, index) => (
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

export default VideoGallery;
