import {Input} from '@material-ui/core';

  interface IFormInputElementProps {
    elementLabel: string,
    type: 'text' | 'password',
    name: string,
    value: string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  }

  export const FormInputElement = (props: IFormInputElementProps): JSX.Element => {
    return (
      <div className="FormElement">
          <p style={{float: 'left', marginRight: '40%'}}>{props.elementLabel}</p>
          <Input style={{float: 'left', width: '100%'}} type={props.type} name={props.name} value={props.value} onChange={props.onChange} />
      </div>
    )
  }