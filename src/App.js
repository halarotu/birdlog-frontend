import React, {useState, useEffect} from 'react';
import './App.css';
import {Box, Button, Card, CardMedia, Container, Grid } from '@material-ui/core';
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
        <Button>Siirry aakkostettuun listaan</Button>
      </Link>
      <Card className="Bird">
        <div className="BirdInfo">
          <h3>{bird.nameFin}</h3>
          <p>Tieteellinen nimi: {bird.nameScientific}</p>
          <p>Lahko: <Link to={"/taxonomicrank/" + bird.order}> {bird.order} </Link></p>
          <p>Heimo: <Link to={"/taxonomicrank/" + bird.order + "/" + bird.family}> {bird.family} </Link></p>
          <p>Suku: <Link to={"/taxonomicrank/" + bird.order + "/" + bird.family + "/" + bird.genus}> {bird.genus} </Link></p>
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

function Taxonomicrank({taxonomicRanks, birds, selectedOrderName, selectedFamilyName, selectedGenusName}) {

  const selectedOrder = taxonomicRanks.find(rank => rank.nameScientific === selectedOrderName)
  const selectedFamily = taxonomicRanks.find(rank => rank.nameScientific === selectedFamilyName)
  const selectedGenus = taxonomicRanks.find(rank => rank.nameScientific === selectedGenusName)

  const getSpecificRanks = (level) => {
    return (
      taxonomicRanks.filter(rank => rank.level === level).sort(function(a, b) {
        if  (a.nameScientific > b.nameScientific) { return 1 }
        return -1 })
    )
  }

  const allOrders = getSpecificRanks('BIRD_ORDER')

  const getChildren = () => {
    const children = selectedGenusName ? birds.filter(bird => bird.genus === selectedGenusName) :
      selectedFamilyName ? taxonomicRanks.filter(rank => rank.parent === selectedFamilyName) :
      selectedOrderName ? taxonomicRanks.filter(rank => rank.parent === selectedOrderName) :
      allOrders
    
    const linkTo = selectedGenusName ? '/birds/' :
    selectedFamilyName ? '/taxonomicrank/' + selectedOrderName + '/' + selectedFamilyName + '/' :
    selectedOrderName ? '/taxonomicrank/' + selectedOrderName + '/' : '/taxonomicrank/'

    return children ? children.map((child, i) => createLink(linkTo + child.nameScientific,
       child.nameFin ? child.nameFin + ' / ' + child.nameScientific : child.nameScientific, i)) : ''
  }

  const createLink = (to, text, index) => {
    return (
      <Link key={index} to={to} >
        <Button>
          {text}
        </Button>
      </Link>
  )}

  return (
    <Box>
      <h2>Lintujen tieteellinen luokittelu</h2>
      <Link to="/" className="Link">
        <Button fullWidth={true} variant='outlined'>Palaa etusivulle</Button>
      </Link>
      <Grid>
        <div>
          {selectedOrder ? <h3>Lahko: {selectedOrderName}</h3> : <h3>Lahkot</h3>}
          {selectedFamily ? <h4>Heimo: {selectedFamilyName}</h4> : ''}
          {selectedGenus ? <h5>Suku: {selectedGenusName}</h5> : ''}
          {getChildren()}
        </div>
      </Grid>
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
  const [taxonomicRanks, setRanks] = useState([])

  useEffect(() => {getBirds()}, [])
  useEffect(() => {getTaxonomicRanks()}, [])

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

  const getTaxonomicRanks = () => {
    const url = BASE_URL + '/taxonomicrank'
    fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json() 
      } else {
        throw new Error(res)
      }
    })
    .then(ranks => setRanks(ranks))
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
            <Route exact path="/taxonomicrank" render={() => 
              <Taxonomicrank taxonomicRanks={taxonomicRanks} birds={birds} />}
            />
            <Route exact path="/taxonomicrank/:order" render={({ match }) => 
              <Taxonomicrank taxonomicRanks={taxonomicRanks} birds={birds} selectedOrderName={match.params.order} />} 
            />
            <Route exact path="/taxonomicrank/:order/:family" render={({ match }) => 
              <Taxonomicrank taxonomicRanks={taxonomicRanks} birds={birds} selectedOrderName={match.params.order} 
                selectedFamilyName={match.params.family} />} 
            />
            <Route exact path="/taxonomicrank/:order/:family/:genus" render={({ match }) => 
              <Taxonomicrank taxonomicRanks={taxonomicRanks} birds={birds} selectedOrderName={match.params.order} 
                selectedFamilyName={match.params.family} selectedGenusName={match.params.genus} />} 
            />
          </Router>
      </Container>
    </div>
  )
}


export default App;
