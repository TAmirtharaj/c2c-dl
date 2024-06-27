/** @format */

import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  imagePath,
  setFlagDND,
  getFlagDND,
  setScroll,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../helper/Helper";
import CustomButton from "./CustomButton";
import "./DragAndDropWrapper.css";
import DragArea from "./DragArea";
import DropArea from "./DropArea";
import { withScorm } from "react-scorm-provider-v2";
import Feedback from "./Feedback";

const DragAndDropWrapper = (props) => {
  const srNo = props.pageData.sr ? props.pageData.sr : 0;
  const dragWrapperRef = useRef(null);
  let windowObj = getCommonWindowObj();
  const [dragData, setDragData] = useState({
    isSubmit: false,
    isAnswer: false,
    enableHint: false,
    enableReset: false,
    enableTryAgain: false,
    enableShowSolution: false,
    enableFeedBack: false,
  });

  useEffect(() => {
    // console.log(
    //   "drag and dropper wrapper",
    //   dragWrapperRef.current.closest(".assessment-comp-container")
    // );
    // const compContainer = dragWrapperRef.current.closest(
    //   ".assessment-comp-container"
    // );
    // if (compContainer) {
    //   const pageTitle = compContainer.querySelector(".page-title");
    //   if (pageTitle) {
    //     if (pageTitle.classList.contains("zoomLevelCenter1")) {
    //       pageTitle.classList.remove("zoomLevelCenter1");
    //     }
    //     if (pageTitle.classList.contains("zoomLevelCenter2")) {
    //       pageTitle.classList.remove("zoomLevelCenter2");
    //     }
    //     if (pageTitle.classList.contains("zoomLevelCenter3")) {
    //       pageTitle.classList.remove("zoomLevelCenter3");
    //     }
    //     if (pageTitle.classList.contains("zoomWidth100Level1")) {
    //       pageTitle.classList.remove("zoomWidth100Level1");
    //     }
    //     if (pageTitle.classList.contains("zoomWidth100Level2")) {
    //       pageTitle.classList.remove("zoomWidth100Level2");
    //     }
    //     if (pageTitle.classList.contains("zoomWidth100Level3")) {
    //       pageTitle.classList.remove("zoomWidth100Level3");
    //     }
    //   }
    // }
  }, []);
  const getCloudData = () => {};
  const saveDataToScorm = () => {
    console.log("inside the scorm function", props);

    windowObj = getCommonWindowObj();
    const dragAndDropDataObj = {
      isChallengeQuestion: windowObj.isChallengeQuestion[props.kcRef],
      droppedEle: windowObj.droppedEle[srNo],
      shuffleOption: windowObj.shuffleOption[srNo],
      KCDragAndDrop: windowObj.KCDragAndDrop[srNo],
      submitFlag:
        windowObj.submitFlag && windowObj.submitFlag[srNo]
          ? windowObj.submitFlag[srNo]
          : false,
      knowledgeCheckHintClicked:
        windowObj.knowledgeCheckHintClicked[props.kcRef],
      assessmentImageClick: windowObj.assessmentImageClick,
      dataContollerPara: windowObj.dataContollerPara[srNo],
      // dragData: dragData,
    };

    console.log("drag and drp object", dragAndDropDataObj);
    if (props.sco.apiConnected) {
      if (windowObj.droppedEle && windowObj.droppedEle[srNo]) {
        props.sco
          .setSuspendData(`drag_data_${[srNo]}`, dragAndDropDataObj)
          .then((data) => {
            console.log(
              "drag and drop data updated successfully",
              dragAndDropDataObj
            );
          });
      }
    }
  };
  let [hintClicked, setHintClicked] = useState(false);
  // saveDataToScorm();

  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    const dragDataScorm = scromData ? scromData[`drag_data_${[srNo]}`] : "";
    const submitFlag2 = dragDataScorm ? dragDataScorm.submitFlag : false;
    if (submitFlag2) {
      windowObj = getCommonWindowObj();
      windowObj.submitFlag = windowObj.submitFlag ? windowObj.submitFlag : [];
      windowObj.submitFlag[srNo] = submitFlag2;
      setCommonWindowObj(windowObj);
      // console.log("submit flag", window.submitFlag[srNo]);
      if (submitFlag2 === true) {
        const containerArray = document.querySelectorAll(".drag-option");
        if (containerArray) {
          containerArray.forEach((ele) => {
            ele.classList.add("disabled");
          });
        }
      }
      if (dragDataScorm.droppedEle) {
        windowObj = getCommonWindowObj();
        windowObj.droppedEle = windowObj.droppedEle ? windowObj.droppedEle : [];

        windowObj.droppedEle[srNo] = dragDataScorm.droppedEle;
        setCommonWindowObj(windowObj);
      }

      if (dragDataScorm.shuffleOption) {
        windowObj = getCommonWindowObj();
        windowObj.shuffleOption = windowObj.shuffleOption
          ? windowObj.shuffleOption
          : [];
        windowObj.shuffleOption[srNo] = dragDataScorm.shuffleOption;
        setCommonWindowObj(windowObj);
      }
      if (dragDataScorm.KCDragAndDrop) {
        windowObj = getCommonWindowObj();
        windowObj.KCDragAndDrop = windowObj.KCDragAndDrop
          ? windowObj.KCDragAndDrop
          : [];
        windowObj.KCDragAndDrop[srNo] = dragDataScorm.KCDragAndDrop;
        setCommonWindowObj(windowObj);
      }
      if (dragDataScorm.knowledgeCheckHintClicked) {
        windowObj.knowledgeCheckHintClicked =
          windowObj.knowledgeCheckHintClicked
            ? windowObj.knowledgeCheckHintClicked
            : [];
        windowObj.knowledgeCheckHintClicked[srNo] =
          dragDataScorm.knowledgeCheckHintClicked;
      }
      if (dragDataScorm.dataContollerPara) {
        windowObj = getCommonWindowObj();
        windowObj.dataContollerPara = windowObj.dataContollerPara
          ? windowObj.dataContollerPara
          : [];
        windowObj.dataContollerPara[srNo] = dragDataScorm.dataContollerPara;
        setCommonWindowObj(windowObj);
      }
      // if (dragDataScorm.dragData) {
      //   setDragData(dragDataScorm.dragData);
      // }
      if (dragDataScorm.assessmentImageClick) {
        windowObj = getCommonWindowObj();
        windowObj.assessmentImageClick = dragDataScorm.assessmentImageClick;
        setCommonWindowObj();
      }

      if (dragDataScorm.isChallengeQuestion) {
        windowObj = getCommonWindowObj();
        windowObj.isChallengeQuestion[props.kcRef] =
          dragDataScorm.isChallengeQuestion;
        setCommonWindowObj();
      }
    }
    console.log("scromData retrieved from server:", dragDataScorm, scromData);
  }

  useEffect(() => {
    windowObj = getCommonWindowObj();
    let flag = 0;

    windowObj.droppedEle[srNo].forEach((element) => {
      if (element !== null) {
        flag = 1;
      }
    });

    const backBtn = document.querySelector(".back-button");
    if (backBtn && props.pageData.purpose === "Assessment") {
      backBtn.addEventListener("click", () => {
        onReset();
      });
    }
    // console.log("flag after null", getFlagDND(srNo), flag);
    if (getFlagDND(srNo) === 0 && props.pageData.purpose === "Assessment") {
      onReset();
      document.querySelectorAll(".drag-option").forEach((ele) => {
        // console.log("drag options classlist ", ele, ele.classList);
        if (ele.classList.contains("disabled")) {
          ele.classList.remove("disabled");
          ele.disabled = false;
        }
      });
    }

    windowObj = getCommonWindowObj();
    if (getFlagDND(srNo) === 0 && flag === 0 && windowObj.shuffleOption[srNo]) {
      windowObj.shuffleOption[srNo] = true;
    } else {
      windowObj.shuffleOption[srNo] = false;
    }
    setCommonWindowObj(windowObj);
    setFlagDND(srNo, 1);

    if (
      windowObj.isChallengeQuestion &&
      windowObj.isChallengeQuestion[props.kcRef]
    ) {
      console.log("hint was clicked dnd");
      props.onChallengeQuestion();
    }
    if (props.isChallengeQuestion) {
      setHintClicked(false);
    } else {
      setHintClicked(windowObj.knowledgeCheckHintClicked[props.kcRef]);
    }
    if (windowObj.KCDragAndDrop && windowObj.KCDragAndDrop[srNo]) {
      windowObj = getCommonWindowObj();
      setDragData((prev) => {
        return {
          ...prev,
          ...windowObj.KCDragAndDrop[srNo],
        };
      });

      if (windowObj.KCDragAndDrop[srNo].showClick) {
        document.querySelectorAll(`.sign-drop-box`).forEach((ele) => {
          if (ele.childNodes[0]) ele.childNodes[0].remove();
        });

        document.querySelectorAll(".drop-box").forEach((ele, i) => {
          const droppedSpan = document.createElement("span");
          droppedSpan.className = "dropped";
          droppedSpan.id = `${i}`;
          droppedSpan.classList.add(`drag_${i}`);
          droppedSpan.innerText =
            windowObj.KCDragAndDrop[srNo].showClickData[i].innerData;
          ele.appendChild(droppedSpan);
          ele.style.border = "unset";
          ele.style.pointerEvents = "none";
        });
        document.querySelectorAll(".draggable-item").forEach((ele) => {
          if (ele) ele.style.opacity = 0;
        });
      }

      if (windowObj.KCDragAndDrop[srNo].resetClick) {
        document.querySelectorAll(".drag-option").forEach((ele) => {
          ele.classList.remove("disabled");
          ele.disabled = false;
          ele.style.opacity = "1";
        });
        document.querySelectorAll(".drop-box").forEach((ele, i) => {
          ele.style.pointerEvents = "unset";
        });
      }
      if (windowObj.KCDragAndDrop[srNo].submitClick) {
        document.querySelectorAll(".drop-box").forEach((ele, i) => {
          if (windowObj.KCDragAndDrop[srNo].submitData[i].dropId) {
            let key = windowObj.KCDragAndDrop[srNo].submitData[i].dropId;
            const droppedSpan = document.createElement("span");
            droppedSpan.className = "dropped";
            droppedSpan.id = `${key}`;
            droppedSpan.classList.add(`drag_${key}`);
            droppedSpan.innerText =
              document.querySelector(`.drag_${key}`) &&
              document.querySelector(`.drag_${key}`).innerText;
            ele.appendChild(droppedSpan);
            ele.style.border = "unset";
            ele.style.pointerEvents = "none";
          }

          let urlImage = imagePath(
            windowObj.KCDragAndDrop[srNo].submitData[i].answer
              ? props.pageData.radioButtonStates.tick
              : props.pageData.radioButtonStates.wrong
          );
          const imageAnswer = document.createElement("img");
          imageAnswer.src = urlImage;
          if (document.querySelector(`.sign_${ele.id}`).childNodes[0])
            document.querySelector(`.sign_${ele.id}`).childNodes[0].remove();
          document.querySelector(`.sign_${ele.id}`).appendChild(imageAnswer);
        });
        document.querySelectorAll(".draggable-item").forEach((ele) => {
          if (ele) ele.style.opacity = 0;
        });
      }
    } else {
      windowObj = getCommonWindowObj();
      windowObj.KCDragAndDrop = windowObj.KCDragAndDrop
        ? windowObj.KCDragAndDrop
        : [];
      windowObj.KCDragAndDrop[srNo] = windowObj.KCDragAndDrop[srNo]
        ? windowObj.KCDragAndDrop[srNo]
        : {};
      windowObj.KCDragAndDrop[srNo].submitCount = 0;
      windowObj.KCDragAndDrop[srNo].attempt = 0;
      setCommonWindowObj(windowObj);
    }

    if (props.pageData.purpose !== "Assessment") {
      if (
        windowObj.KCDragAndDrop[srNo].submitCount >= 2 ||
        (windowObj.KCDragAndDrop[srNo].isAnswer && !props.nextDisable)
      )
        props.updateNextClicked(false);
      else props.updateNextClicked(true);
    }

    // if (props.pageData.purpose === "Assessment") {
    //   onReset();
    // }

    windowObj = getCommonWindowObj();
    if (windowObj.droppedEle[srNo]) {
      let count = 0;
      windowObj.droppedEle[srNo].forEach((item) => {
        if (item && item !== "null") count++;
      });
      // console.log(
      //   "here at the submit disable",
      //   windowObj.droppedEle[srNo].length - 1,
      //   count,
      //   props.pageData.options.length,
      //   windowObj.KCDragAndDrop[srNo].isSubmit !== false
      // );
      if (
        count === props.pageData.options.length &&
        windowObj.KCDragAndDrop[srNo].isSubmit !== false
      ) {
        setDragData((prev) => {
          return {
            ...prev,
            isSubmit: true,
          };
        });
      }
    }
    console.log(
      "here right ans==========",
      windowObj.KCDragAndDrop[srNo].isAnswer
    );

    if (
      props.pageData.purpose !== "Assessment" &&
      windowObj.KCDragAndDrop[srNo].isAnswer
    ) {
      setDragData((prev) => {
        return {
          ...prev,
          enableReset: false,
          enableHint: false,
        };
      });
      windowObj.KCDragAndDrop[srNo] = {
        ...windowObj.KCDragAndDrop[srNo],
        enableHint: false,
        enableReset: false,
      };
    }
  }, []);

  const dataContoller = (bool = false) => {
    setDragData((prev) => {
      return {
        ...prev,
        isSubmit: bool,
      };
    });
  };

  const onFormSubmit = () => {
    setScroll(0);
    windowObj = getCommonWindowObj();
    windowObj.zoomState = true;
    windowObj.submitFlag = windowObj.submitFlag ? windowObj.submitFlag : [];
    windowObj.submitFlag[srNo] = windowObj.submitFlag[srNo]
      ? windowObj.submitFlag[srNo]
      : true;
    windowObj.submitFlag[srNo] = true;
    setCommonWindowObj(windowObj);
    document.querySelectorAll(".draggable-item").forEach((ele) => {
      ele.style.pointerEvents = "none";
    });
    if (dragData.isSubmit) {
      let answer = false;
      let ansCount = 0;
      let submitData = [];
      let tempArray, eleId, dropId;
      document.querySelectorAll(".drop-box").forEach((ele) => {
        eleId = ele.id;
        dropId = ele.childNodes[0].id;
        if (ele.id === ele.childNodes[0].id) {
          answer = true;
          ansCount = ansCount + 1;
        } else answer = false;
        tempArray = { answer, dropId };
        submitData.push(tempArray);
        let urlImage = imagePath(
          answer
            ? props.pageData.radioButtonStates.tick
            : props.pageData.radioButtonStates.wrong
        );
        const imageAnswer = document.createElement("img");
        imageAnswer.src = urlImage;
        document.querySelector(`.sign_${ele.id}`).appendChild(imageAnswer);
        ele.style.pointerEvents = "none";
      });
      if (
        ansCount === props.pageData.options.length ||
        (props.pageData.purpose !== "Assessment" &&
          windowObj.KCDragAndDrop[srNo].submitCount >= 1)
      ) {
        answer = true;
        props.onUpdateResult(true);
      } else {
        props.onUpdateResult(false);
        answer = false;
      }

      windowObj.KCDragAndDrop[srNo] = {
        ...windowObj.KCDragAndDrop[srNo],
        isAnswer: answer,
        isSubmit: false,
        enableHint: true,
        enableReset: true,
        submitData,
        submitClick: true,
        submitCount: windowObj.KCDragAndDrop[srNo].submitCount + 1,
        showClick: false,
        attempt: windowObj.KCDragAndDrop[srNo].attempt + 1,
      };
      setDragData((prev) => {
        return {
          ...prev,
          isSubmit: false,
          isAnswer: answer,
          enableHint: true,
          enableReset: true,
        };
      });

      if (
        props.pageData.purpose !== "Assessment" &&
        windowObj.KCDragAndDrop[srNo].isAnswer
      ) {
        setDragData((prev) => {
          return {
            ...prev,
            enableReset: false,
            enableHint: false,
          };
        });
        windowObj.KCDragAndDrop[srNo] = {
          ...windowObj.KCDragAndDrop[srNo],
          enableHint: false,
          enableReset: false,
        };
      }
    }

    if (props.pageData.purpose !== "Assessment") {
      if (
        windowObj.KCDragAndDrop[srNo].submitCount >= 2 ||
        windowObj.KCDragAndDrop[srNo].isAnswer
      )
        props.updateNextClicked(false);
    }

    saveDataToScorm();
  };

  const onTryAgain = () => {
    props.onChallengeQuestion();
    onReset();

    let windowObj = getCommonWindowObj();
    windowObj.KCDragAndDrop[srNo].submitCount = 0;
    if (!windowObj.isChallengeQuestion) windowObj.isChallengeQuestion = [];
    windowObj.isChallengeQuestion[props.kcRef] = 1;

    setCommonWindowObj(windowObj);
    saveDataToScorm();
  };

  const onReset = () => {
    windowObj = getCommonWindowObj();
    windowObj.shuffleOption[srNo] = true;
    windowObj.droppedEle[srNo] = [];
    setCommonWindowObj(windowObj);

    let resetData = [];

    document.querySelectorAll(".draggable-item").forEach((ele) => {
      ele.style.pointerEvents = "auto";
    });
    document.querySelectorAll(`.sign-drop-box`).forEach((ele) => {
      if (ele.childNodes[0]) ele.childNodes[0].remove();
    });

    document.querySelectorAll(`.drop-box`).forEach((ele) => {
      if (ele.childNodes[0]) ele.childNodes[0].remove();
      ele.style.border = "2px dashed #707070";
      ele.style.pointerEvents = "unset";
    });

    document.querySelectorAll(".drop-box").forEach((ele) => {
      if (ele.childNodes[0]) {
        ele.childNodes[0].remove();
        ele.style.border = "2px dashed #707070";
        ele.style.pointerEvents = "unset";
      }
    });
    document.querySelectorAll(".drag-option").forEach((ele) => {
      let tempArray;
      // console.log("drag options classlist ", ele, ele.classList);
      if (ele.classList.contains("disabled")) {
        ele.classList.remove("disabled");
        ele.disabled = false;
      }
      ele.style.opacity = "100";
      const rId = ele.id;
      tempArray = { rId };
      resetData.push(tempArray);
    });
    if (windowObj.KCDragAndDrop) {
      windowObj.KCDragAndDrop[srNo] = {
        ...windowObj.KCDragAndDrop[srNo],
        isSubmit: null,
        enableHint: false,
        enableReset: false,
        resetData,
        resetClick: true,
        submitClick: false,
      };
      setCommonWindowObj(windowObj);
    }
    setDragData((prev) => {
      return {
        ...prev,
        isSubmit: false,
        enableHint: false,
        enableReset: false,
      };
    });

    if (props.sco.apiConnected) {
      props.sco.setSuspendData(`drag_data_${[srNo]}`, {}).then((data) => {
        console.log("drag data set to empty object on reset");
        props.sco.setStatus("completed").then(() => {
          console.log("course completed successfully and submitted on server:");
        });
      });
    }
  };
  const onShowAnswer = () => {
    document.querySelectorAll(`.sign-drop-box`).forEach((ele) => {
      if (ele.childNodes[0]) ele.childNodes[0].remove();
    });
    const showClickData = [];
    document.querySelectorAll(".drop-box").forEach((ele, i) => {
      let temp;
      if (ele.childNodes[0]) {
        let innerData = props.pageData.options[i].answer;
        ele.childNodes[0].innerText = innerData;
        temp = { innerData };
        showClickData.push(temp);
      }
      ele.style.pointerEvents = "none";
    });

    windowObj.KCDragAndDrop[srNo] = {
      ...windowObj.KCDragAndDrop[srNo],
      isSubmit: false,
      enableReset: false,
      resetClick: false,
      submitClick: false,
      showClick: true,
      showClickData,
    };

    setDragData((prev) => {
      return {
        ...prev,
        isSubmit: false,
        enableReset: false,
        showClick: true,
      };
    });
    saveDataToScorm();
  };

  const onHint = () => {
    props.updateHintClicked(true);
    let windowObj = getCommonWindowObj();
    windowObj.knowledgeCheckHintClicked[props.kcRef] = true;
    setCommonWindowObj(windowObj);
    setHintClicked(true);
    props.onHint();
    saveDataToScorm();
  };

  const onChallengeQuestion = (event) => {
    // trace("onChallengeQuestion");
    props.onChallengeQuestion();
  };
  const onNextHandler = () => {
    windowObj = getCommonWindowObj();
    windowObj.zoomState = false;
    if (windowObj.KCDragAndDrop) {
      windowObj.KCDragAndDrop[srNo] = {
        ...windowObj.KCDragAndDrop[srNo],
        isSubmit: null,
      };
      setCommonWindowObj(windowObj);
    }
    setFlagDND(-1, 0);
    windowObj = getCommonWindowObj();
    if (windowObj.assessmentImageClick) {
      windowObj.assessmentImageClick = false;
      setCommonWindowObj(windowObj);
    }

    windowObj = getCommonWindowObj();
    windowObj.assementObj = null;
    setCommonWindowObj(windowObj);

    props.onLoadNextQue();
  };
  return (
    <React.Fragment>
      <div className='drag-drop-holder' ref={dragWrapperRef}>
        <DropArea
          pageData={props.pageData.options}
          sr={props.pageData.sr}
          image={props.pageData.image}
          dataContoller={dataContoller}
          saveDataToScorm={saveDataToScorm}
        />
        <DragArea
          pageData={props.optionArray}
          sr={props.pageData.sr}
          purpose={props.pageData.purpose}
        />
      </div>
      <div className='form-button'>
        {
          <CustomButton
            className={`mcss-form-comp-button bodyButtonLabel ${
              dragData.isSubmit ? "" : "mcss-form-comp-button-disable"
            }`}
            id='submit'
            title='Submit'
            onClick={onFormSubmit}
            ariaLabel={"Submit"}
            btnTitle='Submit selected answer'
            disabled={dragData.isSubmit ? false : true}
          />
        }
        {props.pageData.purpose === "Assessment" && (
          <CustomButton
            className={`mcss-form-comp-button bodyButtonLabel ${
              dragData.enableReset ? "" : "mcss-form-comp-button-disable"
            }`}
            id='next'
            title='Next'
            onClick={onNextHandler}
            ariaLabel={"Next"}
            disabled={dragData.enableReset ? false : true}
          />
        )}
        {dragData.enableReset &&
          windowObj.KCDragAndDrop &&
          windowObj.KCDragAndDrop[srNo] &&
          props.pageData.purpose !== "Assessment" &&
          hintClicked &&
          windowObj.KCDragAndDrop[srNo].attempt === 1 && (
            <CustomButton
              className='mcss-form-comp-button bodyButtonLabel tryAgainButton'
              id='TryAgain'
              title='Try Again'
              onClick={onTryAgain}
              ariaLabel={"TryAgain"}
              btnTitle='try again'
            />
          )}
        {dragData.enableReset &&
          windowObj.KCDragAndDrop &&
          windowObj.KCDragAndDrop[srNo] &&
          props.pageData.purpose !== "Assessment" &&
          (windowObj.KCDragAndDrop[srNo].attempt === 1 ? !hintClicked : true) &&
          windowObj.KCDragAndDrop[srNo].submitCount < 2 && (
            <CustomButton
              className='mcss-form-comp-button bodyButtonLabel resetButton'
              id='Reset'
              title='Reset'
              onClick={onReset}
              ariaLabel={"Reset"}
              btnTitle='Reset answer choice'
            />
          )}
        {dragData.enableHint &&
          props.pageData.purpose !== "Assessment" &&
          windowObj.KCDragAndDrop &&
          windowObj.KCDragAndDrop[srNo] &&
          !windowObj.KCDragAndDrop.isAnswer &&
          windowObj.KCDragAndDrop[srNo].submitCount < 2 && (
            <CustomButton
              className='mcss-form-comp-button bodyButtonLabel'
              id='Hint'
              title='Hint'
              onClick={onHint}
              ariaLabel={"Hint"}
              btnTitle='Show the assessment hint'
            />
          )}
        {windowObj.KCDragAndDrop &&
          windowObj.KCDragAndDrop[srNo] &&
          windowObj.KCDragAndDrop[srNo].submitCount >= 2 &&
          props.pageData.purpose !== "Assessment" &&
          !windowObj.KCDragAndDrop[srNo].isAnswer && (
            <CustomButton
              className={`mcss-form-comp-button bodyButtonLabel ${
                !dragData.showClick ? "" : "mcss-form-comp-button-disable"
              }`}
              id='ShowAnswer'
              title='Show Answer'
              onClick={onShowAnswer}
              ariaLabel={"Show Answer"}
            />
          )}
        {windowObj.KCDragAndDrop &&
          windowObj.KCDragAndDrop[srNo] &&
          (windowObj.KCDragAndDrop[srNo].submitCount >= 2 ||
            windowObj.KCDragAndDrop[srNo].isAnswer) &&
          props.pageData.purpose !== "Assessment" &&
          props.pageData.feedbackData && (
            <Feedback pageData={props.pageData.feedbackData} />
          )}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
    hintClicked: state.hintClicked,
    nextDisable: state.nextDisable,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateHintClicked: (data) =>
      dispatch({
        type: "UPDATE_HINT_CLICKED",
        payload: data,
      }),
    updateNextClicked: (data) =>
      dispatch({
        type: "UPDATE_NEXT_DISABLE_BOOL",
        payload: data,
      }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(DragAndDropWrapper)
);
