import {Button} from '@material-ui/core';
import {Link, useHistory} from 'react-router-dom'
import Cookies from 'universal-cookie'

interface IHeaderProps {
    cookie_name: string,
    username: string,
    setUsername:  React.Dispatch<React.SetStateAction<string>>
}

export const Header = (props: IHeaderProps): JSX.Element => {
    const cookies = new Cookies()
    const onLogout = (): void => {
        cookies.remove(props.cookie_name, {path: '/'})
        props.setUsername('')
    }

    const history = useHistory()
    const onLogin = (): void => {
        history.push('/login')
    }

    const onAdd = (): void => {
        history.push('/addimage')
    }

    return (
        <div style={{border: '1px solid', margin: 0, padding: 0, width: '100%', display: 'flex', marginBottom: '30px'}}>
            <div className="HeaderTopic">
                <h2><Link style={{color: 'black', fontFamily: 'fantasy'}} to="/" >Suomen linnut kuvina </Link></h2>
            </div>
            <div className="HeaderButtonDiv">
                {props.username ? <Button className="HeaderButton" onClick={onAdd}>Lisää uusi kuva</Button> : <div/>}
                {props.username ? <Button className="HeaderButton" onClick={onLogout}>Kirjaudu ulos</Button> : 
                <Button className="HeaderButton" onClick={onLogin}>Kirjaudu</Button>}
            </div>
        </div>
    )
}