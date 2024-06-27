/** @format */

import React, { useLayoutEffect } from "react";
import "./ActivityAndPreparation.css";
import { connect } from "react-redux";
import Steps from "./Steps";
import { getZoomClassList, BrowserDetect } from "../../helper/Helper";
import { withScorm } from "react-scorm-provider-v2";

const ActivityAndPreparation = (props) => {
  console.log("activity props", props.templateData.keyID);
  let containerZoomClass = "container-padding ";
  let stepBreak = 0,
    stepStyle;
  if (!BrowserDetect.isMobile()) {
    containerZoomClass += getZoomClassList(props.zoomIndex, "center", "100");
  }

  useLayoutEffect(() => {
    console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });

  const bgHeaderClick = (e) => {
    console.log("tagerrrrrrrrrrrr", e.target.closest(".icon-button"));
    if (
      e.target.closest(".icon-button") ||
      e.target.closest(".labNoteBookWrapper")
    ) {
      // getScroll();
    }
    bgHeaderBand.removeEventListener("click", bgHeaderClick);
  };
  const bgHeaderBand = document.querySelector(".bgHeaderBand");
  if (bgHeaderBand) {
    bgHeaderBand.addEventListener("click", bgHeaderClick);
  }

  const activityClick = (e) => {
    // console.log("target------------------", e.target);
    // e.preventDefault();
    if (
      e.target.classList.contains("glossary-text") ||
      e.target.classList.contains("resource-text") ||
      e.target.classList.contains("image-class") ||
      e.target.classList.contains("step-comp-step-label-col-width") ||
      e.target.classList.contains("image-text-comp-image-img") ||
      e.target.classList.contains("data-table-title")
    ) {
      // console.log("found------------------", e.target);
      // getScroll();
    }

    ActivityAndPreparation.removeEventListener("click", activityClick);
  };
  const ActivityAndPreparation = document.querySelector(".bodyContainer");
  if (ActivityAndPreparation) {
    ActivityAndPreparation.addEventListener("click", activityClick);
  }

  const iButton = document.querySelector(".info-button");
  if (iButton) {
    iButton.addEventListener("click", (e) => {
      // getScroll();
    });
  }
  // if (props.sco.apiConnected) {
  //   const suspendData = props.sco.suspendData;
  //   // window.btnState = suspendData.btnState
  //   //   ? suspendData.btnState
  //   //   : window.btnState;
  //   window.scrollState = window.scrollState ? window.scrollState : [];
  //   window.scrollState[`${props.templateData.keyID}`] = suspendData[
  //     `scrollState${props.templateData.keyID}`
  //   ]
  //     ? suspendData[`scrollState${props.templateData.keyID}`]
  //     : window.scrollState[`${props.templateData.keyID}`];

  //   console.log("scorm data----------", suspendData, window.scrollState);
  //   const bodyContainer = document.querySelector(".bodyContainer");
  //   if (
  //     bodyContainer &&
  //     window.scrollState &&
  //     window.scrollState[`${props.templateData.keyID}`]
  //   ) {
  //     // console.log("scroll value set", window.scrollState[`${props.keyID}`]);
  //     bodyContainer.scrollTop =
  //       window.scrollState[`${props.templateData.keyID}`];
  //   }
  // }

  return (
    <div className={containerZoomClass}>
      <div className="activity-and-preparation-comp-wrapper">
        {props.templateData.pageData.map((comp, index) => {
          comp.forEach((item) => {
            // console.log(item);
            if (item.startNewNumber) stepBreak = index;
            stepStyle = item.stepStyle ? item.stepStyle : {};
          });
          // console.log(stepStyle);
          return (
            <Steps
              stepCount={index + 1 - stepBreak}
              stepBreak={stepBreak}
              index={index + 1}
              stepStyle={stepStyle}
              content={comp}
              key={`steps_${index}`}
              keyID={props.templateData.keyID}
            />
          );
        })}
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

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(ActivityAndPreparation)
);
