import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useApi = (apiFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
};

export const useCrud = (service) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getAll ? service.getAll(filters) : service.get(filters);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error cargando datos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service]);

  const create = useCallback(async (itemData) => {
    try {
      const newItem = await service.create(itemData);
      setItems(prevItems => [newItem, ...prevItems]);
      toast.success('Elemento creado correctamente');
      return newItem;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error creando elemento';
      toast.error(errorMessage);
      throw err;
    }
  }, [service]);

  const update = useCallback(async (id, itemData) => {
    try {
      const updatedItem = await service.update(id, itemData);
      setItems(prevItems => 
        prevItems.map(item => item.id === id ? updatedItem : item)
      );
      toast.success('Elemento actualizado correctamente');
      return updatedItem;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error actualizando elemento';
      toast.error(errorMessage);
      throw err;
    }
  }, [service]);

  const remove = useCallback(async (id) => {
    try {
      await service.delete(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Elemento eliminado correctamente');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error eliminando elemento';
      toast.error(errorMessage);
      throw err;
    }
  }, [service]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    items,
    loading,
    error,
    loadData,
    create,
    update,
    remove,
    setItems
  };
};

export const usePagination = (totalItems, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  
  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);
  
  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter
  };
};
