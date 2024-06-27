import React from "react";
import Parser from "html-react-parser";
import "./Feedback.css";
import {
  BrowserDetect,
  getCommonWindowObj,
  imagePath,
  setCommonWindowObj,
} from "../helper/Helper";
const Feedback = (props) => {
  // console.log(props.pageData?props.pageData:"NULL")
  return (
    <div className="feedback-comp-wrapper">
      <div role='heading' aria-level='2' className="mcss-comp-heading bodyMediumSubHeading">
        {Parser(props.pageData.title)}
      </div>
      <div className="feedback-comp-box feedback-comp-heading bodyPara">
        {props.pageData.img && (
          <div className='lightbox-content-knowledgecheck-image-container '>
            {typeof props.pageData.img === "string" ? (
              <img
                draggable={false}
                src={imagePath(props.pageData.img)}
                style={{
                  width: "100%",
                  marginBottom: "0px",
                }}
                title={`${
                  !props.pageData.alt
                    ? ``
                    : props.pageData.alt.replace(/<\/?[^>]+(>|$)/g, "")
                }`}
                alt={`image, ${
                  !props.pageData.alt
                    ? ``
                    : props.pageData.alt.replace(/<\/?[^>]+(>|$)/g, "")
                }`}
              ></img>
            ) : (
              props.pageData.img.map((img, i) => (
                <img
                  draggable={false}
                  key={i}
                  src={imagePath(img.src)}
                  style={{
                    width: img.maxWidth ? img.maxWidth : "",
                    height: img.maxHeight ? img.maxHeight : "",
                    marginBottom: `${!props.pageData.text ? "0px" : "16px"}`,
                    // marginRight: "15px",
                    // marginRight: "5px",
                    verticalAlign: "top",
                    // marginLeft: "5px",
                  }}
                  title={`${
                    !img.alt ? `` : img.alt.replace(/<\/?[^>]+(>|$)/g, "")
                  }`}
                  alt={`image, ${
                    !img.alt ? `` : img.alt.replace(/<\/?[^>]+(>|$)/g, "")
                  }`}
                ></img>
              ))
            )}
          </div>
        )}
        <div>{props.pageData.text?Parser(props.pageData.text):""}</div></div>
    </div>
  );
};

export default Feedback;
