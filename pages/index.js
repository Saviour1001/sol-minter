import Login from "../components/Login";
import NftForm from "../components/NftForm";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      <div className={styles.homeContainer}>
        <div className={styles.homeContainer}>
          <div className={styles.mlhImg}>
            <Image
              src="/mlh-logo-color.png"
              height={50}
              width={120}
              alt="mlh_logo"
            />
          </div>
          <div className={styles.xImage}>
            <Image
              src="/x-icon-white-20.jpg"
              height={30}
              width={30}
              alt="mlh_logo"
            />
          </div>
          <div className={styles.solanaImg}>
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
