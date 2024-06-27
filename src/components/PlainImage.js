/** @format */

import React from "react";
import Parser from "html-react-parser";
import { imagePath, BrowserDetect } from "../helper/Helper";
import "./PlainImage.css";
import { connect } from "react-redux";
import { Card } from "react-bootstrap";

const PlainImage = (props) => {
  const image = imagePath(props.pageData.image);
  const altText = props.pageData.altText
    ? props.pageData.altText
    : "stopwatch symbol";
  const isDevice = BrowserDetect.isMobile();
  const classList = isDevice
    ? "plain-img-comp-wrapper-for-mobile"
    : "plain-img-comp-wrapper";
  // console.count(props);
  // console.log(props.pageData);
  return (
    <div
      className={classList}
      style={
        props.pageData.image && { alignItems: "center" } && props.pageData.style
          ? props.pageData.style
          : {}
      }
    >
      {props.pageData.title && (
        <div
          className="plain-img-comp-title"
          style={{ position: "relative", top: "-3px" }}
        >
          {Parser(props.pageData.title)}
        </div>
      )}

      {/* for multiple images  */}
      {props.pageData.image ? (
        typeof props.pageData.image === "object" ? (
          props.pageData.image.map((item, index) => {
            if (typeof item === "object") {
              return (
                <img
                  draggable={false}
                  id={index}
                  title={`${item.altText.replace(/<\/?[^>]+(>|$)/g, "")}`}
                  className={`plain-img-comp-img plain-img-comp-img_${index}`}
                  src={imagePath(item.img)}
                  alt={`image, ${item.altText.replace(/<\/?[^>]+(>|$)/g, "")}`}
                  style={
                    { width: item.imgWidth ? item.imgWidth : "auto" } &&
                    item.style
                  }
                />
              );
            } else {
              return (
                <img
                  draggable={false}
                  id={index}
                  title={`${altText.replace(/<\/?[^>]+(>|$)/g, "")}`}
                  className={`plain-img-comp-img plain-img-comp-img_${index}`}
                  src={imagePath(item)}
                  alt={`image, ${altText.replace(/<\/?[^>]+(>|$)/g, "")}`}
                  style={{ width: props.pageData.imgWidth }}
                />
              );
            }
          })
        ) : (
          <img
            draggable={false}
            className={`plain-img-comp-img ${
              props.pageData.className ? props.pageData.className : ""
            }`}
            src={image}
            title={` ${altText.replace(/<\/?[^>]+(>|$)/g, "")}`}
            alt={`image, ${altText.replace(/<\/?[^>]+(>|$)/g, "")}`}
            style={{ width: props.pageData.imgWidth }}
          />
        )
      ) : (
        ""
      )}
      {props.pageData.text && (
        <div className="plain-img-text bodyPara">
          {Parser(props.pageData.text)}
        </div>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlainImage);
