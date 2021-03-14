import {useHistory, Link} from 'react-router-dom'
import Cookies from 'universal-cookie'
import {Box, Button, CardMedia } from '@material-ui/core';

interface IHomeProps {
  cookie_name: string,
  authenticated: string,
  setUsername: React.Dispatch<React.SetStateAction<string>>
}

export function Home(props: IHomeProps): JSX.Element {
    const history = useHistory()
  
    const onLogout = (): void => {
      const cookies = new Cookies()
      cookies.remove(props.cookie_name)
      props.setUsername('')
    }
  
    const onLogin = (): void => {
      history.push('/login')
    }
  
    return (
      <Box>
          <Link to="/birds">
            <Button>Linnut aakkosjärjestyksessä</Button>
          </Link>
          <Link to="/taxonomicrank">
            <Button>Lintujen tieteellinen luokittelu</Button>
          </Link>
          {props.authenticated && <Link to="/addimage">
            <Button>Lisää uusi kuva</Button>
          </Link>}
          {props.authenticated && <Link to="/myimages">
            <Button>Omat kuvat</Button>
          </Link>}
          <CardMedia className="FrontPagePicture"
            image="/lapasorsa-bw.jpeg"
            title="Lapasorsa"
          />
          {props.authenticated ? <Button onClick={onLogout}>Kirjaudu ulos</Button> : <Button onClick={onLogin}>Kirjaudu</Button>}
      </Box>
    )
  }