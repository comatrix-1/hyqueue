import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authentication } from "../utils";

const withProtectedRoute = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const token = authentication.getToken();
      const key = authentication.getKey();

      console.log(
        "authentication.getKey(), authentication.getToken()",
        authentication.getKey(),
        authentication.getToken()
      );

      if (
        (typeof authentication.getKey() === "string" &&
          typeof authentication.getToken() === "string" &&
          authentication.getKey() &&
          authentication.getToken()) ||
        process.env.NODE_ENV === "development"
      ) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/not-found");
      }
    }, [router]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withProtectedRoute;
