import React, {useEffect, useRef, useState} from "react";
import s from './ChatWindow.module.css'
import socket from "../../socket";


const ChatWindow = ({users, roomID, messages, userName, addMessage}) => {
    const [message, setMessage] = useState('')
    const messagesRef = useRef(null)
    const formRef = useRef(null)
    const sendMessage = e => {
        e.preventDefault()
        if(message.trim() !== ''){
            socket.emit('ROOM:NEW_MESSAGE', {
                roomID,
                userName,
                text: message
            })
            addMessage({
                userName,
                text:message
            })
            setMessage('')
        }
    }

    useEffect(() => {
        messagesRef.current.scrollTo(0, 9999999)
    }, [messages])

    return <div className={s.wrap}>
        <div className={s.usersList}>
            <b>Users in room: {users.length}</b>
            <ul>
                {users.map((n, i) => <li key={n + i}>{n}</li>)}
            </ul>
        </div>
        <div className={s.roomName}>
            <h1>{roomID}</h1>
        </div>
        <div className={s.messages} ref={messagesRef}>
            {messages.map((m, i) => <div key={i + m.text} className={m.userName === userName ? s.myMessage : s.otherMessage}>
                <p>{m.text}</p>
                <span>{m.userName}</span>
            </div>)}
        </div>
        <div className={s.messageInput}>
            <form onSubmit={sendMessage} className={s.form} ref={formRef}>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                          rows={6} placeholder={'Enter your message...'}/>
                <input type={'submit'} className={s.send} value={'SEND'}/>
            </form>
        </div>
    </div>
}

export default ChatWindow