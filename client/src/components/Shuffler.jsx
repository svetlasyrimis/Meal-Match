import React from 'react'

import CrossfadeImage from 'react-crossfade-image'

// import Container from 'react-bootstrap/Container'
// import Col from 'react-bootstrap/Col'
// import Row from 'react-bootstrap/Row'
// import Button from 'react-bootstrap/Button'
import { Row, Col, Container } from 'react-bootstrap'



const CardCombo = (props) => {
  const { food, foodImage, drink, drinkImage } = props.data



  return (

    <>

      <Container >

        {/* <h3>{food} & {drink} </h3> */}
        <Row>
          <Col md={{ span: 3, offset: 3 }}>

            <CrossfadeImage src={foodImage} style={{ maxWidth: "100%", borderRadius: "20%" }}
              timingFunction={"ease-in-out"}
              duration={800}
              alt="food" />
            <p>{food}</p>
          </Col>

          <Col md={{ span: 3, offset: -3 }}>
            <CrossfadeImage src={drinkImage} style={{ maxWidth: "100%", borderRadius: "20%" }}
              timingFunction={"ease-in-out"}

              duration={800}
              alt='dr' />
            <p>{drink}</p>
          </Col>
        </Row>

      </Container >


    </>







  )
}

export default CardCombo