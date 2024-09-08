import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Textarea,
  CheckboxGroup,
  VStack,
  Checkbox,
  Box,
  Grid,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldArray } from "formik";
import { IEditableSettings } from "../../model";
import DayOpeningHours from "./DayOpeningHours";

const EditableSettings = ({
  editableSettings,
  submit,
}: {
  editableSettings: IEditableSettings;
  submit: (e: any) => void;
}) => {
  console.log("EditableSettings() editableSettings: ", editableSettings);

  const options = {
    name: "Full Name",
    contact: "Phone Number",
    nric: "NRIC",
    postalcode: "Postal Code",
    description: "Description",
  };

  const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (!editableSettings) return;

  return (
    <Box layerStyle="card" width="100%">
      <Formik initialValues={editableSettings} onSubmit={submit}>
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
                            ([key, value], index) => (
                              <Checkbox
                                key={index}
                                value={key}
                                isChecked={props.values.registrationFields?.includes(
                                  key
                                )}
                                onChange={(e) => {
                                  const idx =
                                    props.values.registrationFields?.indexOf(
                                      key
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
                            )
                          )}
                        </VStack>
                      </CheckboxGroup>
                    </FormControl>
                  )}
                </FieldArray>

                <Field name="categories">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.categories && form.touched.categories
                      }
                    >
                      <FormLabel>Categories</FormLabel>
                      <Textarea {...field} placeholder="Categories" />
                      <FormErrorMessage>
                        {form.errors.categories}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

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
                <Field name="openingHours">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl>
                      <FormLabel>Opening Hours</FormLabel>
                      {daysOfTheWeek.map((day, dayNumber) => (
                        <DayOpeningHours
                          key={dayNumber}
                          day={day}
                          value={form.values.openingHours?.[dayNumber] || ""}
                          onChange={(dayOpeningHours: string) =>
                            form.setFieldValue(
                              `openingHours.${dayNumber}`,
                              dayOpeningHours
                            )
                          }
                        />
                      ))}
                    </FormControl>
                  )}
                </Field>
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
