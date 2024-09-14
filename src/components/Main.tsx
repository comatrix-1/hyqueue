import { Stack } from '@chakra-ui/react'

export const Main = (props: any) => (
  <Stack
    w="400px"
    maxW="100%"
    px={4}
    minHeight="calc(100vh - 84px)"
    justifyContent="center"
    {...props}
  />
)
