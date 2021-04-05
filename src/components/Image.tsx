import {Box, Button, Card, CardMedia } from '@material-ui/core';
import { IBird } from '../App';
import {Link} from 'react-router-dom'

interface IImageProps {
    index?: number,
    lastImage?: boolean,
    base_url: string,
    metadata: IImageMetadata,
    bird: IBird | undefined,
    removeImage?: (id: number) => void,
    showOwner?: boolean
}

export interface IImageMetadata {
    id : number,
    owner: string,
    imageTaken: number,
    imageAdded: number,
    bird: string,
    description: string,
    coordinateLat: number,
    coordinateLong: number
}

export interface IImageMetadataList {
    metadataDTOList: IImageMetadata[],
    totalPageCount: number,
    page: number
}

export const Image = (imageProps: IImageProps): JSX.Element => {
    const imageTaken = new Date(imageProps.metadata.imageTaken)

    return (
        <div style={{marginBottom: '20px'}}>
        <Card style={{borderRadius: '20px'}}>
            {imageProps.metadata.id && <CardMedia component='img' src={imageProps.base_url + '/api/image/' + imageProps.metadata.id} />}
            <div>
                <p>{imageProps.metadata.description}</p>
                <p style={{fontWeight: 300}}>
                    {imageProps.bird?.nameFin} - 
                    <Link style={{color: 'black',fontFamily:'cursive', fontStyle:'italic'}} to={`/birds/${imageProps.metadata.bird}`} >
                        {' ' + imageProps.metadata.bird}</Link></p>
                <p style={{fontWeight: 300}}>Kuvattu: {imageTaken.toLocaleDateString()}</p>
                {imageProps.removeImage && <Button color='secondary' onClick={() => imageProps.removeImage && imageProps.removeImage(imageProps.metadata.id)} >(-Poista-)</Button>}
                {imageProps.showOwner && <p>Kuvaaja: <Link style={{color: 'black'}} to={`/user/${imageProps.metadata.owner}`} >
                        {' ' + imageProps.metadata.owner}</Link></p>}
            </div>
        </Card>
        </div>
    )
}

export const ImageWithOwnerName = (imageProps: IImageProps): JSX.Element => {
    const floatDirection: 'left' | 'right' = imageProps.index && imageProps.index % 2 === 1 ? 'left' : 'right'
    const marginBottom = '20px'
    let width = '45%'
    let marginRight = '0%'
    let marginLeft = '0%' 
    if (imageProps.lastImage && imageProps.index !== undefined && imageProps.index % 2 === 0) {
        marginRight = '27.5%'
        marginLeft = '27.5%'
        if (imageProps.index === 0) {
            width = '60%'
            marginRight = '20%'
            marginLeft = '20%'
        }
    }

    return (
        <Box border={1} style={{width: width, float: floatDirection, marginRight: marginRight, marginLeft: marginLeft, marginBottom: marginBottom}}>
            {imageProps.metadata.id && <CardMedia component='img' src={imageProps.base_url + '/api/image/' + imageProps.metadata.id} />}
            <div>
                <p>Kuvaaja: <Link style={{color: 'black'}} to={`/user/${imageProps.metadata.owner}`} >
                        {' ' + imageProps.metadata.owner}</Link></p>
            </div>
        </Box>
    )
}