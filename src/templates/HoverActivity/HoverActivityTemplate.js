/** @format */

import React, { useLayoutEffect } from "react";
import "./HoverActivityTemplate.css";
import { connect } from "react-redux";
import { returnComponent } from "../../createComponent/CreateComponent";
import {
  triggerResize,
  getZoomClassList,
  BrowserDetect,
} from "../../helper/Helper";

const HoverActivityTemplate = (props) => {
  const Components1 = [];
  const Components2 = [];
  console.log(props);

  let leftZoomClass = "hover-left-container ";
  let rightZoomClass = "hover-right-container ";
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
        <div
          className={leftZoomClass}
          style={{ width: `calc(${props.templateData.ratio[0]}% - 25px)` }}
        >
          {Components1}
        </div>
        <div
          className={rightZoomClass}
          style={{ width: `calc(${props.templateData.ratio[1]}% - 15px)` }}
        >
          {Components2}
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HoverActivityTemplate);
