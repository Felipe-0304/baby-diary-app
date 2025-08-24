import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import Layout from './components/layout/Layout';
import Welcome from './components/pages/Welcome';
import Dashboard from './components/pages/Dashboard';

// Services
import { checkHealth } from './services/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [serverStatus, setServerStatus] = useState('checking');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const welcomeCompleted = localStorage.getItem('welcomeCompleted');
    if (!welcomeCompleted) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        await checkHealth();
        setServerStatus('online');
      } catch (error) {
        console.error('Server health check failed:', error);
        setServerStatus('offline');
      }
    };

    checkServerHealth();
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  if (showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} />;
  }

  if (serverStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Conectando con el servidor...</p>
        </div>
      </div>
    );
  }

  if (serverStatus === 'offline') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Servidor no disponible</h1>
          <p className="text-gray-600 mb-6">
            No se pudo conectar con el servidor. Verifica que esté ejecutándose en el puerto 5000.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Layout activePage={activePage} setActivePage={setActivePage}>
          {renderActivePage()}
        </Layout>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
            },
            success: {
              style: {
                background: '#10b981',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
