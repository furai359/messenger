import React, {useEffect, useReducer} from 'react';
import s from './App.module.css';
import JoinBlock from "./components/JoinBlock/JoinBlock";
import reducer from "./reducers/reducer";
import socket from "./socket";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import axios from "axios";

const App = () => {
    const [state, dispatch] = useReducer(reducer, {
        joined:   false,
        roomID:   null,
        userName: null,
        users:    [],
        messages: []
    })

    const onLogin = async (obj) => {
        dispatch({
            type:'JOINED',
            payload: obj
        })
        socket.emit('ROOM:JOIN', obj)
        const {data} = await axios.get(`/rooms/${obj.roomID}`)
        dispatch({
            type: 'SET_DATA',
            payload: data
        })
    }

    const setUsers = (users) => {
        dispatch({
            type:'SET_USERS',
            payload: users
        })
    }

    const addMessage = (message) => {
        dispatch({
            type:'NEW_MESSAGE',
            payload: message
        })
    }

    useEffect(() => {
        socket.on('ROOM:USER_JOINED', data => {
            setUsers(data.users)
        })
        socket.on('ROOM:USER_LEFT',   data => {
            setUsers(data.users)
        })
        socket.on('ROOM:NEW_MESSAGE', message => {
            addMessage(message)
        })
    }, [])
    return <div className={s.wrap}>
        {state.joined
            ? <ChatWindow {...state} addMessage={addMessage}/>
            : <JoinBlock onLogin={onLogin}/>}
    </div>
}



export default App;
