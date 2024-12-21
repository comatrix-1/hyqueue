import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik, FormikHelpers } from "formik";
import moment from "moment-timezone";
import { IEditableSettings, ITicketDescription } from "../../model";
import DayOpeningHours from "./DayOpeningHours";

const EditableSettings = ({
  editableSettings,
  submit,
}: {
  editableSettings: IEditableSettings;
  submit: (
    values: IEditableSettings,
  ) => void;
}) => {
  const options: Partial<ITicketDescription> = {
    name: "Full Name",
    contact: "Phone Number",
    nric: "NRIC",
    postalcode: "Postal Code",
    description: "Description",
  };

  const timeZones = moment.tz.names();

  if (!editableSettings) return;

  return (
    <Box layerStyle="card" width="100%">
      <Formik
        initialValues={{
          ...editableSettings,
          openingHours: editableSettings.openingHours || [
            { day: "Monday", startHour: "", endHour: "" },
            { day: "Tuesday", startHour: "", endHour: "" },
            { day: "Wednesday", startHour: "", endHour: "" },
            { day: "Thursday", startHour: "", endHour: "" },
            { day: "Friday", startHour: "", endHour: "" },
            { day: "Saturday", startHour: "", endHour: "" },
            { day: "Sunday", startHour: "", endHour: "" },
          ],
        }}
        onSubmit={submit}
      >
        {(props) => (
          <Form>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <Box w="100%">
                <FieldArray name="registrationFields">
                  {({ push, remove }) => (
                    <FormControl>
                      <FormLabel>Registration Fields</FormLabel>
                      <CheckboxGroup
                        colorScheme="primary"
                        value={props.values.registrationFields}
                      >
                        <VStack alignItems="flex-start">
                          {Object.entries(options).map(
                            ([key, value], index) => {
                              const typedKey = key as keyof ITicketDescription;

                              return (
                                <Checkbox
                                  key={index}
                                  value={key}
                                  isChecked={props.values.registrationFields?.includes(
                                    typedKey
                                  )}
                                  onChange={(e) => {
                                    const idx =
                                      props.values.registrationFields?.indexOf(
                                        typedKey
                                      );
                                    if (e.target.checked && idx === -1) {
                                      push(key);
                                    } else if (!e.target.checked && idx > -1) {
                                      remove(idx);
                                    }
                                  }}
                                >
                                  {value}
                                </Checkbox>
                              );
                            }
                          )}
                        </VStack>
                      </CheckboxGroup>
                    </FormControl>
                  )}
                </FieldArray>

                <FieldArray name="categories">
                  {({ push, remove, form }) => (
                    <FormControl>
                      <Flex alignItems="center" justifyItems="center" my={4}>
                        <FormLabel>Categories</FormLabel>
                        <Button
                          colorScheme="primary"
                          onClick={() => push("")}
                          size="sm"
                        >
                          +
                        </Button>
                      </Flex>
                      <VStack spacing={2} align="start">
                        {form.values.categories &&
                        form.values.categories.length > 0 ? (
                          form.values.categories.map(
                            (category: string, index: number) => (
                              <Flex key={index} align="center">
                                <Input
                                  value={category}
                                  placeholder="Category"
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      `categories[${index}]`,
                                      e.target.value
                                    )
                                  }
                                />
                                <Button
                                  ml={2}
                                  colorScheme="red"
                                  onClick={() => remove(index)}
                                >
                                  Delete
                                </Button>
                              </Flex>
                            )
                          )
                        ) : (
                          <Text mb={4} fontStyle="italic">
                            No categories added yet.
                          </Text>
                        )}
                      </VStack>

                      <FormErrorMessage>
                        {typeof form.errors.categories === "string" &&
                          form.errors.categories}
                        {Array.isArray(form.errors.categories) &&
                          form.errors.categories.join(", ")}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </FieldArray>

                <Field name="feedbackLink">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.feedbackLink && form.touched.feedbackLink
                      }
                    >
                      <FormLabel>Feedback Link</FormLabel>
                      <Input {...field} placeholder="Feedback Link" />
                      <FormErrorMessage>
                        {form.errors.feedbackLink}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="privacyPolicyLink">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.privacyPolicyLink &&
                        form.touched.privacyPolicyLink
                      }
                    >
                      <FormLabel>Privacy Policy Link</FormLabel>
                      <Input {...field} placeholder="Privacy Policy Link" />
                      <FormErrorMessage>
                        {form.errors.privacyPolicyLink}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="ticketPrefix">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.ticketPrefix && form.touched.ticketPrefix
                      }
                    >
                      <FormLabel>Ticket Prefix</FormLabel>
                      <Input {...field} placeholder="Ticket Prefix" />
                      <FormErrorMessage>
                        {form.errors.ticketPrefix}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="waitTimePerTicket">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.waitTimePerTicket &&
                        form.touched.waitTimePerTicket
                      }
                    >
                      <FormLabel>Wait Time Per Ticket</FormLabel>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Wait Time Per Ticket"
                      />
                      <FormErrorMessage>
                        {form.errors.waitTimePerTicket}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>

              <Box w="100%">
                <Field name="openingHoursTimeZone">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.openingHoursTimeZone &&
                        form.touched.openingHoursTimeZone
                      }
                    >
                      <FormLabel>Opening Hours Time Zone</FormLabel>
                      <Select {...field} placeholder="Select Time Zone">
                        {timeZones.map((timeZone) => (
                          <option key={timeZone} value={timeZone}>
                            {timeZone}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.openingHoursTimeZone}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <FieldArray name="openingHours">
                  {() => (
                    <FormControl>
                      <FormLabel marginTop={4}>Opening Hours</FormLabel>
                      {props.values.openingHours.map((item, index) => (
                        <DayOpeningHours
                          key={index}
                          day={item.day}
                          value={{
                            startHour: item.startHour ?? "",
                            endHour: item.endHour ?? "",
                          }}
                          onChange={(newTimes: {
                            startHour: string;
                            endHour: string;
                          }) =>
                            props.setFieldValue(`openingHours.${index}`, {
                              ...item,
                              ...newTimes,
                            })
                          }
                        />
                      ))}
                    </FormControl>
                  )}
                </FieldArray>
              </Box>
            </Grid>

            <Button
              mt={4}
              colorScheme="primary"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditableSettings;
