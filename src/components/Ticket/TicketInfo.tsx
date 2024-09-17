import { Flex, Text } from "@chakra-ui/react";
import { ITicket } from "../../model";
import useTranslation from "next-translate/useTranslation";

interface Props {
  ticket: ITicket | undefined;
  color?: string;
}

const TicketInfo = ({ ticket, color }: Props) => {
  if (!ticket) return;
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Text
        align="center"
        textStyle="subtitle2"
        color={color}
        mb="1rem"
        fontWeight="bold"
      >
        {t("your-ticket-information")}
      </Text>
      <Flex direction="column" align="start" w="full" color={color}>
        {ticket?.desc?.category ? (
          <Text>
            {t("field-category-label")}: {ticket.desc.category}
          </Text>
        ) : null}
        {ticket?.desc?.contact ? (
          <Text>
            {t("field-contact-label")}: {ticket.desc.contact}
          </Text>
        ) : null}
        {ticket?.desc?.name ? (
          <Text>
            {t("field-name-label")}: {ticket.desc.name}
          </Text>
        ) : null}
        {ticket?.desc?.nric ? (
          <Text>
            {t("field-nric-label")}: {ticket.desc.nric}
          </Text>
        ) : null}
        {ticket?.desc?.postalcode ? (
          <Text>
            {t("field-postalcode-label")}: {ticket.desc.postalcode}
          </Text>
        ) : null}
        {ticket?.desc?.description ? (
          <Text>
            {t("field-description-label")}: {ticket.desc.description}
          </Text>
        ) : null}
      </Flex>
    </>
  );
};

export default TicketInfo;
