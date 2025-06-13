import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Chats from './pages/Chats';
import ChatRoom from './pages/ChatRoom';


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
