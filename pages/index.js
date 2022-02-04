import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useMoralis } from "react-moralis";

export default function Home() {
  const { Moralis } = useMoralis();
  async function login() {
    let user = Moralis.User.current();
    if (!user) {
      try {
        Moralis.authenticate({ type: "sol" }).then(function (user) {
          console.log(user.get("solAddress"));
          alert("Login successful");
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
    alert("Logout successful");
  }
  return (
    <div className={styles.container}>
      Hello
      <form>
        <input type="text" />
      </form>
      <button onClick={login}>Login</button>
      <button onClick={logOut}>logout</button>
    </div>
  );
}
