import { Box, Button, Center, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

import PeopleOnPhones from "../../assets/svg/people-on-phones.svg";

interface Props {
  openLeaveModal: () => void;
  numberOfTicketsAhead: number;
  ticketId: string | undefined;
  waitingTime?: number | null; // optional prop for estimated waiting time in seconds (default 3 seconds)
}

export const InQueue = ({
  openLeaveModal,
  numberOfTicketsAhead,
  ticketId,
  waitingTime = 3,
}: Props) => {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Center>
        <PeopleOnPhones className="featured-image" />
      </Center>
      <Box layerStyle="card">
        <Text textStyle="subtitle2">{t("queue-position")}</Text>
        <Text textStyle="display3" mb="2rem">
          {numberOfTicketsAhead} {t("ahead-of-you")}
        </Text>

        <Text textStyle="subtitle2">{t("estimated-waiting-time")}</Text>
        <Text textStyle="display3">
          {(waitingTime ?? 3) * numberOfTicketsAhead} {t("minutes")}
        </Text>
      </Box>

      <Button
        bgColor="error.500"
        borderRadius="3px"
        width="100%"
        color="white"
        size="lg"
        variant="solid"
        marginTop="2rem"
        onClick={openLeaveModal}
        disabled={!ticketId}
      >
        {t("leave-the-queue")}
      </Button>
    </>
  );
};
