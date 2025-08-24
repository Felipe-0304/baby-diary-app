import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const showSuccess = useCallback((message, options = {}) => {
    const id = toast.success(message, {
      duration: 4000,
      ...options
    });
    return id;
  }, []);

  const showError = useCallback((message, options = {}) => {
    const id = toast.error(message, {
      duration: 5000,
      ...options
    });
    return id;
  }, []);

  const showWarning = useCallback((message, options = {}) => {
    const id = toast(message, {
      icon: '⚠️',
      duration: 4000,
      style: {
        background: '#f59e0b',
        color: '#fff'
      },
      ...options
    });
    return id;
  }, []);

  const showInfo = useCallback((message, options = {}) => {
    const id = toast(message, {
      icon: 'ℹ️',
      duration: 4000,
      style: {
        background: '#3b82f6',
        color: '#fff'
      },
      ...options
    });
    return id;
  }, []);

  const showLoading = useCallback((message) => {
    const id = toast.loading(message);
    return id;
  }, []);

  const updateToast = useCallback((id, message, type = 'success') => {
    if (type === 'success') {
      toast.success(message, { id });
    } else if (type === 'error') {
      toast.error(message, { id });
    }
  }, []);

  const dismissToast = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateToast,
    dismissToast,
    dismissAll
  };
};

export default useNotifications;
