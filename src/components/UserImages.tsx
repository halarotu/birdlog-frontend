import {Box, Button} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import {IImageMetadata, IImageMetadataList, Image} from './Image'
import {IBird} from '../App'

interface IUserImagesProps {
    base_url: string,
    username: string,
    birds: IBird[]
}

export function UserImages(props: IUserImagesProps): JSX.Element {
    const username = props.username

    const [metadatas, setMetadatas] = useState<IImageMetadata[]>([])
    const [page, setPage] = useState<number>(0)
    const [totalPageCount, setPageCount] = useState<number>()

    useEffect(() => { 
        const fetchUserImageMetadatas = async (user: string): Promise<void> => {
            const url = props.base_url + `/api/image/user/${user}?page=${page}`
            const res: Response = await fetch(url)
            if (res.ok) {
                const metadatas = (await res.json() as unknown) as IImageMetadataList
                setMetadatas(metadatas.metadataDTOList)
                setPageCount(metadatas.totalPageCount)
            } else {
                console.error('Response not ok.')
            }
        }

        fetchUserImageMetadatas(props.username)}, 
        [props.username, props.base_url, page]
    )

    return (
      <div>
        <div>
            <Link to="/" className="Link">
                <Button fullWidth={true} variant='outlined'>Palaa etusivulle</Button>
            </Link>
        </div>
        <Box margin={5} >
            <p>Käyttäjänimi: {username}</p>
            <p>Kuvia yhteensä: TODO </p>
        </Box>
        <div>
            {metadatas.map((meta) => <Image key={meta.id} metadata={meta} base_url={props.base_url} 
                bird={props.birds.find(b => b.nameScientific === meta.bird)}/>)}
        </div>
        <div>
            {page > 0 && <Button onClick={() => setPage(page-1)}>Takaisin</Button>}
            {totalPageCount && totalPageCount-1 > page && <Button onClick={() => setPage(page+1)}>Aiemmat</Button> }
        </div>
      </div>
    )
  }