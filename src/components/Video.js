/** @format */

import React, { useEffect, useState, useRef } from "react";
import "./Video.css";
import Parser from "html-react-parser";
import CustomButton from "./CustomButton";
import { connect } from "react-redux";
import { BrowserDetect, getCommonWindowObj, imagePath } from "../helper/Helper";

const Video = (props) => {
  const imageWidth = props.pageData.imgDivWidth
    ? props.pageData.imgDivWidth
    : "100%";

  const checkDevice = BrowserDetect.getOrientation();
  let imgDivSytle;
  let windowObj = getCommonWindowObj();
  const [orientation, setOrientation] = useState(
    BrowserDetect.getOrientation().orientation
  );

  useEffect(() => {
    windowObj = getCommonWindowObj();
    //console.log(buttonRef);
    const resizeListener = () => {
      // change width from the state object
      const orientation = windowObj.innerWidth
        ? windowObj.innerWidth > windowObj.innerHeight
          ? "L"
          : "P"
        : BrowserDetect.getOrientation().orientation;
      // console.log(orientation, "-- resizeListener --");
      setOrientation(orientation);
    };
  }, []);

  if (checkDevice.type === "M" && props.pageData.imgDivWidthForMobile) {
    imgDivSytle = {
      width: props.pageData.imgDivWidthForMobile
        ? orientation === "P"
          ? props.pageData.imgDivWidthForMobile.P
          : props.pageData.imgDivWidthForMobile.L
        : "80%",
      margin: props.pageData.imgDivMargin ? props.pageData.imgDivMargin : "0px",
      flex: 'none'
    };
  } else if (checkDevice.type === "T" && props.pageData.imgDivWidthForTablet) {
    imgDivSytle = {
      width: props.pageData.imgDivWidthForTablet
        ? orientation === "P"
          ? props.pageData.imgDivWidthForTablet.P
          : props.pageData.imgDivWidthForTablet.L
        : "80%",
      margin: props.pageData.imgDivMargin ? props.pageData.imgDivMargin : "0px",
      flex: 'none'
    };
  } else {
    imgDivSytle = {
      width: props.pageData.imgDivWidth ? props.pageData.imgDivWidth : "80%",
      margin: props.pageData.imgDivMargin ? props.pageData.imgDivMargin : "0px",
      flex: 'none'
    };
  }

  const imageSrc = imagePath(props.pageData.image);
  let videoRef = useRef(null);
  let buttonRef = useRef(null);
  const onClickHandler = () => {
    // window.tempVideo=document.getElementById("tempVideo")
    if (props.getScroll) props.getScroll();
    props.updateShowLightBoxBool(true);
    // console.log(buttonRef);
    props.updateLightBoxData({
      type: "Video",
      refs: buttonRef,
      url: props.pageData.url
    });
  };

  const VideoComponent = () => {
    return (
      <div className='video-comp-wrapper col' style={imgDivSytle}>
        {props.pageData.title && (
          <div className='box-text-comp-heading bodyHeading'>
            {Parser(props.pageData.title)}
          </div>
        )}

        {props.pageData.subTitle && (
          <div role='heading' aria-level='2' className='box-text-comp-subHeading bodyBoldSubHeading'>
            {Parser(props.pageData.subTitle)}
          </div>
        )}
        <div className='image-text-comp-video'
          style={{ width: "100%" }}
        >
          {/* <img draggable={false} 
            src={imageSrc}
            alt="img"
            width={imageWidth}
            onClick={onClickHandler}
            // onClick={props.pageData.zoom ? onClickHandler : () => {}}
          /> */}
          <CustomButton
            type='icon'
            url={imageSrc}
            onClick={onClickHandler}
            customButtonRef={buttonRef}
            role="button"
            imgClassList='image-text-comp-image-img'
            width={imageWidth}
            style={{ padding: "0 5px 0 5px" }}
            ariaLabel={`video, ${props.pageData.title ? props.pageData.title : ""
              } ${props.pageData.subTitle ? props.pageData.subTitle : ""} ${props.pageData.desc ? props.pageData.desc : ""
              }`}
            ariaHidden='false'
          />
        </div>
      </div>
    );
  };

  if (props.pageData.isOrderedList) {
    return (
      <ol className='video-ordered-list'>
        <VideoComponent></VideoComponent>
      </ol>
    );
  } else {
    return (
      <>
        <VideoComponent></VideoComponent>
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    showLightBox: state.showLightBox,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Video);
