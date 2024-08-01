import {
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type Props = {
  id: string,
  label: string,
  helperText?: ReactNode,
  value: string,
  onChange: any, // TODO: change any
  required?: boolean,
  type?: string,
  style?: object, // TODO: change object
}

const Index = ({
  id,
  label,
  helperText,
  value,
  onChange,
  required = false,
  type = "text",
  style
}: Props) => {
  return (
    <Flex
      pt="0.5rem"
      pb="0.5rem"
      {...style}
      >
      <FormControl id={id}>
        <FormLabel>{label}</FormLabel>
        <Input type={type} required={required} value={value} onChange={onChange} />
        {
          helperText
          ?
          <FormHelperText>{helperText}</FormHelperText>
          :
          null
        }
      </FormControl>
    </Flex>
  )
}

export default Index