import React, {useState} from "react";
import s from '../../App.module.css'
import axios from "axios";

const JoinBlock = props => {
    const [roomID, setRoomID] = useState('')
    const [userName, setUserName] = useState('')
    const [isLoading, setLoading] = useState(false)

    const onEnter = async () => {
        if(!roomID || !userName) return alert('Wrong data')
        const obj = {
            roomID,
            userName
        }
        setLoading(true)
        await axios.post('/rooms', obj)
        props.onLogin(obj)
    }
    return <div className={s.form}>
        <h1>Welcome</h1>
        <input type={'text'} placeholder={'Room ID'}
               name={'roomID'}   value={roomID}
               onChange={e => setRoomID(e.target.value)}/>

        <input type={'text'} placeholder={'Your nickname'}
               name={'userName'} value={userName}
               onChange={e => setUserName(e.target.value)}/>

        <button onClick={onEnter} disabled={isLoading}>{
            isLoading ? 'CONNECTING...' : 'CONNECT'
        }</button>
    </div>
}

export default JoinBlock