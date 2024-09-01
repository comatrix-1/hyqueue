import {
  Heading,
  Center,
  Box,
  Text,
  Flex,
  Input,
  Button,
} from '@chakra-ui/react'
import Head from 'next/head'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'

import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { NavBar } from '../components/Navbar'
import { UrlInput } from '../components/Support/UrlInput'
import { API_ENDPOINT } from '../constants'
import PeopleOnPhones from '../assets/svg/people-on-phones.svg'
import { EQueueTitles, ITrelloBoardList } from '../model'

const Index = () => {
  const [rootUrl, setRootUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [boardId, setBoardId] = useState<string>()
  const [queueId, setQueueId] = useState<string>()
  const [formError, setFormError] = useState<string>('')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const boardIdValue = searchParams.get('boardId');

    if (boardIdValue) {
      setBoardId(boardIdValue)
      getBoard()
    }
  }, []);

  /**
 * Fetches the board details
 */
  const getBoard = async () => {
    try {
      const result = await axios.get(`${API_ENDPOINT}/queues`)
      const response = result.data as AxiosResponse

      console.log('response', response)

      response.data.forEach((list: ITrelloBoardList) => {
        if (list.name.indexOf(EQueueTitles.PENDING) > -1) {
          setQueueId(list.id)
          console.log(list.id);
        }
      })
    } catch (error) {
      console.error(error)
      setFormError('Invalid Board ID')
    } finally {
      setLoading(false)
    }
  }
  /**
* Generates the urls and displays them
*/
  const generateUrls = async () => {
    setLoading(true)
    setRootUrl(location.origin)
    setFormError('')
    await getBoard() // TODO: add error handling
    setLoading(false)
  }

  /**
   * Render the Request For Board Id view
   */
  const renderRequestForBoardId = () => {
    return <Flex direction="column">
      <Text
        pb="0.5rem"
        textStyle="subtitle1"
      >
        Trello Board ID
      </Text>
      <Input
        layerStyle="formInput"
        value={boardId}
        onChange={(event) => setBoardId(event.target.value)}
        placeholder="e.g. zJkm8jLLe"
        mb={1}
        required
        isInvalid={!!formError}
      />
      {
        formError !== null
          ?
          <Text textStyle="body2" color="error.500">{formError}</Text>
          :
          null
      }
      <Button
        bgColor="primary.500"
        borderRadius="3px"
        width="100%"
        color="white"
        size="lg"
        variant="solid"
        marginTop="2rem"
        isLoading={loading}
        onClick={generateUrls}
      >
        Generate URLs
      </Button>
    </Flex>
  }

  /**
   * Renders the urls
   */
  const renderQueueUrls = () => {
    return <Flex direction="column">
      <Text
        pb="0.5rem"
        textStyle="subtitle1"
      >
        Join The Queue
      </Text>
      <UrlInput
        url={`${rootUrl}/queue`}
      />

      <Text
        pt={4}
        pb="0.5rem"
        textStyle="subtitle1"
      >
        QR Code
      </Text>
      <UrlInput
        url={`${rootUrl}/qr?queue=${queueId}`}
      />

      <Text
        pt={4}
        pb="0.5rem"
        textStyle="subtitle1"
      >
        TV Queue View
      </Text>
      <UrlInput
        url={`${rootUrl}/view?board=${boardId}`}
      />
    </Flex>
  }
  return (
    <>
      <Head>
        <title>QueueUp Support</title>
      </Head>
      <Container>
        <NavBar
          w="100vw"
          px={8}
        />
        <Main
          w="100vw"
          px={8}
        >
          <Box>
            <Center>
              <PeopleOnPhones
                className="featured-image"
              />
            </Center>
            <Heading
              textStyle="heading3"
              textAlign="center"
              my={3}
            >
              QueueSG Support
            </Heading>
            <Text
              textStyle="body1"
              textAlign="center"
              mb={8}
            >
              Generate the URLs related to your Queue Here.
            </Text>

            <Center>
              <Box
                w="800px"
                layerStyle="card"
              >
                {
                  queueId && boardId ?
                    renderQueueUrls() :
                    renderRequestForBoardId()
                }
              </Box>
            </Center>
          </Box>
        </Main>
        <Footer
          w="100vw"
          px={8}
        />
      </Container>
    </>
  )
}

export default Index
