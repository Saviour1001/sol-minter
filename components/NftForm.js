import React, { useState } from "react";
import { Input, TextArea, Button, Icon, Modal } from "web3uikit";
import { actions, NodeWallet } from "@metaplex/js";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { useMoralis } from "react-moralis";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Image from "next/image";
import styles from "./NftForm.module.css";

function NftForm({ loggedIn }) {
  const { Moralis } = useMoralis();
  const [nftName, setNFTName] = useState();
  const [nftDesccriptiom, setNFTDescription] = useState();
  const [succesModal, setSuccessModal] = useState(false);

  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  );

  let associatedAddress = "";

  async function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    const array = await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );
    associatedAddress = array[0];
  }

  async function uploadAndMintNFT() {
    // Storing the file

    const keypair = Keypair.generate();
    const wallet = new NodeWallet(keypair);
    let user = Moralis.User.current();
    const userWallet = new PublicKey(user.get("solAddress"));

    const fileInput = document.getElementById("file");
    const data = fileInput.files[0];

    const imageFile = new Moralis.File(data.name, data);
    await imageFile.saveIPFS().then();

    // Storing the metadata

    const imageURI = imageFile.ipfs();
    const metadata = {
      name: nftName,
      symbol: "MLH",
      description: nftDesccriptiom,
      image: imageURI,
      seller_fee_basis_points: 0,
      properties: {
        files: [
          {
            uri: imageURI,
            type: "image/jpeg",
          },
        ],
        category: "image",
        creators: [
          {
            address: keypair.publicKey,
            verified: true,
            share: 100,
          },
        ],
      },
    };
    const metadataFile = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(metadata)),
    });

    await metadataFile.saveIPFS();
    const metadataURI = metadataFile.ipfs();

    // minting
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const feePayerAirdropSignature = await connection.requestAirdrop(
      keypair.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(feePayerAirdropSignature);
    let mintaddress = "";
    const mintNFTResponse = await actions
      .mintNFT({
        connection,
        wallet: wallet,
        uri: metadataURI,
        maxSupply: 1,
      })
      .then((mintNFTResponse) => {
        mintaddress = mintNFTResponse.mint;
      });

    await findAssociatedTokenAddress(keypair.publicKey, mintaddress);

    const sendingToken = await actions
      .sendToken({
        connection,
        amount: 1,
        destination: userWallet,
        source: associatedAddress,
        wallet: wallet,
        mint: mintaddress,
      })
      .then(() => {
        setSuccessModal(true);
      });
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.heading}>Lightning NFT Minter</h1>
        <Input
          width="100%"
          label="NFT Name"
          name="NFT Name"
          onChange={(e) => setNFTName(e.target.value)}
          className={styles.inputName}
        />
        <TextArea
          width="100%"
          label="NFT Description"
          name="NFT Description"
          onChange={(e) => setNFTDescription(e.target.value)}
          className={styles.inputDes}
        />
        <input type="file" id="file" className={styles.inputFile} />
        {loggedIn ? (
          <Button
            id="test-button-primary-large"
            onClick={uploadAndMintNFT}
            size="large"
            text="Mint NFT"
            theme="primary"
            type="button"
            className={styles.btnMargin}
          />
        ) : (
          <Button
            id="test-button-primary-large"
            onClick={uploadAndMintNFT}
            size="large"
            text="Connect Wallet to Mint NFT"
            theme="primary"
            type="button"
            className={styles.btnMargin}
            disabled={true}
          />
        )}
      </div>

      {succesModal ? (
        <Modal
          id="regular"
          onCloseButtonPressed={() => setSuccessModal(false)}
          onOk={() => setSuccessModal(false)}
          title=""
          isCancelDisabled={true}
        >
          <div className={styles.modalContainer}>
            <Image src="/yayy-happy.gif" alt="yayy" height={200} width={300} />
            <p>
              Yayyy!!🎊 You have minted your cool NFT. Checkout out your phantom
              wallet for surprise.🎊🎊
            </p>
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
}

export default NftForm;
