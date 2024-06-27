import React, { useLayoutEffect } from "react";
import "./Materials.css";
import { connect } from "react-redux";
import { returnComponent } from "../../createComponent/CreateComponent";
import { getZoomClassList, BrowserDetect } from "../../helper/Helper";

const Materials = (props) => {
  const Components1 = [];
  const Components2 = [];

  let leftZoomClass = "material-comp-left-container ";
  let rightZoomClass = "material-comp-right-container ";

  props.templateData.pageData.forEach((data) => {
    if (data.containerType === "rightContainer") {
      Components2.push(returnComponent(data));
    } else {
      data.updatePageStatus = props.updatePageStatus;
      Components1.push(
        returnComponent(data, { updatePageStatus: props.updatePageStatus })
      );
    }
  });

  if (!BrowserDetect.isMobile()) {
    rightZoomClass += getZoomClassList(props.zoomIndex, "right", "25");
    leftZoomClass += getZoomClassList(props.zoomIndex, "left", "75");
  }

  useLayoutEffect(() => {
    console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });
  return (
    <div className='container-padding material-comp-container'>
      {!props.templateData.showPageTitle && (
        <div role='heading' aria-level='1' className='page-title-container page-title'>
          {props.templateData.pageTitle}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Materials);
