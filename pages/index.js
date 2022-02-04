import Login from "../components/Login";
import NftForm from "../components/NftForm";
import Image from "next/image";
import { useState } from "react";

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <Image
              src="/mlh-logo-color.png"
              height={50}
              width={120}
              alt="mlh_logo"
            />
          </div>
          <div
            style={{
              marginTop: "20px",
              marginRight: "20px",
              marginLeft: "20px",
            }}
          >
            <Image
              src="/x-icon-white-20.jpg"
              height={30}
              width={30}
              alt="mlh_logo"
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <Image
              src="/solanaLogoMark.png"
              height={50}
              width={60}
              alt="mlh_logo"
            />
          </div>
        </div>

        <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
      </div>

      <NftForm loggedIn={loggedIn} />
    </div>
  );
}

export default Home;
