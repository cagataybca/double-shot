import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import { Training, Team } from './pages/PlaceholderPages';
import Onboarding from './pages/Onboarding';
import { Profile } from './pages/Profile';
import SplashScreen from './components/SplashScreen';
import { EquipmentGuide } from './pages/EquipmentGuide';
import Auth from './pages/Auth';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('doubleshot_auth') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('doubleshot_auth', 'true');
    setIsAuthenticated(true);
  };

  const ProtectedOnboarding = () => {
    if (localStorage.getItem('doubleshot_onboarding_completed') === 'true') {
      return <Navigate to="/" replace />;
    }
    return <Onboarding />;
  };

  const FallbackRoute = () => {
    if (localStorage.getItem('doubleshot_onboarding_completed') === 'true') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/onboarding" replace />;
  };

  return (
    <BrowserRouter>
      {/* 3-4 saniyelik Splash Ekranı */}
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : !isAuthenticated ? (
        /* Kullanıcı giriş yapmamışsa her ihtimalde Auth rotası çalışsın */
        <Routes>
          <Route path="*" element={<Auth onLogin={handleLogin} />} />
        </Routes>
      ) : (
        /* Kullanıcı giriş yapmışsa Ana Rotaya (Layout içine) izin ver */
        <Routes>
          {/* Onboarding Tam Ekran - Sadece çözmeyenler görebilir */}
          <Route path="/onboarding" element={<ProtectedOnboarding />} />

          {/* Layout ile sarılı Ana Modüller */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="training" element={<Training />} />
            <Route path="team" element={<Team />} />
            <Route path="profile" element={<Profile />} />
            <Route path="equipment" element={<EquipmentGuide />} />
          </Route>

          <Route path="*" element={<FallbackRoute />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
