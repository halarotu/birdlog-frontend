import React, {useState, useEffect} from 'react';
import './App.css';
import {Container} from '@material-ui/core';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Cookies from 'universal-cookie'
import {Home} from './components/Home'
import {Login} from './components/Login'
import {MyImages} from './components/MyImages'
import {AddImage} from './components/AddImage'
import {Birds} from './components/Birds'
import {Bird} from './components/Bird'
import { UserImages } from './components/UserImages';
import {Taxonomicrank} from './components/TaxonomicRank'
import {Header} from './components/Header'
import { LatestImages } from './components/LatestImages';

export interface IBird {
  family: string,
  order: string,
  genus: string,
  nameFin: string,
  nameScientific: string
}

export interface ITaxonomicRank {
  nameScientific: string,
  nameFin: string,
  level: string,
  parent: string
}

const BASE_URL = 'http://localhost:8080'
const COOKIE_NAME = 'BL_AUTH'

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
    .catch(error => console.error(error))
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
    .catch(error => console.error(error))
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
      <Router>
        <Header cookie_name={COOKIE_NAME} username={username} setUsername={setUsername} />
        <Container maxWidth="sm">
            <Route exact path="/" render={() => <Home authenticated={username} />} />
            <Route exact path="/birds" render={() => <Birds birds={birds} />} />
            <Route exact path="/birds/:id" render={({ match }) => 
              <Bird bird={birds?.find((bird) => 
                bird.nameScientific === match.params.id) } base_url={BASE_URL} />} 
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
            <Route exact path="/user/:username" render={({match}) =><UserImages base_url={BASE_URL} username={match.params.username} birds={birds}/>} />
            <Route exact path="/latestimages" render={() =><LatestImages base_url={BASE_URL} birds={birds}/>} />
        </Container>
      </Router>
    </div>
  )
}


export default App;
