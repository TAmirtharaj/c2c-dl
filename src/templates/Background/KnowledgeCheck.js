/** @format */

import React, { useState, useLayoutEffect, useEffect } from "react";
import "./Background.css";
import { returnComponent } from "../../createComponent/CreateComponent";
import { connect } from "react-redux";
import {
  triggerResize,
  getKCDataObj,
  setKCDataObj,
  getCommonWindowObj,
} from "../../helper/Helper";
import { withScorm } from "react-scorm-provider-v2";
import { getZoomClassList } from "../../helper/Helper";

const KnowledgeCheck = (props) => {
  const [question, setQuestion] = useState(0);
  let containerZoomClass = "page-title-container page-title ";
  containerZoomClass += getZoomClassList(props.zoomIndex, "center", "100");

  useEffect(() => {
    // console.log(
    //   "window obj recived",
    //   getCommonWindowObj().knowledgeCheckUserAttempt
    // );
    if (
      getCommonWindowObj().knowledgeCheckUserAttempt[
        props.templateData.kcRef
      ][1] !== 0
    )
      setQuestion(1);
  }, []);

  const updateResult = (result, attempt) => {
    if (attempt === 2) {
      props.visitedArray[props.currentSection][props.currentScene][
        props.currentSubScene
      ] = 2;
    } else {
      if (result) {
        if (question) {
          props.visitedArray[props.currentSection][props.currentScene][
            props.currentSubScene
          ] = 2;
        } else {
          props.visitedArray[props.currentSection][props.currentScene][
            props.currentSubScene
          ] = 2;
        }
      } else {
        props.visitedArray[props.currentSection][props.currentScene][
          props.currentSubScene
        ] = 0;
      }
    }

    props.updatePageArrayData(props.visitedArray);
    props.updatePageStatus();

    // setScreenNo(1);

    const obj = getKCDataObj();

    if (props.sco.apiConnected) {
      let windowObj = getCommonWindowObj();
      obj.knowledgeCheckUserSelection = windowObj.knowledgeCheckUserSelection;
      obj.knowledgeCheckQuestionStatus = windowObj.knowledgeCheckQuestionStatus;
      obj.knowledgeCheckUserAttempt = windowObj.knowledgeCheckUserAttempt;
      obj.knowledgeCheckCorrectStatus = windowObj.knowledgeCheckCorrectStatus;
      obj.isChallengeQuestion = windowObj.isChallengeQuestion;

      props.sco.setSuspendData("KCData", obj);
      // props.sco
      //   .setSuspendData(
      //     "knowledgeCheckUserSelection",
      //     window.knowledgeCheckUserSelection
      //   )
      //   .then((data) => {
      //     // console.log("Knowledge Check User Selection Status updated...");
      //     props.sco
      //       .setSuspendData(
      //         "knowledgeCheckQuestionStatus",
      //         window.knowledgeCheckQuestionStatus
      //       )
      //       .then((data) => {
      //         // console.log("Knowledge Check User challenge Question Status updated...");
      //         props.sco
      //           .setSuspendData(
      //             "knowledgeCheckUserAttempt",
      //             window.knowledgeCheckUserAttempt
      //           )
      //           .then((data) => {
      //             // console.log("Knowledge Check User Attempt Status updated...");
      //             props.sco
      //               .setSuspendData(
      //                 "knowledgeCheckCorrectStatus",
      //                 window.knowledgeCheckCorrectStatus
      //               )
      //               .then((data) => {
      //                 // console.log("Knowledge Check User Correct Status updated...");
      //               });
      //           });
      //       });
      //   });
    }
  };
  const updateShuffleStatus = () => {
    const obj = getKCDataObj();
    let windowObj = getCommonWindowObj();
    if (props.sco.apiConnected) {
      obj.knowledgeCheckShuffleStatus =
        getCommonWindowObj().knowledgeCheckShuffleStatus;
      obj.knowledgeCheckHintClicked = windowObj.knowledgeCheckHintClicked;
      obj.knowledgeCheckCorrectStatus = windowObj.knowledgeCheckCorrectStatus;
      obj.knowledgeCheckQuestionStatus = windowObj.knowledgeCheckQuestionStatus;
      obj.knowledgeCheckShuffleStatus = windowObj.knowledgeCheckShuffleStatus;
      obj.knowledgeCheckUserAttempt = windowObj.knowledgeCheckUserAttempt;
      obj.knowledgeCheckUserSelection = windowObj.knowledgeCheckUserSelection;
      obj.isChallengeQuestion = windowObj.isChallengeQuestion;
      props.sco.setSuspendData("KCData", obj);
      // props.sco
      //   .setSuspendData(
      //     "knowledgeCheckShuffleStatus",
      //     window.knowledgeCheckShuffleStatus
      //   )
      //   .then((data) => {
      //     // console.log("Knowledge Check Shuffle Status updated...")
      //   });
    }
  };
  const onChallengeQuestion = () => {
    setQuestion(1);
    console.log("on challenge question called", question);
  };
  const onHint = () => {
    let obj = getKCDataObj();
    let windowObj = getCommonWindowObj();
    if (props.sco.apiConnected) {
      obj.knowledgeCheckHintClicked = windowObj.knowledgeCheckHintClicked;
      obj.knowledgeCheckCorrectStatus = windowObj.knowledgeCheckCorrectStatus;
      obj.knowledgeCheckQuestionStatus = windowObj.knowledgeCheckQuestionStatus;
      obj.knowledgeCheckShuffleStatus = windowObj.knowledgeCheckShuffleStatus;
      obj.knowledgeCheckUserAttempt = windowObj.knowledgeCheckUserAttempt;
      obj.knowledgeCheckUserSelection = windowObj.knowledgeCheckUserSelection;
      obj.isChallengeQuestion = windowObj.isChallengeQuestion;

      // console.log("KC Hint clicked:", window.knowledgeCheckHintClicked, obj);
      console.log("hint click KCdata stored on server :", obj);
      console.log("hint click KCdata window Obj", windowObj);
      props.sco.setSuspendData("KCData", obj);
      // props.sco
      //   .setSuspendData(
      //     "knowledgeCheckHintClicked",
      //     window.knowledgeCheckHintClicked
      //   )
      //   .then((data) => {
      //     // console.log("Knowledge Check Hint Clicked Status updated...")
      //   });
    }
    props.updateShowLightBoxBool(true);
    props.updateLightBoxData({
      type: "KnowledgeCheckFeedback",
      data: props.templateData.hintData[question],
    });
  };

  // let Components2 = [];

  // if (screenNo === 1) {
  //   Components2 = returnComponent(props.templateData.pageData[screenNo]);
  // }

  // console.log(question, 'in KnowledgeCheck')
  const Components1 = returnComponent(props.templateData.pageData[question], {
    updateResult,
    kcRef: props.templateData.kcRef,
    updatePageStatus: props.updatePageStatus,
    onChallengeQuestion,
    onHint,
    isChallengeQuestion: question,
    updateShuffleStatus,
  });

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
        <div role='heading' aria-level='1' className={containerZoomClass}>
          {props.templateData.pageData[question].pageTitle}
        </div>
      )}
      <div
        className={`${
          !props.templateData.showPageTitle
            ? "page-with-title-main-content-container"
            : "page--without-title-main-content-container"
        }`}
      >
        {Components1}
      </div>
      {/* <div className="teamplate-left-container">{Components1}</div> */}
      {/* <div className="teamplate-right-container">{Components2}</div> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentSection: state.currentSection,
    currentScene: state.currentScene,
    currentSubScene: state.currentSubScene,
    visitedArray: state.visitedArray,
    zoomIndex: state.zoomIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageArrayData: (data) =>
      dispatch({ type: "UPDATE_PAGE_ARRAY", payload: data }),
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(KnowledgeCheck)
);
