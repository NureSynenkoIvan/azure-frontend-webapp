import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import './ChatRoom.css'; 

function ChatRoom() {
    const { chatId } = useParams(); 
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState(''); 
    
    const currentUserId = localStorage.getItem('userid') 
    const backendUrl = "https://synenko-chat.azurewebsites.net/";

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            setError(null);

            try {
                const phone = localStorage.getItem('username');
                const password = localStorage.getItem('password');
                const credentials = btoa(`${phone}:${password}`);

                const response = await fetch(`${backendUrl}/api/chat/messages?chatId=${chatId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Basic ${credentials}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Помилка отримання повідомлень чату! Статус: ${response.status}`);
                }

                const messagesData = await response.json();
                setMessages(messagesData);

            } catch (err) {
                setError('Не вдалося завантажити повідомлення. ' + err.message);
                console.error('Помилка завантаження повідомлень:', err);
            } finally {
                setLoading(false);
            }
        };

        if (chatId) { 
            fetchMessages();
        }
    }, [chatId, backendUrl]); 

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) {
            return;
        }
        const messageToSend = {
            chatId: chatId,
            senderId: currentUserId, 
            content: newMessage.trim(),
        };

        try {
            const phone = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            const credentials = btoa(`${phone}:${password}`);

            const response = await fetch(`${backendUrl}/api/chat/messages?userId=${currentUserId}&chatId=${chatId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${credentials}`
                },
                body: JSON.stringify(messageToSend)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Помилка надсилання повідомлення! Статус: ${response.status}. Деталі: ${errorText}`);
            }

            setNewMessage('');
            
        } catch (err) {
            setError('Не вдалося надіслати повідомлення. ' + err.message);
            console.error('Помилка надсилання повідомлення:', err);
        }
    };

    if (loading) {
        return <div className="chat-room-container">Завантаження повідомлень...</div>;
    }

    if (error) {
        return <div className="chat-room-container error-message">{error}</div>;
    }

    return (
        <div className="chat-room-container">
            <h2>{chatId}</h2>
            <div className="messages-list">
                {messages.length === 0 ? (
                    <p>Повідомлень поки що немає.</p>
                ) : (
                    messages.map(message => (
                        <div 
                            key={message.id} 
                            className={`message-item ${message.senderId === currentUserId ? 'my-message' : 'other-message'}`}
                        >
                            <span className="message-sender">{message.senderId}:</span>
                            <span className="message-content">{message.content}</span>
                            <span className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введіть ваше повідомлення..."
                    className="message-input"
                />
                <button type="submit" className="send-message-button">Надіслати</button>
            </form>
        </div>
    );
}

export default ChatRoom;