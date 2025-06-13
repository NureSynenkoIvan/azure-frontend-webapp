import React, { useState } from 'react';
import './RegisterPage.css';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const api = "192.168.56.1:8080"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const id = uuidv4();

    const user = {
      id,
      username,
      email,
      passwordHash: password, //Unhashed
      profilePicture,
      bio,
      chats: []
    };

    try {
      const response = await fetch(api + `/auth/register?username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setSuccess('Користувач успішно зареєстрований!');
        setUsername('');
        setEmail('');
        setPassword('');
        setProfilePicture('');
        setBio('');
      } else {
        const message = await response.text();
        setError(`Помилка: ${message}`);
      }
    } catch (err) {
      setError(`Сетева помилка: ${err.message}`);
    }
  };

  return (
    <div className="register-container">
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Імʼя користувача:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Електронна пошта:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Посилання на аватар:</label>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Біо:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button type="submit">Зареєструватися</button>
      </form>

      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}