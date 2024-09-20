import { useRouter } from "next/router";
import { useEffect } from "react";
import { authentication } from "../utils";

const withProtectedRoute = (WrappedComponent: () => JSX.Element) => {
  return (props: any) => {
    const isAuthenticated = authentication.getKey() && authentication.getToken();

    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/not-found");
      }
    }, [isAuthenticated, router]);
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withProtectedRoute;
