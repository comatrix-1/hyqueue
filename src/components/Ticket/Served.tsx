import { Box, Button, Center, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

interface Props {
  feedbackLink: string | undefined;
}

export const Served = ({ feedbackLink }: Props) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Center></Center>
      <Box layerStyle="card" textAlign="center" mt={3}>
        <Text textStyle="display3" mb={4}>
          {t("thanks-for-coming")}
        </Text>
        <Text textStyle="body1">{t("wish-you-good-day-ahead")}</Text>

        {feedbackLink && (
          <a href={feedbackLink}>
            <Button
              display="flex"
              colorScheme="blue"
              borderRadius="3px"
              color="white"
              variant="solid"
              mt={4}
            >
              Give us some feedback
            </Button>
          </a>
        )}
      </Box>
    </>
  );
};
