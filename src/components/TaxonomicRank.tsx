import {Box, Button, Grid } from '@material-ui/core';
import {Link} from 'react-router-dom'
import {ITaxonomicRank, IBird} from '../App'

interface ITaxonomicRankProps {
    taxonomicRanks: ITaxonomicRank[], 
    birds?: IBird[], 
    selectedOrderName?: string, 
    selectedFamilyName?: string, 
    selectedGenusName?: string
}

type BirdOrRank = IBird | ITaxonomicRank;

export function Taxonomicrank(props: ITaxonomicRankProps): JSX.Element {
    const taxonomicRanks = props.taxonomicRanks
    const birds = props.birds
    const selectedOrderName = props.selectedOrderName
    const selectedFamilyName = props.selectedFamilyName
    const selectedGenusName = props.selectedGenusName
  
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