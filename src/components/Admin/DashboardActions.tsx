import { ButtonGroup, Button, Select } from "@chakra-ui/react";
import axios from "axios";
import { mapSeries } from "bluebird";
import _ from "lodash";
import router from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { EQueueTitles } from "../../model";
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
        await axios.put(`${API_ENDPOINT}/tickets`, {
          queueMap: selectedQueues,
        });

        router.reload();
      })();
    } catch (error) {
      console.log(error);
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
