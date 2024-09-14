import { Box, Button, Center, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

interface Props {
  openLeaveModal: () => void;
  numberOfTicketsAhead: number;
  ticketId: string | undefined;
  waitingTime?: number | null;
}

export const NextInQueue = ({
  openLeaveModal,
  numberOfTicketsAhead,
  ticketId,
  waitingTime = 3,
}: Props) => {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Box layerStyle="card" bgColor="base.500">
        <Text textStyle="subtitle2">{t("queue-position")}</Text>
        <Text textStyle="display3" mb="2rem">
          {t("youre-next")}
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
