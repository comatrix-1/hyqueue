import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authentication } from "../utils";

const withProtectedRoute = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      const key = authentication.getKey();
      const token = authentication.getToken();

      if (!key || !token) {
        router.replace("/");
      }
    }, [router]);

    if (!isClient) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withProtectedRoute;
