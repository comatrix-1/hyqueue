import { Box, Flex, Text } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

export const Footer = (props: any) => {
  const { t, lang } = useTranslation('common')

  return <Flex
    bgColor="primary.600"
    w="100%"
    as="footer"
    justifyContent="center"
    {...props}
  >
    <Box
      color="white"
      w="360px"
      px={4}
      py={8}>
      <Text
        color="gray.500"
        textStyle="body2"
        mb={4}
      >
        &copy; Copyright 2024. {t('built-by')} Comatrix
      </Text>
    </Box>

  </Flex>
}
