import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import DayOpeningHours from "./DayOpeningHours";

interface Props {
  id: string;
  label: string;
  value: {
    [day: number]: string;
  };
  onChange: (newValues: any) => void; // TODO: change any
  style?: any;
}

const Index = ({ id, label, value, onChange, style }: Props) => {
  const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayOpeningHoursChanged = (dayNumber: number, dayOpeningHours: any) => {
    // TODO: change any
    onChange({
      ...value,
      [dayNumber]: dayOpeningHours,
    });
  };

  return (
    <Flex pt="0.5rem" pb="0.5rem" {...style}>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        {daysOfTheWeek.map((day, dayNumber) => {
          return (
            <DayOpeningHours
              key={dayNumber}
              day={day}
              value={value ? value[dayNumber] : ""}
              onChange={(dayOpeningHours: any) =>
                dayOpeningHoursChanged(dayNumber, dayOpeningHours)
              }
            />
          );
        })}
      </FormControl>
    </Flex>
  );
};

export default Index;
