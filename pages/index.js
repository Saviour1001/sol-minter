import { actions, NodeWallet } from "@metaplex/js";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Button } from "web3uikit";
import Login from "../components/Login";
import { useState } from "react";
import NftForm from "../components/NftForm";

function Home() {
  async function toTheMoon() {
    // Storing the file
    console.log("Uploading the image");
    const keypair = Keypair.generate();
    console.log(keypair.publicKey.toBase58());
    let user = Moralis.User.current();
    const fileInput = document.getElementById("file");
    const data = fileInput.files[0];
    const imageFile = new Moralis.File(data.name, data);
    await imageFile.saveIPFS();

    // Storing the metadata

    const imageURI = imageFile.ipfs();
    console.log("Image URI: ", imageURI);
    const metadata = {
      name: document.getElementById("metadataName").value,
      symbol: "MLH",
      description: document.getElementById("metadataDescription").value,
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
    console.log("Uploading Metadata");
    await metadataFile.saveIPFS();
    const metadataURI = metadataFile.ipfs();
    console.log(metadataURI);
    alert("Upload successful");

    // minting
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const feePayerAirdropSignature = await connection.requestAirdrop(
      keypair.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(feePayerAirdropSignature);
    const mintNFTResponse = await actions
      .mintNFT({
        connection,
        wallet: new NodeWallet(keypair),
        uri: metadataURI,
        maxSupply: 1,
      })
      .then((mintNFTResponse) => {
        console.log(mintNFTResponse);
        alert("Mint successful");
      });
  }
  return (
    <div>
      <Login />

      <NftForm />

      <button onClick={toTheMoon}>Upload</button>
    </div>
  );
}

export default Home;
