import {Box, Button, Card} from '@material-ui/core'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {IBird} from '../App'
import { IImageMetadata, IImageMetadataList, ImageWithOwnerName } from './Image'

interface IBirdProps {
  bird: IBird | undefined,
  base_url: string
}

export function Bird(props: IBirdProps): JSX.Element {

  const [imageMetadatas, setImageMetadatas] = useState<IImageMetadata[]>([])
  const [page, setPage] = useState<number>(0)
  const [totalPageCount, setPageCount] = useState<number>()

  useEffect(() => {
    const fetchImageMetadatas = async (bird: string): Promise<void> => {
      const url = props.base_url + `/api/image/bird/${bird}?page=${page}`
      const res: Response = await fetch(url)
      if (res.ok) {
          const metadatas = (await res.json() as unknown) as IImageMetadataList
          setImageMetadatas(metadatas.metadataDTOList)
          setPageCount(metadatas.totalPageCount)
      } else {
          console.error('Response not ok.')
      }
    }

    props.bird && fetchImageMetadatas(props.bird.nameScientific)
  }, [props.bird, props.base_url, page])


    return (
      props.bird ?
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
            <h3>{props.bird.nameFin}</h3>
            <p>Tieteellinen nimi: {props.bird.nameScientific}</p>
            <p>Lahko: <Link to={"/taxonomicrank/" + props.bird.order}> {props.bird.order} </Link></p>
            <p>Heimo: <Link to={"/taxonomicrank/" + props.bird.order + "/" + props.bird.family}> {props.bird.family} </Link></p>
            <p>Suku: <Link to={"/taxonomicrank/" + props.bird.order + "/" + props.bird.family + "/" + props.bird.genus}> {props.bird.genus} </Link></p>
          </div>
        </Card>
        <Box my={2}>
          {imageMetadatas && imageMetadatas.map((metadata, i) => 
            <ImageWithOwnerName key={i} base_url={props.base_url} bird={props.bird} metadata={metadata} index={i} lastImage={i === imageMetadatas.length-1} />)}
        </Box>
        <div>
          {page > 0 && <Button onClick={() => setPage(page-1)}>Takaisin</Button>}
          {totalPageCount && totalPageCount-1 > page && <Button onClick={() => setPage(page+1)}>Aiemmat</Button> }
        </div>
      </div>
      : <div/>
    )
  }