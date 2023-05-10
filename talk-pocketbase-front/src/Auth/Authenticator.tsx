import { FC, PropsWithChildren, useEffect, useState } from "react";
import PocketBase, { AuthMethodsList } from "pocketbase";
import { Collections } from "../pocketbase-types";

const Authenticator: FC<PropsWithChildren> = ({ children }) => {
  const pb = new PocketBase("http://127.0.0.1:8090");
  const redirectUrl = "http://localhost:5173/redirect";

  const [authMethods, setAuthMethods] = useState<AuthMethodsList>();
  const [isConnected, setIsConnected] = useState(pb.authStore.isValid);

  const loadLinks = async () => {
    const authMethodsResult = await pb
      .collection(Collections.Users)
      .listAuthMethods();
    setAuthMethods(authMethodsResult);
  };

  useEffect(() => {
    const unsubscribeAuthChange = pb.authStore.onChange(() => {
      setIsConnected(pb.authStore.isValid);
    });
    loadLinks();
    return () => unsubscribeAuthChange();
  }, []);

  return (
    <>
      {isConnected ? (
        <>{children}</>
      ) : (
        <div>
          {authMethods?.authProviders.map((provider) => (
            <button
              key={provider.name}
              onClick={() => {
                localStorage.setItem("provider", JSON.stringify(provider));
                window.location.replace(provider.authUrl + redirectUrl);
              }}
            >
              {provider.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Authenticator;
