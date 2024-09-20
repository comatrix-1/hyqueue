import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  Text,
} from "@chakra-ui/react";

import Head from "next/head";
import { InputText, Navbar } from "../../components/Admin";
import { Main } from "../../components/Main";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants";
import * as _ from "lodash";
import { ITrelloBoardList, EQueueTitles, IQueue } from "../../model";
import ServerControls from "../../components/Admin/ServerControls";
import { useRouter } from "next/router";
import { Field, Form, Formik, FormikHelpers } from "formik";
import withProtectedRoute from "../../components/withProtectedRoute";

const Management = () => {
  const [queues, setQueues] = useState([]);
  const [queueId, setQueueId] = useState();
  const router = useRouter();

  useEffect(() => {
    getQueues();
  }, []);

  const getQueues = async () => {
    const response = await axios.get(`${API_ENDPOINT}/queues`);

    if (!response?.data) {
      console.log("getQueues() :: Failed to get queues");
    }

    setQueues(response.data.data);
  };

  const onSelectQueue = (queueId: string) => {
    console.log("onSelectQueue()", queueId);
    router.push(`/admin/serve?queueId=${queueId}`);
  };

  const navigateToAdminPage = () => {
    router.push("/admin");
  };

  const onSubmit = (
    values: { queueId: string },
    actions: FormikHelpers<{ queueId: string }>
  ) => {
    console.log("values", values);
    console.log("actions", actions);
    if (!values.queueId) return;
    router.push(`/admin/serve?queueId=${values.queueId}`);
  };

  return (
    <>
      <Head>
        <title>Queue Management - QueueUp Sg</title>
      </Head>
      <Container>
        <Navbar />
        <Main justifyContent="start" width="100%">
          <Center flexDirection="column" alignItems="center" minHeight="75vh">
            <Text textStyle="heading2" pb="10">
              QueueUp SG - Admin
            </Text>
            <Box layerStyle="card">
              <Formik
                initialValues={{ queueId: "" }}
                onSubmit={onSubmit}
                validateOnBlur
              >
                {(props) => (
                  <Form>
                    <Field name="queueId">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel>Server name</FormLabel>
                          <Select {...field}>
                            <option value=""></option>
                            {queues
                              .filter((queue: IQueue) =>
                                queue.name.includes(EQueueTitles.ALERTED)
                              )
                              .map((queue: ITrelloBoardList) => (
                                <option value={queue.id} key={queue.id}>{queue.name}</option>
                              ))}
                          </Select>
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Button
                      display="flex"
                      isLoading={false}
                      width="100%"
                      colorScheme="primary"
                      borderRadius="3px"
                      color="white"
                      variant="solid"
                      size="lg"
                      marginTop="1.5rem"
                      type="submit"
                    >
                      Manage
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
            <Button
              bgColor="primary.500"
              borderRadius="3px"
              width="100%"
              color="white"
              size="lg"
              variant="solid"
              marginTop="2rem"
              onClick={navigateToAdminPage}
            >
              Go back to admin page
            </Button>
          </Center>
        </Main>
      </Container>
    </>
  );
};

export default withProtectedRoute(Management);