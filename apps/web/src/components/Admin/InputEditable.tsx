import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Spinner,
  useEditableControls,
} from "@chakra-ui/react";

interface Props {
  color: string;
  fontSize: "sm" | "md" | "lg" | "xl";
  isLoading: boolean;
  textStyle: string;
  onSubmit: (value: string) => void;
  value: string;
}

const Index = ({
  color = "",
  fontSize = "md",
  isLoading = false,
  textStyle = "",
  onSubmit,
  value = "",
}: Props) => {
  const EditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    if (isLoading) {
      return <Spinner ml="5" />;
    } else if (isEditing) {
      return (
        <ButtonGroup display="flex" ml="5" justifyContent="center" size="sm">
          <IconButton
            icon={<CheckIcon />}
            aria-label={getSubmitButtonProps()["aria-label"] ?? ""}
            {...getSubmitButtonProps()}
          />
          <IconButton
            icon={<CloseIcon />}
            aria-label={getSubmitButtonProps()["aria-label"] ?? ""}
            {...getCancelButtonProps()}
          />
        </ButtonGroup>
      );
    } else {
      return (
        <Flex justifyContent="center" ml="5">
          <IconButton
            icon={<EditIcon />}
            aria-label={getSubmitButtonProps()["aria-label"] ?? ""}
            {...getEditButtonProps()}
          />
        </Flex>
      );
    }
  };

  return (
    <Editable
      display="flex"
      flexDir="row"
      alignItems="center"
      defaultValue={value}
      fontSize={fontSize}
      isPreviewFocusable={false}
      onSubmit={onSubmit}
    >
      <EditablePreview textStyle={textStyle} color={color} />
      <EditableInput textStyle={textStyle} color={color} px="2" />
      <EditableControls />
    </Editable>
  );
};

export default Index;
