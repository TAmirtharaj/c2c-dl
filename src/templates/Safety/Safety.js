import React, { useLayoutEffect, useEffect } from "react";
import "./Safety.css";
import { connect } from "react-redux";
import { returnComponent } from "../../createComponent/CreateComponent";
import { useSelector } from "react-redux";
import {
  triggerResize,
  getZoomClassList,
  BrowserDetect,
  labNoteBookZoomLineheight,
} from "../../helper/Helper";
import { withScorm } from "react-scorm-provider-v2";

const Safety = (props) => {
  // const Components = [];
  const Components1 = [];
  const Components2 = [];
  let leftZoomClass = "teamplate-left-container ";
  let rightZoomClass = "teamplate-right-container ";

  // useEffect(() => {
  //   if (!props.preLabStatus && window.isNextPagePrelab !== false) {
  //     props.updateNextClicked(true);
  //   } else {
  //     props.updateNextClicked(false);
  //   }
  // }, []);

  const zoomIndex = useSelector((state) => state.zoomIndex);

  useEffect(() => {
    let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
      zoomContent = { fontSize: 0.95, lineHeight: 1.5 };
    if (zoomIndex === 1) {
      zoomContent = { fontSize: 0.95, lineHeight: 1.5 };
      zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
    } else if (zoomIndex === 2) {
      zoomContent = { fontSize: 1.05, lineHeight: 1.6 };
      zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
    } else {
      zoomContent = { fontSize: 1.15, lineHeight: 1.7 };
      zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
    }

    labNoteBookZoomLineheight(
      document.querySelectorAll(".page-title-container"),
      zoomHeader
    );
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

  props.templateData.pageData.forEach((data) => {
    if (data.containerType === "rightContainer") {
      Components2.push(returnComponent(data));
    } else {
      Components1.push(
        returnComponent(data, {
          style: { width: "100%" },
        })
      );
    }
  });

  if (!BrowserDetect.isMobile()) {
    rightZoomClass +=
      getZoomClassList(props.zoomIndex, "right") + " row overWriteRowProps";
    leftZoomClass += getZoomClassList(props.zoomIndex, "left");
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
    // console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });
  return (
    <div className='container-padding safety-comp-container'>
      {!props.templateData.showPageTitle && (
        <div role='heading' aria-level='1' className='page-title-container page-title'>
          {props.templateData.pageTitle}
        </div>
      )}
      <div
        className={`${
          !props.templateData.showPageTitle
            ? "page-with-title-main-content-container"
            : "page-without-title-main-content-container"
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
    preLabStatus: state.preLabStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateNextClicked: (data) =>
      dispatch({
        type: "UPDATE_NEXT_DISABLE_BOOL",
        payload: data,
      }),
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(Safety)
);
