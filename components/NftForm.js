import React from "react";
import { Form } from "web3uikit";

function NftForm() {
  return (
    <div style={{ margin: "auto auto", width: "40%" }}>
      {/* <input
        type="text"
        name="metadataName"
        id="metadataName"
        placeholder="Metadata Name"
      />
      <br />
      <br />
      <input
        type="text"
        name="metadataDescription"
        id="metadataDescription"
        placeholder="Metadata Description"
      />
      <br />
      <br />
      <input type="file" name="fileInput" id="file" placeholder="File" /> */}
      <Form
        buttonConfig={{
          onClick: function noRefCheck() {},
          theme: "primary",
        }}
        data={[
          {
            inputWidth: "100%",
            name: "Name of your NFT",
            type: "text",
            value: "",
          },
          {
            inputWidth: "100%",
            name: "NFT Description",
            type: "textarea",
            value: "",
          },
        ]}
        onSubmit={function noRefCheck() {}}
        title="Upload your cool NFT's"
      />
    </div>
  );
}

export default NftForm;
