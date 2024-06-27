/** @format */

import React, { useEffect, useState, useRef } from "react";
import Parser from "html-react-parser";
import {
  BrowserDetect,
  getCommonWindowObj,
  imagePath,
  setCommonWindowObj,
} from "../helper/Helper";
import "./ImageWithHeading.css";
import { connect } from "react-redux";

const ImageWithHeading = (props) => {
  // console.log("img data", typeof props.pageData.image, props.pageData.image);
  // const image = imagePath(props.pageData.image);
  const imageWidth = props.pageData.width ? props.pageData.width : "100%";
  const checkDevice = BrowserDetect.getOrientation();
  let imgDivStyle;
  const [orientation, setOrientation] = useState(
    BrowserDetect.getOrientation().orientation
  );
  let windowObj = getCommonWindowObj();
  
  const imgWithLabelRef = useRef(null);

  useEffect(() => {
    windowObj = getCommonWindowObj();
    const resizeListener = () => {
      // change width from the state object
      const orientation =
        windowObj.innerWidth > windowObj.innerHeight ? "L" : "P";
      setOrientation(orientation);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);
    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  if (checkDevice.type === "M" && props.pageData.imgDivWidthForMobile) {
    imgDivStyle = {
      width: props.pageData.imgDivWidthForMobile
        ? orientation === "P"
          ? props.pageData.imgDivWidthForMobile.P
          : props.pageData.imgDivWidthForMobile.L
        : "80%",
      margin: props.pageData.imgDivMargin ? props.pageData.imgDivMargin : "5px",
    };
  } else if (checkDevice.type === "T" && props.pageData.imgDivWidthForTablet) {
    imgDivStyle = {
      width: props.pageData.imgDivWidthForTablet
        ? orientation === "P"
          ? props.pageData.imgDivWidthForTablet.P
          : props.pageData.imgDivWidthForTablet.L
        : "80%",
      margin: props.pageData.imgDivMargin ? props.pageData.imgDivMargin : "5px",
    };
  } else {
    imgDivStyle = {
      width: props.pageData.imgDivWidth ? props.pageData.imgDivWidth : "80%",
      margin: props.pageData.imgDivMargin ? props.pageData.imgDivMargin : "5px",
    };
  }

  const onClickHandler = (e) => {
    if (props.pageData.disableClick !== false) {
      props.updateShowLightBoxBool(true);
      if (typeof props.pageData.image !== "object") {
        props.updateLightBoxData({
          type: "Image",
          url: imagePath(props.pageData.image),
          refs: imgWithLabelRef,
          maxWidth: props.pageData.maxWidth ? props.pageData.maxWidth : {},
          maxHeight: props.pageData.maxHeight ? props.pageData.maxHeight : {},
          altText: props.pageData.altText ? props.pageData.altText : "",
          scrollImg: props.pageData.scrollImg
            ? props.pageData.scrollImg
            : false,
        });
      } else {
        props.updateLightBoxData({
          type: "Image",
          url: imagePath(props.pageData.image[parseInt(e.target.id)].src),
          refs: e.target,
          altText:
            props.pageData.altText &&
            props.pageData.altText[parseInt(e.target.id)]
              ? props.pageData.altText[parseInt(e.target.id)]
              : "",
          maxWidth:
            props.pageData.image &&
            props.pageData.image[parseInt(e.target.id)] &&
            props.pageData.image[parseInt(e.target.id)].maxWidth
              ? props.pageData.image[parseInt(e.target.id)].maxWidth
              : {},
          maxHeight:
            props.pageData.image &&
            props.pageData.image[parseInt(e.target.id)] &&
            props.pageData.image[parseInt(e.target.id)].maxHeight
              ? props.pageData.image[parseInt(e.target.id)].maxHeight
              : {},
          scrollImg:
            props.pageData.image &&
            props.pageData.image[parseInt(e.target.id)] &&
            props.pageData.image[parseInt(e.target.id)].scrollImg
              ? props.pageData.image[parseInt(e.target.id)].scrollImg
              : false,
        });
      }
    }

    if (props.isAssessment) {
      let windowObj = getCommonWindowObj();
      windowObj.assessmentImageClick = true;
      setCommonWindowObj();
    }
  };
  const onKeyDownHandler = (e) => {
    if(e.keyCode == 13 || e.keyCode == 32)
    {
      if (props.pageData.disableClick !== false) {
        props.updateShowLightBoxBool(true);
        if (typeof props.pageData.image !== "object") {
          props.updateLightBoxData({
            type: "Image",
            url: imagePath(props.pageData.image),
            refs: imgWithLabelRef,
            maxWidth: props.pageData.maxWidth ? props.pageData.maxWidth : {},
            maxHeight: props.pageData.maxHeight ? props.pageData.maxHeight : {},
            altText: props.pageData.altText ? props.pageData.altText : "",
            scrollImg: props.pageData.scrollImg
              ? props.pageData.scrollImg
              : false,
          });
        } else {
          // console.log(e.target)
          props.updateLightBoxData({
            type: "Image",
            url: imagePath(props.pageData.image[parseInt(e.target.id)].src),
            refs: e.target,
            altText:
              props.pageData.altText &&
              props.pageData.altText[parseInt(e.target.id)]
                ? props.pageData.altText[parseInt(e.target.id)]
                : "",
            maxWidth:
              props.pageData.image &&
              props.pageData.image[parseInt(e.target.id)] &&
              props.pageData.image[parseInt(e.target.id)].maxWidth
                ? props.pageData.image[parseInt(e.target.id)].maxWidth
                : {},
            maxHeight:
              props.pageData.image &&
              props.pageData.image[parseInt(e.target.id)] &&
              props.pageData.image[parseInt(e.target.id)].maxHeight
                ? props.pageData.image[parseInt(e.target.id)].maxHeight
                : {},
            scrollImg:
              props.pageData.image &&
              props.pageData.image[parseInt(e.target.id)] &&
              props.pageData.image[parseInt(e.target.id)].scrollImg
                ? props.pageData.image[parseInt(e.target.id)].scrollImg
                : false,
          });
        }
      }
      if (props.isAssessment) {
        let windowObj = getCommonWindowObj();
        windowObj.assessmentImageClick = true;
        setCommonWindowObj();
      }
    }
  };
  return (
    <div className='image-text-comp-wrapper'>
      {props.pageData.title && (
        <div role='heading' aria-level='1' className='image-text-comp-heading bodyHeading'>
          {Parser(props.pageData.title)}
        </div>
      )}
      {props.pageData.subTitle && (
        <div role='heading' aria-level='2' className='image-text-comp-subHeading bodyBoldSubHeading'>
          {Parser(props.pageData.subTitle)}
        </div>
      )}
      <div
        className={`image-text-comp-image`}
        style={{
          ...imgDivStyle,
        }}
      >
        {typeof props.pageData.image !== "object" ? (
          <img
            draggable={false}
            title={props.pageData.altText ? Parser(props.pageData.altText) : ""}
            src={imagePath(props.pageData.image)}
            className={"image-class 1"}
            alt={`image, ${
              props.pageData.altText
                ? props.pageData.altText.replace(/<\/?[^>]+(>|$)/g, "")
                : props.pageData.desc 
                ? props.pageData.desc.replace(/<\/?[^>]+(>|$)/g, "") 
                : ""
              }`}
            width={imageWidth}
            // role="button"
            onClick={onClickHandler}
            onKeyDown={onKeyDownHandler}
            tabindex={props.pageData.disableClick !== false
                        ? "0"
                        : "-1"}
            ref={imgWithLabelRef}
            style={
              props.pageData.style
                ? {
                    ...props.pageData.style,
                    cursor:
                      props.pageData.disableClick !== false
                        ? "pointer"
                        : "auto",
                  }
                : {
                    cursor:
                      props.pageData.disableClick !== false
                        ? "pointer"
                        : "auto",
                  }
            }
          />
        ) : (
          props.pageData.image.map((item, index) => {
            // console.log("item", item);
            return (
              <img
                draggable={false}
                id={index}
                // aria-label={`image,  ${
                //   item.altText
                //     ? item.altText.replace(/<\/?[^>]+(>|$)/g, "")
                //     : item.desc ? item.desc : ""
                // }`}
                title={`${
                  item.altText
                    ? item.altText.replace(/<\/?[^>]+(>|$)/g, "")
                    : item.desc 
                    ? item.desc.replace(/<\/?[^>]+(>|$)/g, "") 
                    : ""
                }`}
                src={imagePath(item.src)}
                className={"image-class img-array"}
                alt={`image, ${
                  item.altText
                    ? item.altText.replace(/<\/?[^>]+(>|$)/g, "")
                    : item.desc 
                    ? item.desc.replace(/<\/?[^>]+(>|$)/g, "") 
                    : ""
                }`}
                width={imageWidth}
                onClick={onClickHandler}
                ref={imgWithLabelRef}
                onKeyDown={onKeyDownHandler}
                tabindex="0"
                style={
                  item.style
                    ? { ...item.style, height: "fit-content" }
                    : { height: "fit-content" }
                }
              />
            );
          })
        )}
        {/* <map name="workmap">
          <area shape="rect" coords="34,44,270,350" alt="Computer" title="Computer">
          <area shape="rect" coords="290,172,333,250" alt="Phone" title="Phone">
          <area shape="circle" coords="337,300,44" alt="Cup of coffee" title="Cup of coffee">
        </map> */}
      </div>
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageWithHeading);
