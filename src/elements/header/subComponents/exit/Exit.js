/** @format */

import React from "react";
import "./Exit.css";
import { imagePath } from "../../../../helper/Helper";
import CustomButton from "../../../../components/CustomButton";

const Exit = (props) => {
  const exitURL = imagePath(props.data && props.data.headerData.images.exitImage);

  const exitHandler = () => {
    // console.log("exit Button clicked");
    window.close();
  };

  return <CustomButton className="exit-button" onClick={exitHandler} type="icon" url={exitURL}></CustomButton>;
};

export default Exit;
