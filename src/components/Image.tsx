import {Box, Button, CardMedia } from '@material-ui/core';
import { IBird } from '../App';
import {Link} from 'react-router-dom'

interface IImageProps {
    base_url: string,
    metadata: IImageMetadata
    bird: IBird | undefined
    removeImage: (id: number) => void
}

export interface IImageMetadata {
    id : number,
    owner: string,
    imageTaken: number,
    bird: string,
    description: string,
    coordinateLat: number,
    coordinateLong: number
}

export const Image = (imageProps: IImageProps): JSX.Element => {
    const imageTaken = new Date(imageProps.metadata.imageTaken)

    return (
        <div style={{marginBottom: '20px'}}>
        <Box border={1}>
            {imageProps.metadata.id && <CardMedia component='img' src={imageProps.base_url + '/api/image/' + imageProps.metadata.id} />}
            <div>
                <p>{imageProps.metadata.description}</p>
                <p style={{fontWeight: 300}}>
                    {imageProps.bird?.nameFin} - 
                    <Link style={{color: 'black',fontFamily:'cursive', fontStyle:'italic'}} to={`/birds/${imageProps.metadata.bird}`} >
                        {' ' + imageProps.metadata.bird}</Link></p>
                <p style={{fontWeight: 300}}>Kuvattu: {imageTaken.toLocaleDateString()}</p>
                <Button color='secondary' onClick={() => imageProps.removeImage(imageProps.metadata.id)} >(-Poista-)</Button>
            </div>
        </Box>
        </div>
    )
}

export const ImageWithoutInfo = (imageProps: IImageProps): JSX.Element => {
    return (
            imageProps.metadata.id ? <CardMedia component='img' src={imageProps.base_url + '/api/image/' + imageProps.metadata.id} /> : <div></div>
    )
}