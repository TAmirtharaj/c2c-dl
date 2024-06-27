/** @format */

import React from "react";
import Parser from "html-react-parser";
import "./BodyTitle.css";
import { connect } from "react-redux";
import { getZoomClassList, BrowserDetect } from "../helper/Helper";

const BodyTitle = (props) => {
  // console.log('BODY TITLE', props)
  let bodyTitleClass = "bodyTitleText ";

  if (!BrowserDetect.isMobile()) {
    bodyTitleClass += getZoomClassList(props.zoomIndex, "bodyTitle");
  }
  return <div role="heading" aria-level="1" className={bodyTitleClass}>{Parser(props.data.pageTitle)}</div>;
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex
  };
};

export default connect(mapStateToProps, null)(BodyTitle);
