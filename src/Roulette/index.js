import { Dropdown, Button,Col,Container,Form,Modal, Nav, Row, Table } from 'react-bootstrap'
import React, { useState, useEffect, useContext} from 'react'
import { useFilePicker } from 'react-sage';
import moment from 'moment'
import './roulette.css'
import SettingsModal from '../Settings';
import dbContext from '../indexDb/dbContext'
import socket from '../socketClient'
import RecentWinners from './recentWinners';
const data = [
  { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
  { option: '1', style: { backgroundColor: 'white', textColor:"black" } },
  { option: '2' },
]

const RouletteWheel = (props) => {
  const [mustSpin, setMustSpin] = useState(false)
  const {db} = useContext(dbContext)

  const [winner, setWinner] = useState(1)
  const [show,setShow] = useState(false)
  const [participants, setParticipants] = useState([])
  const [randomState, setRandomState] = useState({
    show:false,
    participants:[],
    participantGroup:"",
    winner:[],
    prize:"",
    count:0
  })

  
  const [socketState, setSocketState] = useState({
    sw:false,
    participants:[],
    participantGroup:"",
    winner:[],
    prize:"",
    count:0
  })


  useEffect(()=>{
    (async ()=>{
      let data = await db.participants.toArray()
      setParticipants(data);
      setRandomState({...randomState,count:data.length})
    })()
    
  },[])

   useEffect(()=>{
    socket.on("perform_random", data=>{
      setSocketState(data)
    })
    socket.on('reset_random',data=>{
      setSocketState({
        sw:false,
        participants:[],
        participantGroup:"",
        winner:[],
        prize:"",
        count:0
      })
    })

    return ()=>{
      socket.off("perform_random")
      socket.off("reset_random")
    }
   })

  const selectGroup = (group)=>{
    const users = group==="Everyone"?participants:participants.filter(p=>p.type===group)
    setRandomState({...randomState,participantGroup:group,count:users.length,participants:users })

  }


  const rollTheRoleta = ()=>{
    if(randomState.participantGroup === ""){
      return
    }

    if(socketState.show){
      socket.emit('roll_random',{...socketState,show:false})
      return
    }

      let tempusers = [...randomState.participants]
    if(randomState.participants.length < 50){
      let multiplier = Math.ceil(50/randomState.participants.length);
      for(let x=1;x<multiplier;x++){
        tempusers.push([...randomState.participants]);
      }
      tempusers = tempusers.flat()
    }
    tempusers = tempusers.map(v=>{
      v.randomId = Math.random();
      return {...v};
    }).sort((a,b)=>a.randomId-b.randomId).slice(0,49);
    // prizeName, isClaimed, eventId, winner, time
    let winner = randomState.participants.map(v=>{
      // v.randomId = Math.random();
      // v.time = moment().add(7,'seconds').toISOString();
      return{
        ...v,
        randomId:Math.random(),
        isClaimed:true,
        eventId:null,
        winner:v.name,
        prizeName:randomState.prize,
        time: moment().add(7,'seconds').toISOString()
      }
    }).sort((a,b)=>a.randomId-b.randomId)[0]
    db.prizes.add(winner);
    socket.emit('roll_random',{...randomState,show:true, participants:tempusers, winner:winner })
  }
  let distinctType = ["Everyone", ...participants.map(e=>e.type).filter((v,i,s)=>s.indexOf(v)===i).sort()]

  return <div className="text-center">
          <Container>
            <Row>
              <Col md="12">
                <div className={(socketState.show?'d-none':'d-block')}>
                  <h2>No current raffle</h2>
                </div>
                <b className={(!socketState.show?'d-none':'d-block')}>Currently drawing {socketState.prize}</b>
                <div style={{margin:'2rem',height:'4.5rem', overflow:'hidden', position:'relative',display:(!socketState.show?'none':'block')}}>
                  <div style={{display:'block'}}>
                    <Container>
                      <Row class="flex-justify-center">
                        <div className="initialPosition" >
                            <div className="mb-5 bg-success">
                              <h2>{socketState.winner.name}</h2>
                            </div>
                            {
                              socketState.participants.map((v,i)=><div key={i} className="mb-5">
                                <h2>{v.name}</h2>
                              </div>)
                            }
                        </div>
                      </Row>
                  </Container>
                  </div>
              </div>
                
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group>
                <Dropdown>
                  <Dropdown.Toggle variant="info" id="dropdown-basic">
                    {randomState.participantGroup===""?"Select Participants":randomState.participantGroup}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {distinctType.map(v=><Dropdown.Item key={v} onClick={()=>selectGroup(v)}>
                      {v}
                    </Dropdown.Item>)}
                  </Dropdown.Menu>
                </Dropdown>
                <small>{randomState.count} participants</small>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Control type="text" value={randomState.value} placeholder="Type the prize item" onChange={(evt)=>setRandomState({...randomState,prize:evt.target.value})} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant={socketState.show?'danger':'success'} onClick={rollTheRoleta} >{socketState.show?"Reset":"Spin"}</Button>
              <SettingsModal participants={participants} onParticipantUpdate={(data)=>setParticipants(data)} />
            </Col>
          </Row>
          <RecentWinners {...props}></RecentWinners>
        </Container>
    </div>
  // return (
  // <div>
  //   <div class="d-flex justify-content-center">
  //     <div>
  //       <Wheel
  //         mustStartSpinning={mustSpin}
  //         prizeNumber={2}
  //         data={data}
  //         backgroundColors={['#3e3e3e', '#df3428']}
  //         textColors={['#ffffff']}
  //         onStopSpinning={()=>setMustSpin(false)}
  //       />
  //       <Button variant="success" onClick={()=>setMustSpin(true)} >Spin</Button>
  //     </div>
  //   </div>
  // </div>
  // )
}
export default RouletteWheel