/** @format */

import React, { useState } from "react";
import "./Help.css";
import { imagePath } from "../../../../helper/Helper";
import CustomButton from "../../../../components/CustomButton";

const Help = (props) => {
  const helpURL = imagePath(props.data && props.data.headerData.images.helpImage);
  const helpURLH = imagePath(props.data && props.data.headerData.images.helpImageH);

  let [imageSrc, setImageSrc] = useState(helpURL);

  const helpHandler = (e) => {
    switch (e.type) {
      case "mouseover":
        setImageSrc(helpURLH);
        break;
      case "mouseout":
        setImageSrc(helpURL);
        break;
      case "click":
        console.log("help Button clicked");
        break;
      default:
        break;
    }
  };

  return (
    <CustomButton
      className="help-button disable-button"
      onClick={helpHandler}
      onMouseOver={helpHandler}
      onMouseOut={helpHandler}
      type="icon"
      url={helpURL}
      tabIndex="-1"
      ariaHidden={true}
    ></CustomButton>
  );
};

export default Help;
