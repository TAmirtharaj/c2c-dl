/** @format */

import React, { useLayoutEffect } from "react";
import "./Background.css";
import { connect } from "react-redux";
import { returnComponent } from "../../createComponent/CreateComponent";
import {
  triggerResize,
  getZoomClassList,
  BrowserDetect,
} from "../../helper/Helper";
import { useEffect } from "react";

const Background = (props) => {
  const Components1 = [];
  const Components2 = [];

  let leftZoomClass = "teamplate-left-container ";
  let rightZoomClass = "teamplate-right-container ";
  let bodyTitleClass = "page-title-container page-title ";
  props.templateData.pageData.forEach((data) => {
    if (data.containerType === "rightContainer") {
      Components2.push(returnComponent(data));
    } else {
      Components1.push(returnComponent(data));
    }
  });

  if (!BrowserDetect.isMobile()) {
    rightZoomClass += getZoomClassList(props.zoomIndex, "right");
    leftZoomClass += getZoomClassList(props.zoomIndex, "left");
  }

  if (!BrowserDetect.isMobile()) {
    bodyTitleClass += getZoomClassList(props.zoomIndex, "bodyTitle");
  }
  useLayoutEffect(() => {
    function callResize() {
      setTimeout(() => {
        triggerResize();
      }, 100);
    }
    callResize();
  }, []);

  useLayoutEffect(() => {
    console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });
  return (
    <div className='container-padding background-comp-container'>
      {!props.templateData.showPageTitle && (
        <div role='heading' aria-level='1' className={bodyTitleClass}>{props.templateData.pageTitle}</div>
      )}
      <div
        className={`${
          !props.templateData.showPageTitle
            ? "page-with-title-main-content-container"
            : "page--without-title-main-content-container"
        }`}
      >
        <div className={leftZoomClass}>{Components1}</div>
        <div className={rightZoomClass}>{Components2}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Background);
