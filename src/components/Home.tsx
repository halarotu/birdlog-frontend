import {Link} from 'react-router-dom'
import {Box, Button, CardMedia } from '@material-ui/core';

interface IHomeProps {
  authenticated: string
}

export function Home(props: IHomeProps): JSX.Element {
  return (
    <Box>   
      <Link to="/birds">
        <Button>Linnut aakkosjärjestyksessä</Button>
      </Link>
      <Link to="/taxonomicrank">
        <Button>Lintujen tieteellinen luokittelu</Button>
      </Link>
      <Link to="/latestimages">
        <Button>Viimeisimmät kuvat</Button>
      </Link>
      {props.authenticated && <Link to="/myimages">
        <Button>Omat kuvat</Button>
      </Link>}
      <CardMedia className="FrontPagePicture"
        image="/lapasorsa-bw.jpeg"
        title="Lapasorsa"
      />
    </Box>
  )
}