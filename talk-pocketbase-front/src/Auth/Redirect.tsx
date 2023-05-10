import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PocketBase from "pocketbase";
import { Collections } from "../pocketbase-types";

const Redirect: FC = () => {
  const pb = new PocketBase("http://127.0.0.1:8090");
  const redirectUrl = "http://localhost:5173/redirect";
  const [error, setError] = useState<string>("");

  const lockAuth = useRef(false);

  const navigate = useNavigate();

  const connectWithCode = async (code: string) => {
    if (lockAuth.current) return;
    lockAuth.current = true;
    const provider = JSON.parse(localStorage?.getItem("provider") || "{}");
    try {
      await pb
        .collection(Collections.Users)
        .authWithOAuth2Code(
          provider.name,
          code,
          provider.codeVerifier,
          redirectUrl
        );
      navigate("/");
    } catch (err) {
      setError("Fail to authenticate, please try again.");
    }
    lockAuth.current = false;
  };

  useEffect(() => {
    setError("");
    if (pb.authStore.isValid) {
      navigate("/");
    } else {
      const params = new URL(window.location.href).searchParams;
      const code = params.get("code");
      if (!code) {
        setError("No code");
        return;
      }
      connectWithCode(code);
    }
  }, []);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  return <div>Loading...</div>;
};

export default Redirect;
