import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";

interface Props extends TextareaProps {
  id: string;
  label: string;
  helperText?: string;
  value: any;
  style?: any; // TODO: change any
  onChange: (value: any) => void; // TODO: change any
}

const Index = ({ id, label, helperText, value, onChange, style }: Props) => {
  return (
    <Flex pt="0.5rem" pb="0.5rem" {...style}>
      <FormControl id={id}>
        <FormLabel>{label}</FormLabel>
        <Textarea value={value} onChange={onChange} />
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    </Flex>
  );
};

export default Index;
