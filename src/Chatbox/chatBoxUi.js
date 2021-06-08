import React, {useState} from 'react';
import { Container, Row, Col, Form, InputGroup,Button } from 'react-bootstrap';
import socket from '../socketClient'


const ChatBoxUi = (props)=>{
  const [msg, setMsg] = useState("")

  const keyPress = (e)=>{
      if(e.keyCode == 13){
        onClickSend()
      }
  }

  const onClickSend = ()=>{
    props.onClickSend(msg)
    setMsg("")
  }

  const generateMessage = (c)=>{
    switch(c.type){
      case "message":
        return <>
          <span style={{fontWeight:"bold"}}>{c.name}: </span>
          <span>{c.message}</span>
        </>
        break 
      case "welcome":
        return <>
          <span className="text-danger">Welcome <b>{c.name}</b> to the chat!</span>
        </>
      case "winner":
        return <>
          <span className="text-success">Congrats <b>{c.name}</b> on winning <b>{c.prize}</b>!</span>
        </>
    }
  }

  return <Container>
    <Row>
      <Col md="12">
        <div className="border border-dark" style={{height:"70vh",overflow: "scroll"}}>
          <div>
            {
              props.chats.map((c)=>{
                return <div key={c.messageId} className="d-block p-1">
                  {generateMessage(c)}
                </div>
              })
            }
           
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col md="12" className="mt-2">
        <Form.Group>
          <InputGroup>
            <Form.Control type="text" value={msg} onKeyDown={keyPress} onChange={evt=>setMsg(evt.target.value)}></Form.Control>
            <InputGroup.Append>
              <Button variant="secondary" onClick={()=>props.onClickSend(msg)}>Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Col>
    </Row>
  </Container>
}

 export default ChatBoxUi