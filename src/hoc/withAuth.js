import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth"; // Import the getToken function
import LoadingIconComponent from "@/components/LoadingIcon/LoadingIcon"; // Import the loading icon component

const withAuth = (WrappedComponent) => {
  // Return a new component that wraps the passed-in component
  const AuthHOC = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const token = getToken(); // Check if a token exists

      if (!token) {
        router.push("/pages/login"); // Redirect to login page if no token found
      } else {
        setIsAuthenticated(true); // If token exists, set authenticated to true
      }
    }, [router]);

    if (isAuthenticated === null) {
      return <LoadingIconComponent />; // Display loading icon while checking authentication
    }

    return <WrappedComponent {...props} />; // Render the wrapped component if authenticated
  };

  return AuthHOC; // Return the HOC
};

export default withAuth;
