import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Navbar } from "../../components/Admin";
import { Container } from "../../components/Container";
import { Main } from "../../components/Main";
import { authentication } from "../../utils";

const Index = () => {
  const router = useRouter();

  const login = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const keyValue = searchParams.get("key") ?? "";

    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove the leading '#'
    const token = hashParams.get("token") ?? "";

    authentication.login(keyValue, token);
    router.push({ pathname: "/admin" });
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <Container>
      <Navbar width="100%" />
      <Main justifyContent="start" minHeight="90vh" width="100%">
        <Center>
          <Spinner />
        </Center>
      </Main>
    </Container>
  );
};

export default Index;
