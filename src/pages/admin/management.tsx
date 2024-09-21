import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";

import axios from "axios";
import { Field, Form, Formik, FormikHelpers } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Admin";
import { Main } from "../../components/Main";
import withProtectedRoute from "../../components/withProtectedRoute";
import { API_ENDPOINT } from "../../constants";
import { EQueueTitles, IQueue, ITrelloBoardList } from "../../model";

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
      alert("Failed to get queues");
    }

    setQueues(response.data.data);
  };

  const navigateToAdminPage = () => {
    router.push("/admin");
  };

  const onSubmit = (
    values: { queueId: string },
    actions: FormikHelpers<{ queueId: string }>
  ) => {
    if (!values.queueId) return;
    router.push(`/admin/serve?queueId=${values.queueId}`);
  };

  return (
    <>
      <Head>
        <title>Queue Management - Hyqueue</title>
      </Head>
      <Container>
        <Navbar />
        <Main justifyContent="start" width="100%">
          <Center flexDirection="column" alignItems="center" minHeight="75vh">
            <Text textStyle="heading2" pb="10">
              Hyqueue - Admin
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
                                <option value={queue.id} key={queue.id}>
                                  {queue.name}
                                </option>
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
