import React, { useState } from "react";
import { Input, TextArea, Button } from "web3uikit";
import { actions, NodeWallet } from "@metaplex/js";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useMoralis } from "react-moralis";

function NftForm() {
  const { Moralis } = useMoralis();
  const [nftName, setNFTName] = useState();
  const [nftDesccriptiom, setNFTDescription] = useState();

  async function uploadAndMintNFT() {
    // Storing the file

    const keypair = Keypair.generate();
    let user = Moralis.User.current();

    const fileInput = document.getElementById("file");
    const data = fileInput.files[0];

    const imageFile = new Moralis.File(data.name, data);
    await imageFile.saveIPFS();

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
    const mintNFTResponse = await actions
      .mintNFT({
        connection,
        wallet: new NodeWallet(keypair),
        uri: metadataURI,
        maxSupply: 1,
      })
      .then((mintNFTResponse) => {
        alert("Mint successful");
      });
  }
  return (
    <div
      style={{
        margin: "auto auto",
        width: "40%",
        border: "1px solid black",
        height: "400px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Input
          label="NFT Name"
          name="NFT Name"
          onChange={(e) => setNFTName(e.target.value)}
        />
        <TextArea
          label="NFT Description"
          name="NFT Description"
          onChange={(e) => setNFTDescription(e.target.value)}
        />
        <input type="file" id="file" />
        <Button
          id="test-button-primary-large"
          onClick={uploadAndMintNFT}
          size="large"
          text="Mint NFT"
          theme="primary"
          type="button"
        />
      </div>
    </div>
  );
}

export default NftForm;
