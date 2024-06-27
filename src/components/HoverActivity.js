/** @format */

import React, { useEffect, useRef, useState } from "react";
import { imagePath } from "../helper/Helper";
import { connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import "./HoverActivity.css";
import HoverButton from "./HoverButton";

function HoverActivity(props) {
  console.log("question data.", props);
  const divRef = useRef(null);
  let [parentPos, setParentPos] = useState({});
  let [isImgLoaded, setIsImageLoaded] = useState(false);
  const imageSrc = imagePath(props.pageData.src);
  const altText = `image, ${props.pageData.altText?props.pageData.altText:''}`;

  // here in labelInfo.coords we receive the x and y coordinates of hover button in percentage
  let buttonComponent = props.pageData.labelInfo.map((labelInfo, index) => {
    return (
      <HoverButton
        key={index}
        pageData={props.pageData}
        labelInfo={labelInfo}
        parentPos={parentPos}
      ></HoverButton>
    );
  });

  useEffect(() => {
    getPosition();
  }, []);

  const getPosition = () => {
    let componentPosition = divRef.current.getBoundingClientRect();
    setParentPos(componentPosition);
  };

  const handleImageLoad = () => {
    getPosition();
    setIsImageLoaded(true);
  };

  return (
    // <div className='fill-in-the-blank-component'>
    <div className='hoverActivityWrapper'>
      <div
        key={props.pageData.sr}
        className='hoverActivityComponent'
        ref={divRef}
        style={{
          maxWidth: `${
            props.pageData.maxWidth ? props.pageData.maxWidth : "auto"
          }`,
          minWidth: `${
            props.pageData.minWidth ? props.pageData.minWidth : "auto"
          }`,
        }}
      >
        <img
          src={imageSrc}
          className='hoverImage'
          alt={altText}
          aria-hidden={false}
          onLoad={handleImageLoad}
        ></img>
        {isImgLoaded && buttonComponent}
      </div>
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
  connect(mapStateToProps, mapDispatchToProps)(HoverActivity)
);
