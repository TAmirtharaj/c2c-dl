/** @format */

import CustomButton from "./CustomButton";
import { imagePath } from "../helper/Helper";
import { useSelector } from "react-redux";
import "./LightBoxCloseBtn.css";
import { useState } from "react";

const LightBoxCloseBtn = (props) => {
  console.log("props------>", props);
  const currentPage = useSelector((state) => state.labNotebookPages) || 0;
  const closeIcon = imagePath("core/lightBoxCloseBtn.svg");
  const closeIconH = imagePath("core/lightBoxCloseBtnH.svg");

  const [lightboxCloseIcon, setLightboxCloseIcon] = useState(closeIcon);

  const mouseOverCloseHandler = () => {
    setLightboxCloseIcon(closeIconH);
  };
  const mouseOutCloseHandler = () => {
    setLightboxCloseIcon(closeIcon);
  };
  return (
    <CustomButton
      type='icon'
      className='lightbox-closebtn'
      url={lightboxCloseIcon}
      ariaLabel='Close the Lightbox Window'
      ariaHidden='false'
      onMouseOver={mouseOverCloseHandler}
      onMouseOut={mouseOutCloseHandler}
      onClick={() => props.onClose(currentPage)}
      // btnTitle='Close the Lightbox Window'
    />
  );
};

export default LightBoxCloseBtn;
