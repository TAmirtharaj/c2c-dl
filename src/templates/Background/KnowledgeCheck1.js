import React, { useState, useLayoutEffect } from "react";
import "./Background.css";
import { returnComponent } from "../../createComponent/CreateComponent";
import { connect } from "react-redux";
import { triggerResize } from "../../helper/Helper";
import { withScorm } from "react-scorm-provider-v2";

const KnowledgeCheck1 = (props) => {
  // const [screenNo, setScreenNo] = useState(0);

  // console.log("KnowledgeCheck", props);/
  const [question, setQuestion] = useState(0);
  const updateResult = (result, attempt) => {
    // if(result)
    // props.visitedArray[props.currentSection][props.currentScene][
    //   props.currentSubScene
    // ] = 2;
    // props.updatePageArrayData(props.visitedArray);

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
          ] = 0;
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

    if (props.sco.apiConnected) {
      props.sco
        .setSuspendData(
          "knowledgeCheckUserSelection",
          window.knowledgeCheckUserSelection
        )
        .then((data) => {
          // console.log("Knowledge Check User Selection Status updated...");
          props.sco
            .setSuspendData(
              "knowledgeCheckQuestionStatus",
              window.knowledgeCheckQuestionStatus
            )
            .then((data) => {
              // console.log("Knowledge Check User challenge Question Status updated...");
              props.sco
                .setSuspendData(
                  "knowledgeCheckUserAttempt",
                  window.knowledgeCheckUserAttempt
                )
                .then((data) => {
                  // console.log("Knowledge Check User Attempt Status updated...");
                  props.sco
                    .setSuspendData(
                      "knowledgeCheckCorrectStatus",
                      window.knowledgeCheckCorrectStatus
                    )
                    .then((data) => {
                      // console.log("Knowledge Check User Correct Status updated...");
                    });
                });
            });
        });
    }
  };
  const onChallengeQuestion = () => {
    setQuestion(1);
  };
  const onHint = () => {
    props.updateShowLightBoxBool(true);
    props.updateLightBoxData({ type: "KnowledgeCheckFeedback" });
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
  });

  useLayoutEffect(() => {
    function callResize() {
      setTimeout(() => {
        triggerResize();
      }, 100);
    }
    callResize();
  }, []);

  return (
    <div className="container-padding background-comp-container">
      {!props.templateData.showPageTitle && (
        <div role='heading' aria-level='1' className="page-title-container page-title">
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
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(KnowledgeCheck1)
);
