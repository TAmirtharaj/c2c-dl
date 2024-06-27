/** @format */

import React, { useState } from "react";
import { imagePath } from "../helper/Helper";
import { connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import "./HoverButton.css";
import Parser from "html-react-parser";

function HoverButton(props) {
  console.log("props in hoverButton", props);
  let [isHovered, setIsHovered] = useState(false);
  const imgPath =
    props.labelInfo &&
    props.labelInfo.hoverImageIconSrc &&
    props.labelInfo.hoverImageIconSrc.src
      ? props.labelInfo.hoverImageIconSrc.src
      : null;
  let imageSrc = null;
  if (imgPath) {
    imageSrc = imagePath(imgPath);
  }
  let hoverTextPositionStyle;

  //we add points in percentage of the activity div's width and height
  let xPos = parseInt(
    props.parentPos.width * (props.labelInfo.coords[0] / 100)
  );
  let YPos = parseInt(
    props.parentPos.height * (props.labelInfo.coords[1] / 100)
  );

  console.log(
    "all value",
    props.parentPos.width,
    props.parentPos.height,
    props.labelInfo.coords[0],
    props.labelInfo.coords[1]
  );
  console.log(xPos, YPos);

  //setting style for hoverText according to labelPosition
  // if(props.labelInfo.labelPosition === 'UR'){
  //   hoverTextPositionStyle = { left: 'calc(50% + 5px)' , bottom:'calc(50% + 5px)' }
  // } else if(props.labelInfo.labelPosition === 'LR'){
  //   hoverTextPositionStyle = { left: 'calc(50% + 5px)' , top:'calc(50% + 3px)' }
  // } else if(props.labelInfo.labelPosition === 'UL'){
  //   hoverTextPositionStyle = { right: 'calc(50% + 4px)' , bottom:'calc(50% + 4px)' }
  // } else if(props.labelInfo.labelPosition === 'LL'){
  //   hoverTextPositionStyle = { right: 'calc(50% + 6px)' , top:'calc(50% + 1px)' }
  // }

  if (props.labelInfo.labelPosition === "UR") {
    hoverTextPositionStyle = `classUpperRight`;
  }
  if (props.labelInfo.labelPosition === "LR") {
    hoverTextPositionStyle = `classLowerRight`;
  }
  if (props.labelInfo.labelPosition === "UL") {
    hoverTextPositionStyle = `classUpperLeft`;
  }
  if (props.labelInfo.labelPosition === "LL") {
    hoverTextPositionStyle = `classLowerLeft`;
  }

  let isImageIconPresent =
    props.labelInfo &&
    props.labelInfo.hoverImageIconSrc &&
    props.labelInfo.hoverImageIconSrc.src &&
    props.labelInfo.hoverImageIconSrc.src !== "" &&
    props.labelInfo.hoverImageIconSrc.src !== undefined;
  let isLabelTextPresent =
    props.labelInfo &&
    props.labelInfo.labelName &&
    props.labelInfo.labelName !== "" &&
    props.labelInfo.labelName !== undefined;

  return (
    <div
      key={props.pageData.sr}
      className='hoverButtonComponent'
      style={{ top: `${YPos}px`, left: `${xPos}px` }}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className='hoverButton' aria-hidden={true} tabIndex='-1'>
        <img 
          className='hoverButtonImage' 
          src={props.pageData.buttonIcon} 
          aria-label={Parser(props.labelInfo.labelName)} 
          aria-hidden={true} />
      </button>
      <span tabIndex='-1' className="hover-button-label" aria-hidden={false}>{Parser(props.labelInfo.labelName)}</span>
      {isHovered && (
        <div
          className={`hoverTextContainer ${hoverTextPositionStyle}`}
          style={{
            width: `${isImageIconPresent ? "70%" : "100%"}`,
          }}
        >
          {isImageIconPresent && (
            <div className='hoverImageIcon'>
              <img 
                src={imageSrc} 
                // alt='No URL'
                aria-hidden={true}
              >
              </img>
            </div>
          )}
          {isLabelTextPresent && (
            <div
              className='hoverText'
              style={{
                width: `${isImageIconPresent ? "70%" : "100%"}`,
                marginLeft: `${isImageIconPresent ? "10px" : "0"}`,
                textAlign: `${isImageIconPresent ? "" : "center"}`,
              }}
            >
              {Parser(props.labelInfo.labelName)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(HoverButton)
);
