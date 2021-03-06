import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { Button } from "web3uikit";
import styles from "./Login.module.css";

function Login({ setLoggedIn, loggedIn }) {
  const { Moralis } = useMoralis();

  async function connectWallet() {
    let user = Moralis.User.current();
    if (!user) {
      try {
        Moralis.authenticate({ type: "sol" }).then(function (user) {
          setLoggedIn(true);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function disconnectWallet() {
    await Moralis.User.logOut();
    setLoggedIn(false);
  }

  return (
    <div className={styles.loginContainer}>
      {!loggedIn ? (
        <Button
          id="test-button-primary-large"
          onClick={connectWallet}
          size="large"
          text="Connect Wallet"
          theme="primary"
          type="button"
        />
      ) : (
        <Button
          id="test-button-primary-large"
          onClick={disconnectWallet}
          size="large"
          text="Disconnect Wallet"
          theme="primary"
          type="button"
        />
      )}
    </div>
  );
}

export default Login;
