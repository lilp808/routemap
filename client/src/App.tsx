import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import LoginPage from './pages/LoginPage';
import RouteMapPage from './pages/RouteMapPage';
import UploadInfoPage from './pages/UploadInfoPage';
import './index.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Protected route helper
  const ProtectedRoute = ({ component: Component, ...rest }: any) => {
    if (!user) {
      // Redirect to login if not authenticated
      setLocation('/login');
      return null;
    }
    
    return <Component {...rest} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Switch>
        <Route path="/login">
          {user ? () => setLocation('/') : () => <LoginPage />}
        </Route>
        <Route path="/upload">
          <ProtectedRoute component={UploadInfoPage} />
        </Route>
        <Route path="/">
          {user ? () => <RouteMapPage /> : () => setLocation('/login')}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
