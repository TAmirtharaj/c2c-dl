/** @format */

import React, { useState, useEffect, useLayoutEffect } from "react";
import { withScorm } from "react-scorm-provider-v2";
import "./Assessment.css";
import { returnComponent } from "../../createComponent/CreateComponent";
import { shuffleArray } from "../../shuffleArray/shuffleArray";
import {
  updateAssessmetStatus,
  getZoomClassList,
  BrowserDetect,
  setScroll,
  getSCORef,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../../helper/Helper";
import Image from "../../components/ImageWithHeading";

import { connect } from "react-redux";
import DataTable from "../../components/DataTable";

const Assessment = (props) => {
  const [currentQue, setCurrentQue] = useState(0);
  let qCounter = 0;
  let windowObj = getCommonWindowObj();
  const bgHeaderBand = document.querySelector(".bgHeaderBand");
  if (bgHeaderBand) {
    bgHeaderBand.addEventListener("click", () => {
      windowObj.zoomState = true;
    });
    setCommonWindowObj(windowObj);
  }
  useEffect(() => {
    // console.log(
    //   "assessment props",
    //   document.querySelector(".kc-drag-and-drop")
    // );
    if (!props.showLightBox) {
      if (document.querySelector(".kc-drag-and-drop")) {
        if (document.querySelector(".ContentZoomHolder")) {
          document
            .querySelector(".ContentZoomHolder")
            .classList.add("disable-button");

          document.getElementById("circle_1").disabled = true;
        }
      } else {
        if (document.querySelector(".ContentZoomHolder")) {
          document
            .querySelector(".ContentZoomHolder")
            .classList.remove("disable-button");
          document.getElementById("circle_1").disabled = false;
        }
      }
    }
  });

  useLayoutEffect(() => {
    console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });

  let leftZoomClass = "assessment-comp-left-container ";
  let rightZoomClass = "teamplate-right-container ";
  let questionTitleZoomClass = "assessment-page-title-container page-title ";

  /**
   * If the assessment screen number is 0, then update the assessment screen number to 1, set the current
   * question to 0, and update the assessment started boolean to true.
   *
   * If the assessment status is failed, then update the scene to 1 and the sub scene to 0.
   *
   * If the assessment status is passed, then update the assessment screen number to 2 and update the
   * assessment started boolean to false.
   */
  const onClick = () => {
    const bodyContainer = document.querySelector(".bodyContainer");
    bodyContainer.scrollTop = 0;
    setScroll(0);
    windowObj = getCommonWindowObj();
    windowObj.zoomState = false;
    setCommonWindowObj(windowObj);
    if (props.assessmentScreenNum === 0) {
      props.updateAssessmentScreenNum(1);
      setCurrentQue(0);
      props.updateAssessmentStartedBool(true);
    } else if (props.assessmentStatus === "failed") {
      props.updateScene(1); // jump to overview screen
      props.updateSubScene(0);
    } else if (props.assessmentStatus === "passed") {
      props.updateAssessmentScreenNum(2);
      props.updateAssessmentStartedBool(false);
    }
  };

  let Components1, Components2, imageComponent, tableComponent;

  if (
    props.templateData.pageData[props.assessmentScreenNum].hasOwnProperty(
      "assestmentData"
    )
  ) {
    const totalQues =
      props.templateData.pageData[props.assessmentScreenNum].assestmentData
        .length;
    // shuffle questions
    if (currentQue === 0) {
      if (props.assessmentArray === null) {
        props.templateData.pageData[props.assessmentScreenNum].assestmentData =
          shuffleArray(
            props.templateData.pageData[props.assessmentScreenNum]
              .assestmentData
          );
        props.updateAssessmentArray(
          props.templateData.pageData[props.assessmentScreenNum].assestmentData
        );
      } else {
        props.templateData.pageData[props.assessmentScreenNum].assestmentData =
          props.assessmentArray;
      }
    }

    const loadNextQue = () => {
      console.log("loading next");

      // if (currentQue < totalQues - 1) {
      //   setCurrentQue((prev) => prev + 1);
      // }
      let windowObj = getCommonWindowObj();
      if (
        !windowObj.assessmentImageClick ||
        windowObj.assessmentImageClick === undefined
      ) {
        if (currentQue < totalQues - 1) {
          setCurrentQue((prev) => prev + 1);
        }
      } else {
        if (currentQue < totalQues - 1) {
          setCurrentQue((prev) => prev);
        }
      }

      if (currentQue === totalQues - 1) {
        const assessmentStatus = props.templateData.pageData[
          props.assessmentScreenNum
        ].assestmentData.every((pgData) => pgData.result === true);

        props.updateAssessmentStatus(assessmentStatus ? "passed" : "failed");
        let counter = 0;
        for (let i = 0; i < totalQues; i++) {
          if (
            props.templateData.pageData[props.assessmentScreenNum]
              .assestmentData[i].result === true
          ) {
            counter += 1;
          }
        }

        const score = counter / totalQues;
        // ----------------------
        if (assessmentStatus) {
          updateAssessmetStatus(props.sco, "passed", score);
          props.updateAssessmentScreenNum(2);
          props.updateAssessmentStartedBool(false);
          props.updateAssessmentScore(score);
        } else {
          updateAssessmetStatus(props.sco, "failed", score);
          props.updateAssessmentScreenNum(3);
          props.updateAssessmentScore(score);
        }
        //-----------------------
      }
    };

    const updateResult = (_bool) => {
      props.templateData.pageData[props.assessmentScreenNum].assestmentData[
        currentQue
      ].result = _bool;
    };

    // check if all questions are attempted or not on the basis of result property
    const isAllQueAttempted = props.templateData.pageData[
      props.assessmentScreenNum
    ].assestmentData.every((pgData) => pgData.hasOwnProperty("result"));

    // show current question if it is not attempted or it's previous attempted is wrong
    const showCurrentQue =
      !isAllQueAttempted ||
      !props.templateData.pageData[props.assessmentScreenNum].assestmentData[
        currentQue
      ].hasOwnProperty("result") ||
      !props.templateData.pageData[props.assessmentScreenNum].assestmentData[
        currentQue
      ].result;

    windowObj = getCommonWindowObj();
    if (
      props.templateData.pageData[props.assessmentScreenNum].containerType ===
      "rightContainer"
    ) {
      if (showCurrentQue || windowObj.assessmentImageClick) {
        console.log("right cconatiner");
        Components2 = returnComponent(
          props.templateData.pageData[props.assessmentScreenNum].assestmentData[
            currentQue
          ],
          {
            loadNextQue,
            updateResult,
            totalQues,
            currentQue,
          }
        );
      } else {
        // if (!window.assessmentImageClick || window.assessmentImageClick === undefined)
        loadNextQue();
      }
    } else {
      if (
        props.templateData.pageData[props.assessmentScreenNum].assestmentData[
          currentQue
        ].imageData
      ) {
        imageComponent = (
          <Image
            pageData={
              props.templateData.pageData[props.assessmentScreenNum]
                .assestmentData[currentQue].imageData
            }
            isAssessment={true}
          />
        );
      }

      if (
        props.templateData.pageData[props.assessmentScreenNum].assestmentData[
          currentQue
        ].dataTable
      ) {
        tableComponent = (
          <DataTable
            pageData={
              props.templateData.pageData[props.assessmentScreenNum]
                .assestmentData[currentQue].dataTable
            }
            isAssessment={true}
          />
        );
      }
      if (
        windowObj.zoomState ||
        showCurrentQue ||
        windowObj.assessmentImageClick
      ) {
        console.log("left cconatiner next que load");
        Components1 = returnComponent(
          props.templateData.pageData[props.assessmentScreenNum].assestmentData[
            currentQue
          ],
          {
            loadNextQue,
            updateResult,
            totalQues,
            currentQue,
          }
        );
      } else {
        // if (!window.assessmentImageClick || window.assessmentImageClick === undefined)
        console.log("here");
        loadNextQue();
      }
    }
  } else {
    // console.log("here");
    if (
      props.templateData.pageData[props.assessmentScreenNum].containerType ===
      "rightContainer"
    ) {
      Components2 = returnComponent(
        props.templateData.pageData[props.assessmentScreenNum],
        {
          onClick,
        }
      );
    } else {
      Components1 = returnComponent(
        props.templateData.pageData[props.assessmentScreenNum],
        {
          onClick,
          updatePageStatus:
            props.assessmentScreenNum !== 0 ? props.updatePageStatus : null,
        }
      );
    }
  }

  useEffect(() => {
    if (props.assessmentStatus === "passed") {
      props.updateAssessmentScreenNum(2);
    }
    return () => {
      // Anything in here is fired on component unmount.
      props.updateAssessmentScreenNum(0);
      // setCurrentQue(0);
      props.updateAssessmentStartedBool(false);
    };
  }, []);

  // console.log(currentQue, "useEffect of assessment");

  if (!BrowserDetect.isMobile()) {
    // console.log(
    //   "zoom class",
    //   props,
    //   props.templateData.pageData[props.assessmentScreenNum]
    // );
    rightZoomClass += getZoomClassList(props.zoomIndex, "right");
    leftZoomClass += getZoomClassList(props.zoomIndex, "left");
    questionTitleZoomClass += getZoomClassList(
      props.zoomIndex,
      "center",
      "100"
    );
  }

  const screenRatio = props.templateData.pageData[props.assessmentScreenNum]
    .assestmentData
    ? props.templateData.pageData[props.assessmentScreenNum].assestmentData[
        currentQue
      ].screenRatio
      ? props.templateData.pageData[props.assessmentScreenNum].assestmentData[
          currentQue
        ].screenRatio
      : [70, 30]
    : [70, 30];

  console.log("left ratio ", `${screenRatio[0]}%`);
  return (
    <div className='container-padding assessment-comp-container'>
      {props.assessmentScreenNum === 1 && (
        <div role='heading' aria-level='1' className={questionTitleZoomClass}>{`Question ${Number(
          currentQue + 1
        )}`}</div>
      )}
      <div className='assessment-page-with-title-main-content-container'>
        {Components1 !== undefined && (
          <div
            className={leftZoomClass}
            style={{ width: `${screenRatio[0]}%` }}
          >
            {Components1}{" "}
          </div>
        )}
        {
          <div
            className={rightZoomClass}
            style={{ width: `calc(${screenRatio[1]}% - 16px)` }}
          >
            {imageComponent !== undefined && imageComponent}
            {tableComponent !== undefined && tableComponent}
            {Components2 !== undefined && Components2}
          </div>
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    assessmentStatus: state.assessmentStatus,
    assessmentStartedBool: state.assessmentStartedBool,
    assessmentScreenNum: state.assessmentScreenNum,
    assessmentArray: state.assessmentArray,
    zoomIndex: state.zoomIndex,
    showLightBox: state.showLightBox,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateScene: (data) => dispatch({ type: "UPDATE_SCENE", payload: data }),
    updateSubScene: (data) =>
      dispatch({ type: "UPDATE_SUB_SCENE", payload: data }),
    updateAssessmentStatus: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_STATUS", payload: data }),
    updateAssessmentScore: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_SCORE", payload: data }),
    updateAssessmentStartedBool: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_STARTED_BOOL", payload: data }),
    updateAssessmentScreenNum: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_SCREEN_NUM", payload: data }),
    updateAssessmentArray: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_ARRAY", payload: data }),
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(Assessment)
);
