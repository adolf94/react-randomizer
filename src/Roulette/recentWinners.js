import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { useRouteMatch, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import socket from '../socketClient'
import dbContext from '../indexDb/dbContext'
import moment from 'moment'
const RecentWinners = (props)=>{
  const location = useLocation()
  const route = useRouteMatch()
  const {db} = useContext(dbContext)
  const [winners, setWinners] = useState([])

useEffect(()=>{
  (async ()=>{
    const query = queryString.parse(props.location.search)
    console.log(query)
    if(query.admin_key){
      let winners = await db.prizes.orderBy("prizeId").desc().limit(20).toArray()
      socket.emit("show_winners", {to:route.params.roomId, winners:winners})
      console.log(winners)
      setWinners(winners)
    }else{
      socket.emit("request_winners", "")
    }

  })()

},[])

useEffect(()=>{
  socket.on("show_winners", data=>{
    setWinners(data);
  })

  const declareWinner = (data)=>{

  }


  socket.on("declare_winner", data=>{
    setWinners([data,...winners]);
  })
},[winners])


return <>
  <Container fluid className="mt-3">
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title>Recent Winners</Card.Title>
          </Card.Header>
          <div className="d-none d-md-block">
            <Table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Name</th>
                  <th>Prize</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((w)=><tr>
                  <td>{}</td>
                  <td>{w.winner}</td>
                  <td>{w.prizeName}</td>
                </tr>)}
              </tbody>
            </Table>
          </div>
          <div className="d-block d-md-none" style={{height:'50vh', overflow:'scroll'}}>
            <Container>
            {winners.map((w)=><Row className="border border-primary py-2">
                <Col sm={12}>
                  <b>{w.winner} </b>
                </Col>
                <Col>
                  <Badge variant="success">{w.prizeName}</Badge>
                  <Badge></Badge>
                </Col>
                <Col>
                  <Badge>{moment(w.time).format("MM-DD HH:mm")}</Badge>
                </Col>
              </Row>)}
            </Container>
          </div>
        </Card>
      </Col>
    </Row>
  </Container>
</>

}

export default RecentWinners

