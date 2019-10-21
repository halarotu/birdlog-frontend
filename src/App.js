import React, {useState, useEffect} from 'react';
import './App.css';

function Birds({birds}) {
  birds = birds.sort(function(a, b) {
    if  (a.nameFin > b.nameFin) {
      return 1
    }
    return -1
  })

  return (
    <div>
      <h1>Suomessa havaitut lintulajit</h1>
      {birds ? birds.map((bird, i) => 
        <Bird bird={bird} key={i} />) :
        <div>Ei lintuja!</div>}
    </div>
  )
}

function Bird({bird}) {
  return (
    <div>{bird.nameFin}</div>
  )
}

function App() {
  const [birds, setBirds] = useState([])

  useEffect(() => {getBirds()}, [])

  const getBirds = () => {
      fetch(`http://localhost:8080/bird`)
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
      <Birds birds={birds} />
    </div>
  )
}


export default App;
