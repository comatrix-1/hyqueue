import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import queryString from "query-string";
import axios from "axios";
import url from "is-url";
import { validate } from "nric";

import { isQueueClosed } from "../utils";

import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/Navbar";
import { NoSuchQueue } from "../components/View/NoSuchQueue";
import { Loading } from "../components/Common/Loading";

import ManWithHourglass from "../../src/assets/svg/man-with-hourglass.svg";
import AlarmClock from "../../src/assets/svg/alarm-clock.svg";

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import useTranslation from "next-translate/useTranslation";
import { API_ENDPOINT } from "../constants";
import {
  IEditableSettings,
  ITicketDescription,
  ITrelloBoardSettings,
} from "../model";

const Index = () => {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [cookies] = useCookies(["ticket"]);

  const [boardId, setBoardId] = useState<string>("");
  const [boardName, setBoardName] = useState("");
  const [isQueueValid, setIsQueueValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueueInactive, setIsQueueInactive] = useState(true);
  const [feedbackLink, setFeedbackLink] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidNRIC, setInvalidNRIC] = useState(false);
  const [editableSettings, setEditableSettings] = useState<IEditableSettings>({
    registrationFields: [],
    categories: [],
    feedbackLink: "",
    privacyPolicyLink: "",
    ticketPrefix: "",
    openingHours: [],
    waitTimePerTicket: null,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentQueueId = searchParams.get("id");
    const redirectUrl = isUserPartOfQueue(currentQueueId ?? "");

    // First check if user already has cookie for this queue id
    if (redirectUrl) {
      router.push(redirectUrl, redirectUrl, { locale: lang });
    }
    // Based on queue id, check if queue exists
    else if (currentQueueId) {
      getQueue(currentQueueId);
    }
    //  Queue Id does not exist
    else {
      setIsQueueValid(false);
    }
  }, []);

  /**
   * Checks if the user is part of the queue
   *
   * @param {string} currentQueueId the id of the queue that the user is currently on
   * @returns {string|boolean} url to redirect the user to or FALSE if the user is not part of the current queue
   */
  const isUserPartOfQueue = (currentQueueId: string) => {
    // First check if user already has cookie for this queue id
    const ticketCookie = cookies["ticket"];
    if (
      ticketCookie &&
      ticketCookie.queue &&
      ticketCookie.queue === currentQueueId &&
      ticketCookie.ticket &&
      ticketCookie.board
    ) {
      return `/ticket?queue=${ticketCookie.queue}&ticket=${ticketCookie.ticket}&board=${ticketCookie.board}`;
    }

    return false;
  };

  /**
   * Gets the queue Id
   *
   * @param {string} queueId
   */
  const getQueue = async (queueId: string) => {
    console.log("getQueue()");
    try {
      // Get the board queue belongs to this
      // 1. Verifies that queue actually exists
      // 2. Gets info stored as JSON in board description

      const response = await axios.get(`${API_ENDPOINT}/view?type=board`);
      const boardSettings: ITrelloBoardSettings = response.data;

      setBoardId(boardSettings?.id ?? "");

      const cleanedDesc = boardSettings?.desc
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
        .replace(/\\\"/g, '"');
      console.log("parsing JSON", cleanedDesc);
      const boardInfo: IEditableSettings = JSON.parse(cleanedDesc);
      console.log("parsed JSON", boardInfo);

      setEditableSettings({
        feedbackLink: boardInfo.feedbackLink,
        privacyPolicyLink: boardInfo.privacyPolicyLink,
        registrationFields: boardInfo.registrationFields,
        ticketPrefix: boardInfo.ticketPrefix,
        categories: boardInfo.categories,
        waitTimePerTicket:
          boardInfo.waitTimePerTicket &&
          !isNaN(Number(boardInfo.waitTimePerTicket))
            ? boardInfo.waitTimePerTicket
            : null,
        openingHours: boardInfo.openingHours,
      });

      setIsQueueInactive(
        boardSettings?.name.includes("[DISABLED]") ||
          isQueueClosed(boardInfo.openingHours)
      );
      setIsLoading(false);

      const cleanedName = boardSettings?.name.replace("[DISABLED]", "").trim();
      setBoardName(cleanedName);
    } catch (err) {
      console.log(err);
      setIsQueueValid(false);
    }
  };

  const submit = async (e: any) => {
    // TODO: change any
    try {
      e.preventDefault();

      // Check if NRIC is valid
      if (
        Array.isArray(editableSettings.registrationFields) &&
        editableSettings.registrationFields.includes("nric")
      ) {
        if (validate(e.target["nric"].value) === false) {
          setInvalidNRIC(true);
          return;
        } else {
          setInvalidNRIC(false);
        }
      }

      //  Don't submit if it is submitting
      if (isSubmitting) return;
      setIsSubmitting(true);

      let desc: ITicketDescription = {
        ticketPrefix: "",
        name: "",
        contact: "",
        category: "",
      };

      editableSettings.registrationFields.forEach((key) => {
        if (e.target[key].value !== "") {
          (desc as any)[key] = e.target[key].value;
        }
      });
      if (
        Array.isArray(editableSettings.categories) &&
        editableSettings.categories.length > 0
      ) {
        desc.category = e.target.category.value;
      }
      if (editableSettings.ticketPrefix) {
        desc.ticketPrefix = editableSettings.ticketPrefix;
      }

      // call netlify function to create a ticket
      // for that queue, return the ticket id and redirect to ticket page
      const query = queryString.parse(location.search);
      const postJoinQueue = await axios.post(
        `${API_ENDPOINT}/ticket?queue=${query.id}`,
        { desc }
      );
      const { ticketId } = postJoinQueue.data;
      const feedback = feedbackLink
        ? `&feedback=${encodeURIComponent(feedbackLink)}`
        : "";
      const waitTime = editableSettings.waitTimePerTicket
        ? `&waitTimePerTicket=${encodeURIComponent(
            editableSettings.waitTimePerTicket
          )}`
        : 1; // TODO: set proper wait time per ticket default
      const url = `/ticket?queue=${query.id}&board=${boardId}&ticket=${ticketId}${feedback}${waitTime}`;
      router.push(url, url, { locale: lang });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.status);
      } else {
        console.error("An unknown error occurred:", err);
      }
    }
  };

  const render = () => {
    if (isLoading) {
      return (
        <>
          <Loading />
        </>
      );
    } else if (!isQueueValid) {
      return (
        <>
          <Head>
            <title>Queue Not Found - 404</title>
          </Head>
          <NoSuchQueue />
        </>
      );
    } else if (isQueueInactive) {
      return (
        <>
          <Head>
            <title>{boardName} - Currently Closed</title>
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
            <AlarmClock />
            <Text mt="6px" textStyle="heading1" textAlign="center" pt="5">
              {boardName}
            </Text>
          </Flex>
        </>
      );
    } else {
      return (
        <>
          <Head>
            <title>{boardName}</title>
          </Head>
          <Flex direction="column" alignItems="center">
            <Text
              textStyle="body2"
              fontSize="1.25rem"
              color="primary.500"
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
              {boardName}
            </Text>
          </Flex>
          <Flex direction="column" alignItems="center">
            <Flex direction="column" alignItems="center">
              <ManWithHourglass className="featured-image" />
            </Flex>
            <Box layerStyle="card">
              <form onSubmit={submit}>
                <Flex direction="column">
                  {editableSettings.registrationFields.includes("name") && (
                    <>
                      <Text pb="0.5rem" textStyle="subtitle1">
                        {t("your-name")}
                      </Text>
                      <Input
                        layerStyle="formInput"
                        name="name"
                        pattern="[^0-9]*"
                        title="Name should not contain numbers"
                        required
                      />
                    </>
                  )}
                  {editableSettings.registrationFields.includes("contact") && (
                    <>
                      <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                        {t("mobile-number")}
                      </Text>
                      <Input
                        layerStyle="formInput"
                        type="tel"
                        name="contact"
                        pattern="^(8|9)(\d{7})$"
                        maxLength={8}
                        minLength={8}
                        required
                        title="Mobile number should be an 8 digit Singapore number i.e. 8xxxxxxx"
                      />
                    </>
                  )}
                  {editableSettings.registrationFields.includes(
                    "postalcode"
                  ) && (
                    <>
                      <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                        {t("postal-code")}
                      </Text>
                      <Input
                        layerStyle="formInput"
                        type="tel"
                        name="postalcode"
                        pattern="^(\d{6})$"
                        maxLength={6}
                        minLength={6}
                        placeholder="123456"
                        required
                        title="Postal code should be an 6 digit number"
                      />
                    </>
                  )}

                  {editableSettings.registrationFields.includes("nric") && (
                    <>
                      <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                        NRIC
                      </Text>
                      <Input
                        layerStyle="formInput"
                        isInvalid={invalidNRIC} // TODO: ensure styling of error.500
                        onChange={() => setInvalidNRIC(false)}
                        name="nric"
                        maxLength={9}
                        minLength={9}
                        placeholder="SxxxxxxxA"
                        required
                      />
                      {invalidNRIC && (
                        <Text color="error.500" mt="-10px">
                          {" "}
                          {t("invalid")} NRIC
                        </Text>
                      )}
                    </>
                  )}

                  {Array.isArray(editableSettings.categories) &&
                    editableSettings.categories.length > 0 && (
                      <>
                        <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                          {t("category")}
                        </Text>
                        <Flex mb="1rem">
                          <Select
                            name="category"
                            layerStyle="formSelect"
                            placeholder={t("select-category")}
                            required
                          >
                            {editableSettings.categories.map((category) => (
                              <option value={category}>{category}</option>
                            ))}
                          </Select>
                        </Flex>
                      </>
                    )}

                  {editableSettings.registrationFields.includes(
                    "description"
                  ) && (
                    <>
                      <Text pt="0.5rem" pb="0.5rem" textStyle="subtitle1">
                        {t("description")}
                      </Text>
                      <Textarea
                        layerStyle="formInput"
                        maxLength={280}
                        name="description"
                        placeholder={t("description")}
                        size="sm"
                        resize={"none"}
                      />
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
                    <>
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
                    </>
                  )}
                </Flex>
              </form>
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
