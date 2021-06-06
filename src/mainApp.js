
import React, { useEffect, useState } from 'react';
import {Container,Button, Row, Col, Modal,Form} from 'react-bootstrap'
import { useRouteMatch } from 'react-router-dom';
import ChatBox from './Chatbox';
import RouletteWheel from './Roulette';
import Dexie from 'dexie'
import DbContext from './indexDb/dbContext'
import queryString from 'query-string'
import socket from './socketClient'


const Randomizer = (props)=>{
  const [name, setName] = useState("")
  const [registered, setRegistered] = useState(false)
  const [show, setShow] = useState(true)
  const route = useRouteMatch()
  const [db,setDb] = useState(null)

  useEffect(()=>{
    let db = new Dexie(route.params.roomId + '_random')
    db.version(1).stores({
      participants:'++id,name,type',
      prizes:'++prizeId, prizeName, isClaimed, eventId, winner, time',
      event:'++eventId, eventName'
    })
    setDb(db)
  }, [])

  useEffect(()=>{
    const query = queryString.parse(props.location.search)
    if(query.admin_key){
      socket.emit("admin_login","")
    }


    socket.on("request_winners", data => {
      let winners = db.prizes.orderBy("prizeId").desc().limit(20).then((data)=>{
        socket.emit("show_winners", {to:data.id, winners})
      })
    })


  }, [])


  const onRegister = ()=>{
    socket.emit("register", {name:name, room:route.params.roomId})
    setName("");
    setRegistered(true);
    setShow(false);
  }

  return <DbContext.Provider value={{db, socket, registered}}>
   {db?<div className="m-2">
      <Container fluid>
      <Row  className="pt-5">
        <Col md={6}>
          <RouletteWheel {...props} ></RouletteWheel>
        </Col>
        <Col md={6}>
          <ChatBox registered={registered}></ChatBox>
        </Col>
      </Row>
      <Modal show={show} onHide={()=>setShow(false)} 
          backdrop="static"
          keyboard={false}>
        <Modal.Header>
          Who are you?
        </Modal.Header>
        <Modal.Body>
          <Form.Control value={name} onChange={(evt)=>setName(evt.target.value)}></Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={onRegister}>Submit</Button>
          
        </Modal.Footer>
      </Modal>
    </Container>
  </div>:null}
  </DbContext.Provider>
}


export default Randomizer;