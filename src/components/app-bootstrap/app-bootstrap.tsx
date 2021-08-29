import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { useFonts, DeliusUnicase_400Regular, DeliusUnicase_700Bold } from "@expo-google-fonts/delius-unicase";
import { Auth, Hub } from "aws-amplify";

import Loading from "../loading/loading";
import { useAuth } from "@contexts/auth-context";

type AppBootStrapProps = {
  children: ReactNode;
};

export default function AppBootStrap({ children }: AppBootStrapProps): ReactElement {
  const [fontLoaded] = useFonts({
    DeliusUnicase_400Regular,
    DeliusUnicase_700Bold,
  });
  const [authLoaded, setAuthLoaded] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    console.log("load app-bootstrap once...");
    async function checkCurrentUser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch (err) {
        setUser(null);
      }
      setAuthLoaded(true);
    }

    function hubListener(hubData: any) {
      const { data, event } = hubData.payload;
      console.log(`event`, event);
      switch (event) {
        case "signOut":
          setUser(null);
          break;
        case "signIn":
          setUser(data);
          break;

        default:
          break;
      }
    }
    Hub.listen("auth", hubListener);

    checkCurrentUser();

    return () => {
      Hub.remove("auth", hubListener);
    };
  }, []);

  return fontLoaded && authLoaded ? <>{children}</> : <Loading />;
}
