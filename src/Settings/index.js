import React, {useState, useContext, useEffect} from 'react';
import {Button, Modal, Row, Form, Col, InputGroup, Table, Nav, Container} from 'react-bootstrap'
import dbContext from '../indexDb/dbContext';


const SettingsModal = (props)=>{
  const [show, setShow] = useState(false)
  const {db} = useContext(dbContext)
  const [participant, setParticipant] = useState({
    name:"",
    type:""
  })

  useEffect(()=>{

  })

  const onAdd = async ()=>{
    let newParticipant = await db.participants.add(participant)
    props.onParticipantUpdate([...props.participants,{...participant, id:newParticipant}])
    setParticipant({
      name:"",
      type:""
    })
  }

  return <>
  <Button variant="primary" onClick={()=>setShow(true)} >Settings</Button>
  <Modal show={show} size="lg" onHide={()=>setShow(false)}>
    <Modal.Header closeButton>
      Settings
    </Modal.Header>
    <Modal.Body>
      <Nav activeKey="participants">
        <Nav.Item>
          <Nav.Link eventKey="participants">Participants</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Prizes">Prizes</Nav.Link>
        </Nav.Item>
      </Nav>
      <Container>
        <Row>
          <Col md={8}>
            <Form.Group>
              <Form.Label>Add participant</Form.Label>
              <InputGroup>
                <InputGroup.Append>
                  
                <Form.Control value={participant.name} placeholder="Name" onChange={(evt)=>setParticipant({...participant,name:evt.target.value})}/>
                </InputGroup.Append>
                <Form.Control value={participant.type} placeholder="Type" onChange={(evt)=>setParticipant({...participant,type:evt.target.value})}/>
                <InputGroup.Prepend>
                  <Button variant="success" onClick={onAdd}>Add</Button>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {props.participants.map((u)=><tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.type}</td>
                </tr>)}
              </tbody>
            </Table>

          </Col>
          <Col md={4}>
            <Table>
              <thead>
                <tr>
                  <th>Prize</th>
                </tr>
              </thead>
              <tbody>
                
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Modal.Body>
  </Modal>
  </>
}

export default SettingsModal