import { Button, ButtonGroup } from "@chakra-ui/react";
import axios from "axios";
import router from "next/router";
import { Dispatch, SetStateAction } from "react";
import { API_ENDPOINT } from "../../constants";

interface Props {
  queues: any[];
  selectedQueues: { [key: string]: string };
  getTickets: () => Promise<void>;
  resetSelectedQueues: () => void;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
}

const DashboardActions = ({
  queues,
  selectedQueues,
  resetSelectedQueues,
  getTickets,
  isSubmitting,
  setIsSubmitting,
}: Props) => {
  const updateTicketsToNewQueues = () => {
    setIsSubmitting(true);
    try {
      (async () => {
        const response = await axios.put(`${API_ENDPOINT}/tickets`, {
          queueMap: selectedQueues,
        });

        if (response.status === 201) {
          router.reload();
        } else {
          throw new Error("");
        }
      })();
    } catch (error) {
      alert("Failed to update tickets to new queues");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ButtonGroup>
      <Button
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        isLoading={isSubmitting}
        disabled={Array.from(Object.keys(selectedQueues)).length === 0}
        onClick={() => updateTicketsToNewQueues()}
      >
        Activate changes
      </Button>
    </ButtonGroup>
  );
};

export default DashboardActions;
