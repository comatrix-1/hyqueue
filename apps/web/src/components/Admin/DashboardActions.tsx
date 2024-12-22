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

  // Function to generate the report
  const generateReport = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.get(`${API_ENDPOINT}/generate-report`, {
        responseType: "blob", // Ensure the response is treated as a file
      });

      if (response.status === 200) {
        // Create a link element to trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Queue_Report.csv"); // You can adjust the filename here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("Failed to generate the report");
      }
    } catch (error) {
      alert("Failed to generate the report");
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
      <Button
        display="flex"
        colorScheme="green"
        borderRadius="3px"
        color="white"
        variant="solid"
        isLoading={isSubmitting}
        onClick={generateReport} // Call generateReport function when clicked
      >
        Generate Report
      </Button>
    </ButtonGroup>
  );
};

export default DashboardActions;
