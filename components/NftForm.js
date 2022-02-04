import React, { useState } from "react";
import { Input, TextArea, Button } from "web3uikit";
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

function NftForm() {
  const { Moralis } = useMoralis();
  const [nftName, setNFTName] = useState();
  const [nftDesccriptiom, setNFTDescription] = useState();

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
    console.log(associatedAddress);
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
      .then((sendTokenResponse) => {
        console.log(sendTokenResponse);
        alert("Yay!! Send successful. Check you wallet.");
      });
  }
  return (
    <div
      style={{
        margin: "auto auto",
        width: "33%",
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
        <h1 style={{ marginTop: "20%", fontFamily: "sans-serif" }}>
          Upload and Mint your Cool NFTs
        </h1>
        <Input
          width="100%"
          label="NFT Name"
          name="NFT Name"
          onChange={(e) => setNFTName(e.target.value)}
          style={{ marginBottom: "20px", marginTop: "30px" }}
        />
        <TextArea
          width="100%"
          label="NFT Description"
          name="NFT Description"
          onChange={(e) => setNFTDescription(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <input
          type="file"
          id="file"
          style={{
            marginBottom: "40px",
            marginTop: "30px",
            alignSelf: "center",
          }}
        />
        <Button
          id="test-button-primary-large"
          onClick={uploadAndMintNFT}
          size="large"
          text="Mint NFT"
          theme="primary"
          type="button"
          style={{ marginBottom: "20px" }}
        />
      </div>
    </div>
  );
}

export default NftForm;
