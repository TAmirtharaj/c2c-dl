/** @format */

import React, { useEffect } from "react";
import Parser from "html-react-parser";
import "./PlainText.css";
import { imagePath } from "../helper/Helper";

const PlainText = (props) => {
  const PlainTextComponent = () => {
    return (
      <div
        className={`plain-text-comp-wrapper ${
          props.classList ? props.classList : ""
        }`}
        style={{ textAlignLast: isInLab ? "center" : "left" }}
      >
        {props.pageData.title && (
          <div role="heading" aria-level="1" className='plain-text-comp-heading bodyHeading'>
            {Parser(props.pageData.title)}
          </div>
        )}
        {props.pageData.subTitle && (
          <div role='heading' aria-level='2' className='plain-text-comp-heading bodyBoldSubHeading'>
            {Parser(props.pageData.subTitle)}
          </div>
        )}

        {props.pageData.text && (
          <div
            className='plain-text-comp-para bodyPara'
            style={{ textAlignLast: "left" }}
          >
            {props.pageData.image && (
              <img
                draggable={false}
                className='plain-img-comp-img'
                src={imagePath(props.pageData.image)}
                alt={`image, ${
                  props.pageData.image ? props.pageData.image.split("/")[1] : ""
                }`}
              />
            )}
            {Parser(props.pageData.text)}
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
    if (typeof props.updatePageStatus === "function")
      props.updatePageStatus(true);
  }, []);
  let isInLab =
    props.classList === " lab-plain-text"
      ? true
      : false; /*Align the title to center if it is in lab notebook*/
  if (props.pageData.isOrderedList) {
    return (
      <ol className='plain-text-ordered-list'>
        <PlainTextComponent></PlainTextComponent>
      </ol>
    );
  } else {
    return (
      <>
        <PlainTextComponent></PlainTextComponent>
      </>
    );
  }
};

export default PlainText;
