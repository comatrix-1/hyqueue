import axios, { AxiosResponse } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  validateCategory,
  validateContact,
  validateDescription,
  validateName,
  validateNric,
  validatePostalCode,
} from "../utils";

import { Loading } from "../components/Common/Loading";
import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Main } from "../components/Main";
import { NavBar } from "../components/Navbar";
import { NoSuchQueue } from "../components/View/NoSuchQueue";

import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useCookies } from "react-cookie";
import { API_ENDPOINT } from "../constants";
import { EQueueStatus, IEditableSettings, ITicketDescription } from "../model";

const Index = () => {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [cookies] = useCookies(["ticket"]);

  const [queueSystemName, setQueueSystemName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [queueStatus, setQueueStatus] = useState<EQueueStatus>();
  const [editableSettings, setEditableSettings] = useState<IEditableSettings>({
    registrationFields: [],
    categories: [],
    feedbackLink: "",
    privacyPolicyLink: "",
    ticketPrefix: "",
    openingHours: [],
    waitTimePerTicket: null,
    openingHoursTimeZone: "Asia/Singapore",
  });

  useEffect(() => {
    const redirectUrl = getRedirectUrlFromUser();

    if (redirectUrl) {
      router.push(redirectUrl, redirectUrl, { locale: lang });
    }

    getQueueSystem();
  }, []);

  const getRedirectUrlFromUser = () => {
    // First check if user already has cookie for this queue id
    const ticketCookie = cookies["ticket"];
    if (ticketCookie?.id) {
      return `/ticket?id=${ticketCookie.id}`;
    }

    return false;
  };

  const getQueueSystem = async () => {
    try {
      const result = await axios.get(`${API_ENDPOINT}/system`);
      const response = result.data as AxiosResponse;
      const queueSystemSettings = response.data;
      const editableSettingsDesc = queueSystemSettings?.desc;

      if (!editableSettingsDesc) throw new Error("");

      setEditableSettings({
        ...editableSettingsDesc,
        // categories: editableSettingsDesc.categories
        //   ? editableSettingsDesc.categories.split(",")
        //   : [],
        waitTimePerTicket:
          editableSettingsDesc.waitTimePerTicket &&
          !isNaN(Number(editableSettingsDesc.waitTimePerTicket))
            ? editableSettingsDesc.waitTimePerTicket
            : null,
      });

      setQueueStatus(
        editableSettingsDesc.isQueueClosed
          ? EQueueStatus.INACTIVE
          : EQueueStatus.VALID
      );

      setIsLoading(false);

      const cleanedName = queueSystemSettings?.name
        ?.replace("[DISABLED]", "")
        .trim();
      setQueueSystemName(cleanedName ?? "");
    } catch (err) {
      setQueueStatus(EQueueStatus.INVALID);
    }
  };

  const submit = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      setSubmitting(true);

      // Check if NRIC is valid
      if (
        Array.isArray(editableSettings.registrationFields) &&
        editableSettings.registrationFields.includes("nric")
      ) {
        const regex = /^\d{3}[A-Za-z]$/;
        const isValidNRIC = regex.test(values.nric);
        if (!isValidNRIC) {
          setErrors({ nric: "Invalid NRIC" });
          return;
        }
      }

      let desc: ITicketDescription = {
        ticketPrefix: "",
        name: "",
        contact: "",
        category: "",
        queueNo: null,
      };

      // Assign form values to `desc`
      editableSettings.registrationFields.forEach((key) => {
        if (values[key] !== "") {
          (desc as any)[key] = values[key];
        }
      });

      if (
        Array.isArray(editableSettings.categories) &&
        editableSettings.categories.length > 0
      ) {
        desc.category = values.category;
      }

      if (editableSettings.ticketPrefix) {
        desc.ticketPrefix = editableSettings.ticketPrefix;
      }

      const response = await axios.post(`${API_ENDPOINT}/tickets`, { desc });

      const ticketData = response.data?.data;

      const url = `/ticket?id=${ticketData.id}`;
      router.push(url, url, { locale: lang });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        alert("Error creating ticket");
      } else {
        console.error("An unknown error occurred:", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const render = () => {
    if (isLoading) {
      return <Loading />;
    } else if (queueStatus === EQueueStatus.INVALID) {
      return (
        <>
          <Head>
            <title>{t("queue-not-found")} - 404</title>
          </Head>
          <NoSuchQueue />
        </>
      );
    } else if (queueStatus === EQueueStatus.INACTIVE) {
      return (
        <>
          <Head>
            <title>
              {queueSystemName} - {t("queue-currently-inactive")}
            </title>
          </Head>
          <Flex direction="column" alignItems="center">
            <Text
              textStyle="heading2"
              fontSize="2rem"
              color="primary.500"
              textAlign="center"
              lineHeight="3rem"
              pb="10"
            >
              {t("queue-currently-inactive")}
            </Text>
            <Text mt="6px" textStyle="heading1" textAlign="center" pt="5">
              {queueSystemName}
            </Text>
          </Flex>
        </>
      );
    } else {
      return (
        <>
          <Head>
            <title>
              {t("join-queue")} - {queueSystemName}
            </title>
          </Head>
          <Flex direction="column" alignItems="center">
            <Text
              textStyle="body2"
              fontSize="1.25rem"
              color="gray.800"
              textAlign="center"
            >
              {t("queue-welcome-message")}
            </Text>
            <Text
              mt="6px"
              textStyle="heading1"
              fontSize="1.5rem"
              textAlign="center"
            >
              {queueSystemName}
            </Text>
          </Flex>
          <Flex direction="column" alignItems="center">
            <Box layerStyle="card">
              <Formik
                initialValues={{
                  name: "",
                  contact: "",
                  postalcode: "",
                  nric: "",
                  category: "",
                  description: "",
                }}
                onSubmit={submit}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <Flex direction="column">
                      {editableSettings.registrationFields.includes("name") && (
                        <>
                          <Text pb="0.5rem" textStyle="subtitle1">
                            {t("your-name")}
                          </Text>
                          <Field
                            as={Input}
                            name="name"
                            validate={validateName}
                            layerStyle="formInput"
                            required
                          />
                          <ErrorMessage name="name">
                            {(msg) => <Text color="error.500">{msg}</Text>}
                          </ErrorMessage>
                        </>
                      )}

                      {editableSettings.registrationFields.includes(
                        "contact"
                      ) && (
                        <>
                          <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                            {t("mobile-number")}
                          </Text>
                          <Field
                            as={Input}
                            type="tel"
                            name="contact"
                            validate={validateContact}
                            maxLength={8}
                            minLength={8}
                            layerStyle="formInput"
                            required
                          />
                          <ErrorMessage name="contact">
                            {(msg) => <Text color="error.500">{msg}</Text>}
                          </ErrorMessage>
                        </>
                      )}

                      {editableSettings.registrationFields.includes(
                        "postalcode"
                      ) && (
                        <>
                          <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                            {t("postal-code")}
                          </Text>
                          <Field
                            as={Input}
                            type="tel"
                            name="postalcode"
                            validate={validatePostalCode}
                            maxLength={6}
                            minLength={6}
                            layerStyle="formInput"
                            placeholder="123456"
                            required
                          />
                          <ErrorMessage name="postalCode">
                            {(msg) => <Text color="error.500">{msg}</Text>}
                          </ErrorMessage>
                        </>
                      )}

                      {editableSettings.registrationFields.includes("nric") && (
                        <>
                          <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                            {t("NRIC-field-description")}
                          </Text>
                          <Field
                            as={Input}
                            name="nric"
                            validate={validateNric}
                            maxLength={4}
                            minLength={4}
                            placeholder="xxxA"
                            layerStyle="formInput"
                            required
                          />
                          <ErrorMessage name="nric">
                            {(msg) => <Text color="error.500">{msg}</Text>}
                          </ErrorMessage>
                        </>
                      )}

                      {Array.isArray(editableSettings.categories) &&
                        editableSettings.categories.length > 0 && (
                          <>
                            <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                              {t("category")}
                            </Text>
                            <Field
                              as={Select}
                              name="category"
                              validate={validateCategory}
                              layerStyle="formSelect"
                              placeholder={t("select-category")}
                              required
                            >
                              {editableSettings.categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="category">
                              {(msg) => <Text color="error.500">{msg}</Text>}
                            </ErrorMessage>
                          </>
                        )}

                      {editableSettings.registrationFields.includes(
                        "description"
                      ) && (
                        <>
                          <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                            {t("description")}
                          </Text>
                          <Field
                            as={Textarea}
                            name="description"
                            validate={validateDescription}
                            layerStyle="formInput"
                            maxLength={280}
                            placeholder={t("description")}
                            size="sm"
                            resize="none"
                          />
                          <ErrorMessage name="description">
                            {(msg) => <Text color="error.500">{msg}</Text>}
                          </ErrorMessage>
                        </>
                      )}

                      <Button
                        isLoading={isSubmitting}
                        loadingText={t("joining")}
                        colorScheme="primary"
                        borderRadius="3px"
                        width="100%"
                        color="white"
                        size="lg"
                        variant="solid"
                        marginTop="1.5rem"
                        type="submit"
                        isDisabled={
                          editableSettings.registrationFields.length === 0
                        }
                      >
                        {t("join-queue")}
                      </Button>

                      {editableSettings.privacyPolicyLink && (
                        <Text pt="1rem" textStyle="body3">
                          <Text display="inline-block">
                            {t("by-joining-this-queue-you-agree-to-our")}&nbsp;
                          </Text>
                          <Text display="inline-block" textStyle="link">
                            <a
                              href={editableSettings.privacyPolicyLink}
                              target="_blank"
                            >
                              {t("privacy-policy")}
                            </a>
                          </Text>
                        </Text>
                      )}
                    </Flex>
                  </Form>
                )}
              </Formik>
            </Box>
          </Flex>
        </>
      );
    }
  };

  return (
    <Container>
      <NavBar />
      <Main>{render()}</Main>
      <Footer />
    </Container>
  );
};
export default Index;
