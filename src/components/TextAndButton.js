import React, { useEffect } from "react";
import Parser from "html-react-parser";
import CustomButton from "./CustomButton";
import "./TextAndButton.css";
import { labNoteBookZoomLineheight } from "../helper/Helper";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

const TextAndButton = (props) => {
  const zoomIndex = useSelector((state) => state.zoomIndex);

  useEffect(() => {
    if (typeof props.updatePageStatus === "function")
      props.updatePageStatus(true);
  }, []);

  useEffect(() => {
    let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
      zoomContent = { fontSize: 0.95, lineHeight: 1.5 };
    if (zoomIndex === 1) {
      zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
      zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
    } else if (zoomIndex === 2) {
      zoomContent = { fontSize: 1.05, lineHeight: 1.4 };
      zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
    } else {
      zoomContent = { fontSize: 1.15, lineHeight: 1.5 };
      zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
    }

    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".text-and-button-comp-heading"),
    //   zoomHeader
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".text-and-button-comp-para"),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".drop-text"),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".mcss-comp-heading "),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".dropped"),
    //   zoomContent
    // );
  }, [zoomIndex]);
  return (
    <div
      className={
        props.pageData.containerType === "rightContainer"
          ? "text-and-button-comp-wrapper-right"
          : "text-and-button-comp-wrapper-left"
      }
    >
      {props.pageData.title && (
        <div role='heading' aria-level='1' className='text-and-button-comp-heading bodyHeading'>
          {Parser(props.pageData.title)}
        </div>
      )}
      {props.pageData.text && (
        <div className='text-and-button-comp-para bodyPara'>
          {Parser(props.pageData.text)}
        </div>
      )}

      <CustomButton
        className='text-and-button-comp-button bodyButtonLabel'
        id={Parser(props.pageData.btnTitle)}
        title={Parser(props.pageData.btnTitle)}
        ariaLabel={`${props.pageData.title} ${props.pageData.btnTitle}`}
        ariaHidden='false'
        onClick={props.onClick}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
  };
};
export default connect(mapStateToProps, null)(TextAndButton);
