import {Box, Button} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import Cookies from 'universal-cookie'
import {IImageMetadata, Image} from './Image'
import {IBird} from '../App'

interface IMyImagesProps {
    base_url: string,
    cookie_name: string,
    username: string,
    birds: IBird[]
}

export function MyImages(props: IMyImagesProps): JSX.Element {
    const username = props.username
    const cookies = new Cookies()
    const [metadatas, setMetadatas] = useState<IImageMetadata[]>([])

    useEffect(() => { 
        const fetchUserImageIds = (name: string): void => {
            if (name) {
                const url = props.base_url + '/api/image/user/' + name
                fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Response not ok.')
                    }
                })
                .then(async (ids) => {
                    const metas: IImageMetadata[] = []
                    for (let i=0; i<ids.length; i++) {
                        const meta = await fetchImageMetadata(ids[i])
                        if (meta) {
                            meta.id = ids[i]
                            metas.push(meta)
                        }
                    }
                    setMetadatas(metas)
                })
                .catch(error => console.error(error))
            }
        }

        const fetchImageMetadata = async (id: number): Promise<IImageMetadata | null> => {
            let metadata: IImageMetadata | null = null
            const url = props.base_url + `/api/image/${id.toString()}/metadata`
    
            const res: Response = await fetch(url)
            if (res.ok) {
                metadata = (res.json() as unknown) as IImageMetadata
            } else {
                console.error('Response not ok.')
            }
            return Promise.resolve(metadata)
        }
        
        fetchUserImageIds(props.username)}, 
        [props.username, props.base_url]
    )

    const removeImage = (id: number): void => {
        const url = props.base_url + '/api/image/' + id
        fetch(url, {
            method: 'delete',
            headers: {'Authorization': `Bearer ${cookies.get(props.cookie_name)}`}
        })
        .then((res) => {
            if (res.ok) {
                return true
            } else {
                throw new Error('Response not ok.')
            }
        })
        .then(() => setMetadatas(metadatas.filter(meta => meta.id !== id)))
        .catch(error => console.error(error))
    }

    return (
      <div>
        <div>
            <Link to="/" className="Link">
                <Button fullWidth={true} variant='outlined'>Palaa etusivulle</Button>
            </Link>
        </div>
        <Box margin={5} >
            {username ? `Omat kuvat` : 'Ei käyttäjää!'}
        </Box>
        <div>
            {metadatas.map((meta) => <Image key={meta.id} metadata={meta} base_url={props.base_url} removeImage={removeImage} 
                bird={props.birds.find(b => b.nameScientific === meta.bird)}/>)}
        </div>
      </div>
    )
  }