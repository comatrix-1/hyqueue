import { useMemo } from "react";
import { Flex, Input, Text } from "@chakra-ui/react";

interface Props {
  day: string;
  value: {
    startHour: string;
    endHour: string;
  };
  onChange: (newTimes: { startHour: string; endHour: string }) => void;
  style?: any;
}

const DayOpeningHours = ({ day, value, onChange, style }: Props) => {
  const { startHour, endHour } = value;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value: timeValue } = e.target;

    if (id === "start") {
      onChange({ startHour: timeValue, endHour });
    } else {
      onChange({ startHour, endHour: timeValue });
    }
  };

  return (
    <Flex
      flexDirection="row"
      alignItems="start"
      justifyContent="start"
      {...style}
    >
      <Text width="25%" mr="5">
        {day}
      </Text>
      <Flex width="75%" flexDirection="column">
        <Flex flexDirection="row" alignItems="center" mb="5">
          <Input
            type="time"
            id="start"
            value={startHour}
            onChange={handleTimeChange}
            required={endHour !== ""}
          />
          <Text>&nbsp;to&nbsp;</Text>
          <Input
            type="time"
            id="end"
            value={endHour}
            onChange={handleTimeChange}
            required={startHour !== ""}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DayOpeningHours;
