import {Button, Card, CardMedia} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {IBird} from '../App'

export function Bird({bird}: {bird: IBird | undefined}): JSX.Element {
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