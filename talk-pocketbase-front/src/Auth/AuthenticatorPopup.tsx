import { FC, PropsWithChildren, useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { Collections } from "../pocketbase-types";

const AuthenticatorPopup: FC<PropsWithChildren> = ({ children }) => {
  const pb = new PocketBase("http://127.0.0.1:8090");
  const [isConnected, setIsConnected] = useState(pb.authStore.isValid);

  const launchOAuthPopup = async () => {
    const authData = await pb
      .collection(Collections.Users)
      .authWithOAuth2({ provider: "discord" });
  };

  useEffect(() => {
    const unsubscribeAuthChange = pb.authStore.onChange(() => {
      setIsConnected(pb.authStore.isValid);
    });
    return () => unsubscribeAuthChange();
  }, []);

  return isConnected ? (
    <>{children}</>
  ) : (
    <button onClick={launchOAuthPopup}>Discord</button>
  );
};

export default AuthenticatorPopup;
