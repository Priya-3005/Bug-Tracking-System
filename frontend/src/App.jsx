import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import BugsPage from './pages/BugsPage';
import UsersPage from './pages/UsersPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return <LoginPage />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigateToBugs={() => setActivePage('bugs')} />;
      case 'bugs':
        return <BugsPage searchQuery={searchQuery} />;
      case 'users':
        return user.role === 'admin' ? <UsersPage /> : <Dashboard onNavigateToBugs={() => setActivePage('bugs')} />;
      default:
        return <Dashboard onNavigateToBugs={() => setActivePage('bugs')} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <TopBar
          activePage={activePage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </AuthProvider>
  );
}
