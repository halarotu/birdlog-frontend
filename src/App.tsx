import React, {useState, useEffect} from 'react';
import './App.css';
import {Box, Button, Container, Grid } from '@material-ui/core';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Cookies from 'universal-cookie'
import {Home} from './components/Home'
import {Login} from './components/Login'
import {MyImages} from './components/MyImages'
import {AddImage} from './components/AddImage'
import {Birds} from './components/Birds'
import {Bird} from './components/Bird'

export interface IBird {
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

const BASE_URL = 'http://localhost:8080'
const COOKIE_NAME = 'BL_AUTH'

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

  const allOrders: ITaxonomicRank[] = getSpecificRanks('BIRD_ORDER')

  const getChildren = (): JSX.Element[] => {
    const children: BirdOrRank[] = selectedGenusName && birds ? birds.filter(bird => bird.genus === selectedGenusName) :
      selectedFamilyName ? taxonomicRanks.filter(rank => rank.parent === selectedFamilyName) :
      selectedOrderName ? taxonomicRanks.filter(rank => rank.parent === selectedOrderName) :
      allOrders
    
    const linkTo = selectedGenusName ? '/birds/' :
    selectedFamilyName ? '/taxonomicrank/' + selectedOrderName + '/' + selectedFamilyName + '/' :
    selectedOrderName ? '/taxonomicrank/' + selectedOrderName + '/' : '/taxonomicrank/'

    return children ? children.map((child: BirdOrRank, i: number) => createLink(linkTo + child.nameScientific,
       child.nameFin ? child.nameFin + ' / ' + child.nameScientific : child.nameScientific, i)) : []
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

function App(): JSX.Element {
  const cookies = new Cookies()

  const [birds, setBirds] = useState<IBird[]>([])
  const [taxonomicRanks, setRanks] = useState<ITaxonomicRank[]>([])
  const [username, setUsername] = useState<string>('')

  useEffect(() => {getBirds()}, [])
  useEffect(() => {getTaxonomicRanks()}, [])
  useEffect(() => {fetchUsername()})

  const getBirds = (): void => {
    const url = BASE_URL + '/api/bird'
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

  const getTaxonomicRanks = (): void => {
    const url: string = BASE_URL + '/api/taxonomicrank'
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

  const fetchUsername = (): void => {
    const token: string = cookies.get(COOKIE_NAME)
    const url = BASE_URL + '/api/user/authenticated'
    if (token) {
      fetch(url, {
        headers: {'Authorization': `Bearer ${token}`}
      })
      .then((res) => {
        if (res.ok) {
            return res.json() 
        } else {
            throw new Error('Response not ok.')
        }
      })
      .then(user => setUsername(user.name))
      .catch(() => setUsername(''))
    }
  }

  return (
    <div className="App">
      <Container maxWidth="sm">
          <h1>Suomessa havaitut lintulajit</h1>
          <Router>
            <Route exact path="/" render={() => <Home authenticated={username} setUsername={setUsername} 
              cookie_name={COOKIE_NAME}/>} />
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
            <Route exact path="/login" render={() => <Login authenticated={username} fetchUsername={fetchUsername} 
              cookie_name={COOKIE_NAME} base_url={BASE_URL} />} />
            <Route exact path="/addimage" render={() => <AddImage cookie_name={COOKIE_NAME} base_url={BASE_URL} birds={birds} />} />
            <Route exact path="/myimages" render={() => <MyImages cookie_name={COOKIE_NAME} base_url={BASE_URL} username={username} birds={birds} />} />
          </Router>
      </Container>
    </div>
  )
}


export default App;
