import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Chats from './pages/Chats';
import ChatRoom from './pages/ChatRoom';

  const getAuthHeader = () => {
    const phone = localStorage.getItem('userPhoneNumber');
    const password = localStorage.getItem('userPassword');
    return 'Basic ' + btoa(`${phone}:${password}`);
  };


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/chats" element={<Chats/>}/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat/:chatId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
