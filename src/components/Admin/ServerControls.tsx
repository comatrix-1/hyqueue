import { ButtonGroup, Button } from "@chakra-ui/react";
import router from "next/router";

const ServerControls = () => {
  return (
    <ButtonGroup my="1rem">
      <Button
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={() => router.push(`/support`)}
      >
        Complete
      </Button>
      <Button
        //   isLoading={isSubmitting}
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        //   onClick={generateReport}
      >
        Move to missed
      </Button>
      <Button
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        //   onClick={() => window.open(boardData.shortUrl)}
      >
        Get next ticket
      </Button>
    </ButtonGroup>
  );
};

export default ServerControls;
