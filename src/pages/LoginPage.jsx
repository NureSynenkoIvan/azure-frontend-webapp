import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const backendUrl = "https://synenko-chat.azurewebsites.net/"

  const backendEndpoint = backendUrl+'/auth';

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 

    const credentials = btoa(`${phoneNumber}:${password}`); 

    try {
      const response = await fetch(`${backendEndpoint}?userName=${phoneNumber}&password=${password}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) { 
        alert('Вхід успішний!');
        localStorage.setItem('isAuthenticated', 'true');
        
        localStorage.setItem('username', phoneNumber); 
        localStorage.setItem('password', password); 
        


        if (onLoginSuccess) {
          onLoginSuccess();
        }
        /*
        const userInfoResponse = await fetch(`${backendUrl}/api/user?username=${phoneNumber}`, {
        method: 'GET',
          headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          },
          });
          const userId = await userInfoResponse.json()
        
          alert(userId)
          localStorage.setItem('userid', userId)
        */
                 localStorage.setItem('userid', '1111112')

        navigate('/chats'); 
      } else {
        const errorData = await response.json(); 
        setError(errorData.message || 'Помилка автентифікації.');
        localStorage.removeItem('isAuthenticated'); 
        localStorage.removeItem('userPhoneNumber');
        localStorage.removeItem('userPassword');
        alert(errorData)
      }
    } catch (err) {
      setError('Помилка з’єднання. Будь ласка, спробуйте ще раз.');
      console.error('Login error:', err);
      localStorage.removeItem('isAuthenticated');
      alert(err)
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Вхід</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Логін:</label>
          <input
            type="text"
            id="username"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Увійти</button>
      </form>
    </div>
  );
}

export default Login;