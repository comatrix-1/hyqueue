import { ButtonGroup, Button, Select } from "@chakra-ui/react";
import axios from "axios";
import { mapSeries } from "bluebird";
import _ from "lodash";
import router from "next/router";
import { useState } from "react";
import { EQueueTitles } from "../../model";

interface Props {
  queues: any[];
}

const DashboardActions = ({ queues }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serverQueues = queues.filter((queue) => queue.name.includes(EQueueTitles.ALERTED))

  return (
    <ButtonGroup>
      <Button
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={() => router.push(`/admin/dashboard`)}
      >
        Activate changes
      </Button>
    </ButtonGroup>
  );
};

export default DashboardActions;
