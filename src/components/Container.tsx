import { Flex } from '@chakra-ui/react'

export const Container = (props: any) => {
  return (
    <Flex
      minHeight="100vh"
      direction="column"
      justifyContent="start"
      alignItems="center"
    >
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        direction="column"
        {...props}
      />
    </Flex>

  )
}
