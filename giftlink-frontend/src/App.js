import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import Navbar from './components/Navbar/Navbar';
import SearchPage from './components/SearchPage/SearchPage';
import Home from './components/Home/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { useAppContext } from './context/AuthContext';

function App() {

  return (
      <AuthProvider>
        <Navbar/>
        <Routes>
          {/* the final code will not pass the products to every page, but each page will call the server API */}
          {/* Landing/home variants */}
          
          <Route path="/app" element={<MainPage />} />
          <Route path="/home" element={<Home />} />
          {/* Auth routes */}
          <Route path="/app/login" element={<LoginPage />} />
          <Route path="/app/register" element={<RegisterPage />} />
          {/* Search and details */}
          <Route path="/product/:productId" element={<DetailsPage />} />
          <Route path="/app/search" element={<SearchPage />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;
