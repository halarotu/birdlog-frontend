import React, {useState, useEffect} from 'react';
import './App.css';
import {Box, Button, Card, CardMedia, Container } from '@material-ui/core';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

const BASE_URL = 'http://localhost:8080'

function Birds({birds}) {
  birds = birds.sort(function(a, b) {
    if  (a.nameFin > b.nameFin) {
      return 1
    }
    return -1
  })

  return (
    <Box my={4}>
      <h2>Lintulajit aakkosjärjestyksessä</h2>
      <Link to="/" className="Link">
        <Button fullWidth={true} variant='outlined' >Palaa etusivulle</Button>
      </Link>
      {birds ? birds.map((bird, i) => 
        <Link to={'/birds/'+bird.nameScientific} key={i} > 
          <Button>
            {bird.nameFin}
          </Button>
        </Link>) 
        : ''}
    </Box>
  )
}

function Bird({bird}) {
  return (
    bird ?
    <div>
      <Link to="/birds" className="Link">
        <Button>Palaa listaan</Button>
      </Link>
      <Card className="Bird">
        <div className="BirdInfo">
          <h3>{bird.nameFin}</h3>
          <p>Tieteellinen nimi: {bird.nameScientific}</p>
          <p>Lahko: {bird.order}</p>
          <p>Heimo: {bird.family}</p>
          <p>Suku: {bird.genus}</p>
        </div>
        <CardMedia className="BirdPicture"
          image="/Lapasorsa.jpg"
          title="Lapasorsa"
        />
      </Card>
    </div>
    : ''
  )
}

function Taxonomicrank() {
  return (
    <Box>
    <h2>Lintujen tieteellinen luokittelu</h2>
      <Link to="/" className="Link">
        <Button fullWidth={true} variant='outlined'>Palaa etusivulle</Button>
      </Link>
    </Box>
  )
}

function Home() {
  return (
    <Box>
        <Link to="/birds">
          <Button>Linnut aakkosjärjestyksessä</Button>
        </Link>
        <Link to="/taxonomicrank">
          <Button>Lintujen tieteellinen luokittelu</Button>
        </Link>
    </Box>
  )
}

function App() {
  const [birds, setBirds] = useState([])

  useEffect(() => {getBirds()}, [])

  const getBirds = () => {
      const url = BASE_URL + '/bird'
      fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json() 
        } else {
          throw new Error(res)
        }
      })
      .then(birds => setBirds(birds))
      .catch(error => console.log(error))
}

  return (
    <div className="App">
      <Container maxWidth="sm">
          <h1>Suomessa havaitut lintulajit</h1>
          <Router>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/birds" render={() => <Birds birds={birds} />} />
            <Route exact path="/birds/:id" render={({ match }) => 
              <Bird bird={birds.find((bird) => 
                bird.nameScientific === match.params.id) } />} 
            />
            <Route exact path="/taxonomicrank" render={() => <Taxonomicrank />} />
          </Router>
      </Container>
    </div>
  )
}


export default App;
