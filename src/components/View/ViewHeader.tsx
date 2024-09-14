import { Center, Grid, GridItem, Text, Flex } from "@chakra-ui/react";

import LogoQueue from "../../assets/svg/logo-queue.svg";

interface Props {
  queueSystemName?: string;
}

export const ViewHeader = ({ queueSystemName }: Props) => {
  return (
    <Grid w="100%" h="100%" bg="base.100" templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={3}>
        <Flex h="100%" alignContent="center" mx="6">
          <Center h={50} p={1}>
            <LogoQueue />
          </Center>
        </Flex>
      </GridItem>
      <GridItem colSpan={3}>
        <Flex h="100%" alignContent="center" justifyContent="flex-end" mx="6">
          <Center>
            <Text textStyle="heading1">{queueSystemName ?? "-"}</Text>
          </Center>
        </Flex>
      </GridItem>
    </Grid>
  );
};
