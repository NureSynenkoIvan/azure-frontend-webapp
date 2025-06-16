import React, { useState, useEffect } from 'react';
import './Chats.css'; 
import { useNavigate } from 'react-router-dom';

function Chats() {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showNewChatForm, setShowNewChatForm] = useState(false); 
    const [newChatName, setNewChatName] = useState('');
    const [newChatParticipants, setNewChatParticipants] = useState('');
    const [newChatType, setNewChatType] = useState('direct'); 

    const username = localStorage.getItem('username');
    const backendUrl = "https://synenko-chat.azurewebsites.net";

     const navigate = useNavigate(); 
      const handleChatClick = (chatId) => {
              navigate(`/chat/${chatId}`);
      };

    const fetchChats = async () => {
        setLoading(true); 
        setError(null);    

        try {
            const phone = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            const credentials = btoa(`${phone}:${password}`);
            alert(`${phone}:${password}`)
            setUserId("1111112")
          

            const chatsResponse = await fetch(`${backendUrl}/api/user/chats?userId=1111112`, {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${credentials}`
                }
            });

            if (!chatsResponse.ok) {
                throw new Error(`Помилка отримання чатів! Статус: ${chatsResponse.status}`);
            }
            const chatsData = await chatsResponse.json();
            setChats(chatsData);

        } catch (err) {
            setError('Не вдалося завантажити дані. ' + err.message);
            console.error('Помилка завантаження даних:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [username, backendUrl]); 

    const handleCreateNewChat = async (e) => {
        e.preventDefault(); 

        if (!newChatName.trim() || !newChatParticipants.trim()) {
            alert('Будь ласка, заповніть усі обов\'язкові поля: "Назва чату" та "Учасники".');
            return;
        }

        const participantsArray = newChatParticipants.split(',').map(p => p.trim()).filter(p => p !== '');


        if (!participantsArray.includes(userId)) {
            participantsArray.push(userId);
        }

        const newChat = {
            name: newChatName.trim(),
            participants: participantsArray,
            type: newChatType,
        };

        try {
            const phone = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            const credentials = btoa(`${phone}:${password}`);

            const response = await fetch(`${backendUrl}/api/user/chats?userId=${userId}`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${credentials}`
                },
                body: JSON.stringify(newChat)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Помилка створення чату! Статус: ${response.status}. Деталі: ${errorText}`);
            }

            await fetchChats(); 
            setShowNewChatForm(false);
            setNewChatName('');
            setNewChatParticipants('');
            setNewChatType('direct'); 
            alert('Чат успішно створено!');

        } catch (err) {
            setError('Не вдалося створити чат. ' + err.message);
            console.error('Помилка створення чату:', err);
        }
    };

    if (loading) {
        return <div className="chats-container">Завантаження чатів...</div>;
    }

    if (error) {
        return <div className="chats-container error-message">{error}</div>;
    }

    

    return (
        <div className="chats-container">
            <h2>Ваші чати ({username})</h2>
            {chats.length === 0 ? (
                <p>У вас ще немає чатів.</p>
            ) : (
                <ul className="chats-list">
                    {chats.map(chat => (
                        <li 
                            key={chat.id} 
                            className="chat-item" 
                            onClick={() => handleChatClick(chat.id)} 
                        >
                            <h3>{chat.name || 'Без назви'}</h3>
                            <p>Учасники: {chat.participants.join(', ')}</p>
                            <p>Тип чату: {chat.type === 'direct' ? 'Прямий' : chat.type}</p>
                            {chat.lastMessageAt && <p>Останнє повідомлення: {new Date(chat.lastMessageAt).toLocaleString()}</p>}
                        </li>
                    ))}
                </ul>
            )}

            <hr /> 

            {!showNewChatForm && (
                <button className="new-chat-button" onClick={() => setShowNewChatForm(true)}>
                    Новий чат
                </button>
            )}

            {showNewChatForm && (
                <div className="new-chat-form-container">
                    <h3>Створити новий чат</h3>
                    <form onSubmit={handleCreateNewChat}>
                        <div className="form-group">
                            <label htmlFor="chatName">Назва чату:</label>
                            <input
                                type="text"
                                id="chatName"
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="participants">Учасники (через кому, напр. user123, user456):</label>
                            <input
                                type="text"
                                id="participants"
                                value={newChatParticipants}
                                onChange={(e) => setNewChatParticipants(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="chatType">Тип чату:</label>
                            <select
                                id="chatType"
                                value={newChatType}
                                onChange={(e) => setNewChatType(e.target.value)}
                            >
                                <option value="direct">Прямий (один на один)</option>
                                <option value="group">Груповий</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit">Створити чат</button>
                            <br></br>
                            <button type="button" onClick={() => setShowNewChatForm(false)}>Скасувати</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chats;