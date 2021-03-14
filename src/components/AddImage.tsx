import {useState} from 'react';
import {Link, Redirect, Route} from 'react-router-dom'
import Cookies from 'universal-cookie'
import {Button, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import { IBird } from '../App';

interface IAddImageProps {
  base_url: string,
  cookie_name: string,
  birds: IBird[]
}

export function AddImage(props: IAddImageProps): JSX.Element {
    const cookies = new Cookies()
  
    const [image, setImage] = useState<File | null>()
    const [imageTakenDate, setDate] = useState<string>()
    const [description, setDescription] = useState<string>('')
    const [species, setSpecies] = useState<string>('default')
    const [sending, setSending] = useState<boolean>(false)
    const [imageSent, setImageSent] = useState<boolean>(false)

    const birds = props.birds.sort((a, b) => {if (a.nameFin > b.nameFin) {return 1} else {return -1}})

    const onSend = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      setSending(true)

      const date: Date = new Date(imageTakenDate || '')
      const formData: FormData = new FormData()
      formData.append('file', image ? image : '', image ? image.name : '')
      formData.append('imageTaken', date.valueOf().toString())
      formData.append('description', description)
      formData.append('bird', typeof(species) === 'string' ? species : '')
      formData.append('coordinateLat', '0')
      formData.append('coordinateLong', '0')
  
      fetch(props.base_url + `/api/image`, {
        method: 'post',
        headers: {'Authorization': `Bearer ${cookies.get(props.cookie_name)}`},
        body: formData
      })
      .then(res => {
        setSending(false)
        if (res.status >= 200 && res.status < 300) {
          setImageSent(true)
        }
      })
      .catch(() => setSending(false))
    }
  
    return (
      <div>
      <Link to="/" className="Link">
        <Button fullWidth={true} variant='outlined'>Palaa etusivulle</Button>
      </Link>
      <form onSubmit={onSend}>
        <h2>Lisää uusi kuva</h2>
        <div className="FormElement">
          <Button variant="contained" component="label">
            Lataa tiedosto
            <input type="file" name="imageFile" onChange={(e) => {e.target.files && setImage(e.target.files[0]);
              e.target.value=''}} hidden />
          </Button>
          <p>{image ? image.name : ''}</p>
          {image && <Button name='remove-button' onClick={() => {setImage(undefined)}} >Poista</Button>}
        </div>
        <InputLabel>Kuva otettu:</InputLabel>
        <div className="FormElement">
          <Input type="date" name="image-taken-date" onChange={(e) => {setDate(e.target.value)}}/>
        </div>
        <InputLabel>Kuvaus:</InputLabel>
        <div className="FormElement">
          <Input type="text" multiline={true} rows={3} fullWidth={true} name="image-description" onChange={(e) => {setDescription(e.target.value)}}/>
        </div>
        <InputLabel>Laji:</InputLabel>
        <div className="FormElement">
          <Select value={species} onChange={(e) => {typeof(e.target.value) === 'string' && setSpecies(e.target.value)}} fullWidth={true}>
            <MenuItem key={'default'} value='default'>Valitse laji</MenuItem>
            {birds.map((bird) => <MenuItem key={bird.nameScientific} value={bird.nameScientific}>{bird.nameFin}</MenuItem>) }
          </Select>
        </div>
        <div className="FormElement"> 
          <Input type="submit" disabled={!(image && species !== 'default' && imageTakenDate) || sending} name="submit-button" value="LÄHETÄ!"/>
        </div>
      </form>
      {imageSent ? 
        <Route render={({location}) => <Redirect to={{pathname: '/myimages', state: {from: location}}}/>} /> 
        : <div /> 
        }
      </div>
    )
  }