import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { Button } from "web3uikit";

function Login() {
  const [loggedIn, setLoggedIn] = useState(false);

  const { Moralis } = useMoralis();

  async function connectWallet() {
    let user = Moralis.User.current();
    if (!user) {
      try {
        Moralis.authenticate({ type: "sol" }).then(function (user) {
          console.log(user.get("solAddress"));
          setLoggedIn(true);
          alert("Login successful");
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function disconnectWallet() {
    await Moralis.User.logOut();
    console.log("logged out");
    alert("Logout successful");
  }

  return (
    <div style={{ float: "right" }}>
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
