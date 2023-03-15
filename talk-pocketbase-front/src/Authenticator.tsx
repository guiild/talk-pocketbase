import { FC, PropsWithChildren, useEffect, useState } from "react";
import PocketBase, { AuthMethodsList } from "pocketbase";
import { Collections } from "./pocketbase-types";

const Authenticator: FC<PropsWithChildren> = ({ children }) => {
  const [authMethods, setAuthMethods] = useState<AuthMethodsList>();
  const [connected, setConnected] = useState(false);
  const pb = new PocketBase("http://127.0.0.1:8090");
  const redirectUrl = "http://localhost:5173/";

  const loadLinks = async () => {
    const authMethodsResult = await pb
      .collection(Collections.Users)
      .listAuthMethods();
    console.log(authMethodsResult);
    setAuthMethods(authMethodsResult);
  };

  useEffect(() => {
    if (pb.authStore.isValid) {
      setConnected(true);
    } else {
      setConnected(false);

      const params = new URL(window.location.href).searchParams;
      const code = params.get("code");
      console.log(localStorage?.getItem("provider"));
      const provider = JSON.parse(localStorage?.getItem("provider") || "{}");
      console.log(pb.authStore.isValid);
      if (!code) {
        loadLinks();
      } else {
        pb.collection(Collections.Users)
          .authWithOAuth2(
            provider.name,
            code,
            provider.codeVerifier,
            redirectUrl,
            {
              emailVisibility: false,
            }
          )
          .then((authData) => {
            console.log(authData);
            window.location.replace(redirectUrl);
          })
          .catch((err) => {
            console.log(err);
            //window.location.replace(redirectUrl);
          });
      }
    }
  }, []);

  return (
    <>
      {authMethods ? (
        <div>
          {authMethods?.authProviders.map((provider) => (
            <li>
              <a
                onClick={() =>
                  localStorage.setItem("provider", JSON.stringify(provider))
                }
                href={provider.authUrl + redirectUrl}
              >
                {provider.name}
              </a>
            </li>
          ))}
        </div>
      ) : connected ? (
        children
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Authenticator;
