import {useState} from 'react'
import {Redirect, Route} from 'react-router-dom'
import {Input} from '@material-ui/core';
import Cookies from 'universal-cookie'

interface ILoginProps {
    authenticated: string,
    base_url: string,
    cookie_name: string,
    fetchUsername: () => void
}

const COOKIE_EXPIRATION_TIME = 24*60*60*1000

export function Login(props: ILoginProps): JSX.Element {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      fetch(props.base_url + "/auth", {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
      })
      .then(res => res.json())
      .then(body =>  {
        const cookies = new Cookies()
        const exp = new Date();
        exp.setTime(exp.getTime() + COOKIE_EXPIRATION_TIME)
        cookies.set(props.cookie_name, body.token, {path: '/', expires: exp})
        setPassword('')
        props.fetchUsername()
      })
      .catch(() => console.warn('Authentication failed.'))
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
          <Input type="text" name="username" value={username} onChange={handleFormDataChange} />
        </div>      
        <div className="FormElement">
          <p>Salasana:</p>
          <Input type="password" name="password" value={password} onChange={handleFormDataChange} />
        </div>
        <div>
          <Input type="submit" name="submit-button" value="Kirjaudu" />
        </div>
        {props.authenticated ? 
        <Route render={({location}) => <Redirect to={{pathname: '/', state: {from: location}}}/>} /> 
        : <div /> 
        }
      </form>
    )
  }