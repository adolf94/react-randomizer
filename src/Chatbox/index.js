
import React, { useEffect, useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import socket from '../socketClient'
import dbContext from '../indexDb/dbContext'
import ChatBoxUi from './chatBoxUi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
const makeid = (length) => {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}

const ChatBox = (props)=>{
  const [msg, setMsg] = useState("")
  const [show, setShow] = useState("")
  const {db} = useContext(dbContext)

  const [chats, setChats] = useState([])

  useEffect(()=>{
    console.log(chats)
  },[socket])

  useEffect(()=>{
    socket.on("new_message", (data)=>onNewMessage(data))
    socket.on("welcome", (data)=>onNewMessage({name:data, type:"welcome", messageId:makeid(5)}))

    return ()=>{
      
      socket.off("new_message")
      socket.off("welcome")
    }
  })

  useEffect(()=>{
    const newMessage =  data=>{
      if(!chats.find(c=>c.messageId == data.messageId)){
        setChats([...chats,{...data, type:"winner"}])
      }
    }


    socket.off("declare_winner", newMessage).on("declare_winner",newMessage)

    return ()=>{
      socket.off("declare_winner", newMessage)
    }

  }, [chats])

  const onNewMessage = (data)=>{
    setChats([...chats,data])
  }

  const onClickSend = ()=>{
    socket.emit("send_message",{
      name:"AR",
      message:msg,
      type:"message"
    })
    setMsg("")
  }

  const keyPress = (e)=>{
      if(e.keyCode == 13){
        onClickSend()
      }
  }



  return <div className="p-2 ">
    <div className="d-none d-md-block"><ChatBoxUi chats={chats} onClickSend={onClickSend} /></div>
    <div  className="d-block d-md-none" >
      {(props.registered&&!show)?<Fab mainButtonStyles={{backgroundColor:'red'}} icon={<FontAwesomeIcon icon={faComment} /> } onClick={()=>setShow(!show)}></Fab>:null}
      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton>
          Chat
        </Modal.Header>
        <Modal.Body>
          <ChatBoxUi chats={chats} onClickSend={onClickSend} />
        </Modal.Body>
      </Modal>
    </div>
  </div>
}

export default ChatBox