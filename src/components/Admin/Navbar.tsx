import { useEffect, useState } from 'react'
import { Box, Text, Flex, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import LogoQueue from '../../assets/svg/logo-queue.svg'
import { authentication } from '../../utils'

const Navbar = (props: any) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!authentication.getKey() && !!authentication.getToken())
  }, [])

  /**
   * Confirm with the user that she/he wants to logout
   */
   const confirmLogout = () => {
    if(confirm('Please confirm that you would like to logout?')) {
      router.push('/admin/logout')
    }
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      maxW="100%"
      pt={4}
      pb={8}
      px={4}
      bg="base.100"
      {...props}>
      <Flex>
        <a href="/admin" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <LogoQueue
            height="40px"
            width="40px"
          />
          <Text textStyle="heading1" color="primary.500">&nbsp;&nbsp;Admin</Text>
        </a>
      </Flex>
      <Box
        display={"block"}
        flexBasis={"auto"}
      >
        {
          isLoggedIn
          ?
          <Button
            display="flex"
            colorScheme="red"
            borderRadius="3px"
            color="white"
            variant="solid"
            size="sm"
            onClick={confirmLogout}
          >
            Logout
          </Button>
          :
          null
        }
      </Box>
    </Flex>
  )
}

export default Navbar
