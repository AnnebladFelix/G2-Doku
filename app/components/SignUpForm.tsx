"use client";
import { Spinner } from "./Spinner";
import { useEffect, useState } from "react";
import { signUp } from "../actions/users/signUp";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Ange en giltig e-postadress.");
      return;
    }

    if (password.length < 4) {
      setMessage("Lösenordet måste vara minst 4 tecken långt.");
      return;
    }

    setMessage("Skapar användare...", );
    try {
      setLoading(true)
      const response = await signUp(email, password, name);

      if (response.includes("Succesfully created user")) {
        setMessage("Registreringen lyckades!");
        router.push("/");
      } else {
        setMessage("Användaren finns redan.");
      }
    } catch (error) {
      setLoading(false)
      console.error("Error signing up:", error);
      setMessage("Ett fel uppstod vid registrering. Försök igen senare.");
    }
  };

  useEffect(() => {
    if (message) {

    }
  }, [router, message]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 bg-primary p-4 text-text">
        <input
          className="bg-secondary"
          type="name"
          value={name}
          placeholder="Namn"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="bg-secondary"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-secondary"
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="rounded-md shadow-md mb-2 hover:animate-pulse bg-accent2 hover:bg-accent2" onClick={handleSubmit} disabled={loading}>Skapa användare{loading && <Spinner />}</button>
        <p className="text-2xl text-accent">{message}</p>
      </div>
    </div>

  );
};

export default SignUpForm;
