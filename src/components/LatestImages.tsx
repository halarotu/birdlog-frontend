import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core';
import { IBird } from '../App'
import { Image, IImageMetadata, IImageMetadataList } from './Image'

interface ILatestImagesProps {
    base_url: string,
    birds: IBird[]
}

export function LatestImages(props: ILatestImagesProps): JSX.Element {

    const [imageMetadatas, setImageMetadatas] = useState<IImageMetadata[]>([])
    const [page, setPage] = useState<number>(0)
    const [totalPageCount, setPageCount] = useState<number>()

    useEffect(() => {
        const fetchLatestImageMetadatas = async (): Promise<void> => {
            const url = props.base_url + `/api/image/latest?page=${page}`
            const res: Response = await fetch(url)
            if (res.ok) {
                const metadatas = (await res.json() as unknown) as IImageMetadataList
                setImageMetadatas(metadatas.metadataDTOList)
                setPageCount(metadatas.totalPageCount)
            } else {
                console.error('Response not ok.')
            }
        }
        
        fetchLatestImageMetadatas()
    }, [props.base_url, page])

    return (
        <div>
            <Link to="/" className="Link">
                <Button style={{marginBottom: '20px'}} fullWidth={true} variant='outlined'>Palaa etusivulle</Button>
            </Link>
         
            {imageMetadatas && imageMetadatas.map((metadata, i) => 
                <Image key={i} base_url={props.base_url} bird={props.birds.find(b => b.nameScientific === metadata.bird)} 
                    metadata={metadata} index={i} lastImage={i === imageMetadatas.length-1} showOwner={true}/>
            )}
            <div>
                {page > 0 && <Button onClick={() => setPage(page-1)}>Takaisin</Button>}
                {totalPageCount && totalPageCount-1 > page && <Button onClick={() => setPage(page+1)}>Aiemmat</Button> }
            </div>
        </div>
    )
}