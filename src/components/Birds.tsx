import {Box, Button} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {IBird} from '../App'

export function Birds({birds}: {birds: IBird[] | undefined}): JSX.Element {
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