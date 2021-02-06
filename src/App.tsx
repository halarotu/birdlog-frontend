import React, {useState, useEffect} from 'react';
import './App.css';
import {Box, Button, Card, CardMedia, Container, Grid, Input } from '@material-ui/core';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

interface IBird {
  family: string,
  order: string,
  genus: string,
  nameFin: string,
  nameScientific: string
}

interface ITaxonomicRank {
  nameScientific: string,
  nameFin: string,
  level: string,
  parent: string
}

type BirdOrRank = IBird | ITaxonomicRank;

const BASE_URL = 'http://localhost:8080/api'

function Birds({birds}: {birds: IBird[] | undefined}): JSX.Element {
  birds = birds?.sort(function(a: IBird, b: IBird) {
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
      {birds ? birds.map((bird: IBird, i: number) => 
        <Link to={'/birds/'+bird.nameScientific} key={i} > 
          <Button>
            {bird.nameFin}
          </Button>
        </Link>) 
        : ''}
    </Box>
  )
}

function Bird({bird}: {bird: IBird | undefined}): JSX.Element {
  return (
    bird ?
    <div>
      <Link to="/" className="Link">
        <Button fullWidth={true} variant='outlined'>Palaa etusivulle</Button>
      </Link>
      <Link to="/birds" className="Link">
        <Button>Kaikki linnut</Button>
      </Link>
      <Link to="/taxonomicrank" className="Link">
        <Button>Kaikki lahkot</Button>
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
    : <div/>
  )
}

function Taxonomicrank({taxonomicRanks, birds, selectedOrderName, selectedFamilyName, selectedGenusName}: 
  {taxonomicRanks: ITaxonomicRank[], birds?: IBird[], selectedOrderName?: string, selectedFamilyName?: string, selectedGenusName?: string}): JSX.Element {

  const selectedOrder = taxonomicRanks.find(rank => rank.nameScientific === selectedOrderName)
  const selectedFamily = taxonomicRanks.find(rank => rank.nameScientific === selectedFamilyName)
  const selectedGenus = taxonomicRanks.find(rank => rank.nameScientific === selectedGenusName)

  const getSpecificRanks = (level: string) => {
    return (
      taxonomicRanks.filter(rank => rank.level === level).sort(function(a, b) {
        if  (a.nameScientific > b.nameScientific) { return 1 }
        return -1 })
    )
  }

  const allOrders = getSpecificRanks('BIRD_ORDER')

  const getChildren = () => {
    const children: BirdOrRank[] = selectedGenusName && birds ? birds.filter(bird => bird.genus === selectedGenusName) :
      selectedFamilyName ? taxonomicRanks.filter(rank => rank.parent === selectedFamilyName) :
      selectedOrderName ? taxonomicRanks.filter(rank => rank.parent === selectedOrderName) :
      allOrders
    
    const linkTo = selectedGenusName ? '/birds/' :
    selectedFamilyName ? '/taxonomicrank/' + selectedOrderName + '/' + selectedFamilyName + '/' :
    selectedOrderName ? '/taxonomicrank/' + selectedOrderName + '/' : '/taxonomicrank/'

    return children ? children.map((child: BirdOrRank, i: number) => createLink(linkTo + child.nameScientific,
       child.nameFin ? child.nameFin + ' / ' + child.nameScientific : child.nameScientific, i)) : ''
  }

  const createLink = (to: string, text: string, index: number): JSX.Element => {
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
          {selectedOrder ? 
            <Link to="/taxonomicrank" className="Link">
              <Button fullWidth={true} >Kaikki lahkot</Button>
            </Link>: ''}
          {selectedOrder ? selectedFamily ? 
            <h3>Lahko:  <Link to={"/taxonomicrank/" + selectedOrderName}>{selectedOrder.nameFin} / {selectedOrderName}</Link></h3> : 
            <h3>Lahko: {selectedOrder.nameFin} / {selectedOrderName}</h3> : <h3>Lahkot</h3>}
          {selectedFamily ? selectedGenus ? 
            <h4>Heimo: <Link to={"/taxonomicrank/" + selectedOrderName + "/" + selectedFamilyName}>
              {selectedFamily.nameFin} / {selectedFamilyName}</Link></h4> : 
            <h4>Heimo: {selectedFamily.nameFin} / {selectedFamilyName}</h4> : ''}
          {selectedGenus ? <h5>Suku: {selectedGenusName}</h5> : ''}
          {getChildren()}
        </div>
      </Grid>
    </Box>
  )
}

function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    fetch(BASE_URL + "/perform_login", {
      method: 'post',
      body: JSON.stringify({username: username, password: password})
    })
    .then(res => {
      if (res.redirected) window.location = (res.url as unknown) as Location
    })
    .catch(e => console.warn(e))

  }

  const handleFormDataChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    switch (event.target.name) {
      case 'username' :
          setUsername(event.target.value)
          break
      case 'password' :
          setPassword(event.target.value)
          break
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Kirjautuminen</h2>
      <div className="FormElement">
        <p>Käyttäjätunnus:</p>
        <input type="text" name="username" value={username} onChange={handleFormDataChange} />
      </div>      
      <div className="FormElement">
        <p>Salasana:</p>
        <input type="password" name="password" value={password} onChange={handleFormDataChange} />
      </div>
      <div>
        <input type="submit" name="submit-button" value="Kirjaudu" />
      </div>
    </form>
  )
}

function Home() {

  const onLogout = () => {
    fetch(BASE_URL + "/perform_logout", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json' }
    })
    .then(res => {
      if (res.redirected) {
        window.location = (res.url as unknown) as Location
      }
    })
    .catch(e => console.warn(e))
  }

  return (
    <Box>
        <Link to="/birds">
          <Button>Linnut aakkosjärjestyksessä</Button>
        </Link>
        <Link to="/taxonomicrank">
          <Button>Lintujen tieteellinen luokittelu</Button>
        </Link>
        <CardMedia className="FrontPagePicture"
          image="/lapasorsa-bw.jpeg"
          title="Lapasorsa"
        />
        <Button onClick={onLogout}>Kirjaudu ulos</Button>
    </Box>
  )
}

function App(): JSX.Element {
  const [birds, setBirds] = useState<IBird[]>()
  const [taxonomicRanks, setRanks] = useState<ITaxonomicRank[]>([])

  useEffect(() => {getBirds()}, [])
  useEffect(() => {getTaxonomicRanks()}, [])

  const getBirds = () => {
    const url = BASE_URL + '/bird'
    fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json() 
      } else {
        throw new Error('Response not ok.')
      }
    })
    .then(birds => setBirds(birds))
    .catch(error => console.log(error))
  }

  const getTaxonomicRanks = () => {
    const url: string = BASE_URL + '/taxonomicrank'
    fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json() 
      } else {
        throw new Error('Response not ok.')
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
              <Bird bird={birds?.find((bird) => 
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
            <Route exact path="/login" render={() => <Login />} />
          </Router>
      </Container>
    </div>
  )
}


export default App;
