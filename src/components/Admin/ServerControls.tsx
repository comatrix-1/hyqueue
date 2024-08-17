import { ButtonGroup, Button } from "@chakra-ui/react";
import axios from "axios";
import router from "next/router";
import { API_ENDPOINT } from "../../constants";

interface Props {
  onComplete: () => void;
  onMissed: () => void;
  onTakeFromPending: () => void;
  isSubmitting: boolean;
}

const ServerControls = ({
  onComplete,
  onMissed,
  onTakeFromPending,
  isSubmitting,
}: Props) => {
  return (
    <ButtonGroup my="1rem">
      <Button
        isLoading={isSubmitting}
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={onComplete}
      >
        Complete
      </Button>
      <Button
        isLoading={isSubmitting}
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={onMissed}
      >
        Move to missed
      </Button>
      <Button
        isLoading={isSubmitting}
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={onTakeFromPending}
      >
        Get next ticket
      </Button>
    </ButtonGroup>
  );
};

export default ServerControls;
