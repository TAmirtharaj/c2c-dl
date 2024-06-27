import React, { useLayoutEffect } from "react";
import { returnComponent } from "../../createComponent/CreateComponent";
import { withScorm } from "react-scorm-provider-v2";
import { connect } from "react-redux";
import { getZoomClassList, BrowserDetect } from "../../helper/Helper";

const AssessmentIntroduction = (props) => {
  const onClick = () => {
    props.updateSubScene(props.currentSubScene + 1);
  };

  useLayoutEffect(() => {
    // console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });

  const Components1 = [];
  const Components2 = [];

  let leftZoomClass = "teamplate-left-container ";
  let rightZoomClass = "teamplate-right-container ";

  props.templateData.pageData.forEach((data) => {
    if (data.containerType === "rightContainer") {
      Components2.push(
        returnComponent(data, {
          onClick,
        })
      );
    } else {
      Components1.push(
        returnComponent(data, {
          onClick,
        })
      );
    }
  });

  if (!BrowserDetect.isMobile()) {
    rightZoomClass += getZoomClassList(props.zoomIndex, "right");
    leftZoomClass += getZoomClassList(props.zoomIndex, "left");
  }

  return (
    <div className='container-padding assessment-intro-comp-container'>
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
    // currentSection: state.currentSection,
    // currentScene: state.currentScene,
    currentSubScene: state.currentSubScene,
    zoomIndex: state.zoomIndex,
    // visitedArray: state.visitedArray,
    // assessmentStatus: state.assessmentStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // updatePageArrayData: (data) =>
    //   dispatch({ type: "UPDATE_PAGE_ARRAY", payload: data }),
    // updateScene: (data) => dispatch({ type: "UPDATE_SCENE", payload: data }),
    updateSubScene: (data) =>
      dispatch({ type: "UPDATE_SUB_SCENE", payload: data }),
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
    // updateAssessmentStatus: (data) =>
    //   dispatch({ type: "UPDATE_ASSESSMENT_STATUS", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(AssessmentIntroduction)
);
