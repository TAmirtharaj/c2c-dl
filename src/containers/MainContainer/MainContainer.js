/** @format */

import React from "react";
import { withScorm } from "react-scorm-provider-v2";
import { connect } from "react-redux";
// import _ from "lodash";
import {
  filePath,
  preloadImages,
  BrowserDetect,
  getCommonWindowObj,
  setCommonWindowObj,
  setKCDataObj,
} from "../../helper/Helper";
import "./MainContainer.css";

import { courseName } from "../../config";
import Body from "../../elements/body/Body";
import Header from "../../elements/header/Header";

import Footer from "../../elements/footer/Footer";
import { updateScormData, updateAssessmetStatus } from "../../helper/Helper";

// import RevistDialogue from "../../elements/revisitDialogue/RevistDialogue";
// import MobilePopupHandler from "../../MobileLandscapePopup/MobilePopupHandler";

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    // console.log("MainContainer constructor........................");
    this.state = {
      isLaunchVisible: true,
      isAllImagesLoaded: false,
    };
    this.imageArr = [];
    this.classPointer = BrowserDetect.isMobile()
      ? "main-container container-fluid g-0 mobile"
      : "main-container container-fluid g-0";
    window.sco = this;
  }

  componentDidMount() {
    let windowObj = getCommonWindowObj();
    windowObj.knowledgeCheckUserSelection = [];
    windowObj.storeClickedTabsOfMaterialSc = [[], [], []];
    windowObj.knowledgeCheckUserAttempt = [];
    windowObj.knowledgeCheckQuestionStatus = [];
    windowObj.knowledgeCheckCorrectStatus = [];
    windowObj.knowledgeCheckShuffleStatus = [];
    windowObj.knowledgeCheckHintClicked = [];
    windowObj.isChallengeQuestion = [];
    windowObj.infoPopupClickedStatus = {
      kc: false,
      resource: false,
      procedure: false,
    };
    setCommonWindowObj(windowObj);
    // window.storeClickedTabsOfMaterialSc = [[], [], []];
    // window.knowledgeCheckUserSelection = [];
    // window.knowledgeCheckUserAttempt = [];
    // window.knowledgeCheckQuestionStatus = [];
    // window.knowledgeCheckCorrectStatus = [];
    // window.knowledgeCheckShuffleStatus = [];
    // window.knowledgeCheckHintClicked = [];
    // window.infoPopupClickedStatus = {
    //   kc: false,
    //   resource: false,
    //   procedure: false,
    // };
    window.oldDate = new Date().getTime();

    const isMobileDevice = BrowserDetect.isMobile();

    const finalPath = courseName.includes("/")
      ? `${courseName}/structure.json`
      : `courses/${courseName}/structure.json`;
    const json = filePath(finalPath, (data) => {
      this.props.updateCourseData(data);
      const visitedArray = [];
      let counter = 0;
      for (let i = 0; i < data.pages.length; i++) {
        visitedArray[i] = [];
        for (let j = 0; j < data.pages[i].pages.length; j++) {
          // console.log("page data visited array", data.pages[i].pages[j].title);
          if (data.pages[i].pages[j].pages) {
            visitedArray[i][j] = [];
            for (let k = 0; k < data.pages[i].pages[j].pages.length; k++) {
              visitedArray[i][j][k] = 0;
              counter += 1;
              data.pages[i].pages[j].pages[k].pageNum = counter;
              if (
                data.pages[i].pages[j].pages[k].hasOwnProperty(
                  "isKnowledgeCheck"
                ) &&
                data.pages[i].pages[j].pages[k].isKnowledgeCheck
              ) {
                windowObj = getCommonWindowObj();
                windowObj.knowledgeCheckUserSelection.push([-1, -1]);
                windowObj.knowledgeCheckQuestionStatus.push([-1, -1]);
                windowObj.knowledgeCheckUserAttempt.push([0, 0]);
                windowObj.knowledgeCheckCorrectStatus.push(["NA", "NA"]);
                windowObj.knowledgeCheckShuffleStatus.push([false, false]);
                windowObj.knowledgeCheckHintClicked.push(false);
                setCommonWindowObj(windowObj);

                // window.knowledgeCheckUserSelection.push([-1, -1]);
                // window.knowledgeCheckQuestionStatus.push([-1, -1]);
                // window.knowledgeCheckUserAttempt.push([0, 0]);
                // window.knowledgeCheckCorrectStatus.push(["NA", "NA"]);
                // window.knowledgeCheckShuffleStatus.push([false, false]);
                // window.knowledgeCheckHintClicked.push(false);
              }
            }

            // made separate visited array for the materials so that each tab gets its visiting state
            // console.log("visited array", visitedArray);
            if (
              data.pages[i].pages[j].pages[0].hasOwnProperty("autoCompletion")
            ) {
              let tabArray;
              data.pages[i].pages[j].pages[0].pageData.forEach((item) => {
                if (item.type === "Tab") tabArray = item.tabs;
              });
              if (!tabArray) tabArray = [2];
              for (let k = 0; k < tabArray.length; k++) {
                visitedArray[i][j][k] = 0;
              }
            }
            // cos
          } else {
            visitedArray[i][j] = 0;
            counter += 1;
          }
        }
      }
      //preloadImages(data.preloadImages);
      const obj = {};
      windowObj = getCommonWindowObj();
      windowObj.totalImages = data.preloadImages.length;
      setCommonWindowObj(windowObj);
      for (let i = 0; i < windowObj.totalImages; i++) {
        let pointer = data.preloadImages[i].split(".")[0];
        obj[pointer] = new Image();
        obj[pointer].src = `./images/${data.preloadImages[i]}`;
        obj[pointer].onload = this.handleImageLoaded;
      }
      // console.log(data);
      this.props.updateCourseData(data);
      this.props.updatePageTotalCounter(counter);
      this.props.updateAssessmentStartedBool(false);
      this.props.updateAssessmentScreenNum(0);
      this.props.updateAssessmentQuestionNum(0);
      this.props.updateAssessmentArray(null);
      this.props.updateNextDisable(false);

      if (isMobileDevice) {
        console.log("iphone triggered");
        this.props.updateMaterialScreenSelectedTab(-1);
      } else this.props.updateMaterialScreenSelectedTab(0);
      const scormAPI = this.props.sco.apiConnected;
      if (!scormAPI) {
        this.initGlobalData(visitedArray);
      } else {
        // window.startTime =   new Date();
        this.registerEventListeners()
        if (
          this.props.sco.completionStatus === "not attempted" ||
          this.props.sco.completionStatus === ""
        ) {
          this.props.sco.setStatus("completed");
        }
        const suspendData = this.props.sco.suspendData;
        console.log({ suspendData });

        // console.log(
        //   '=============ENTERED IN SCORM CONDITION======================'
        // );
        const value = suspendData["scormObj"]
          ? suspendData["scormObj"].visitedArray
          : "";
        const currentSection = suspendData["scormObj"]
          ? suspendData["scormObj"].currentSection
          : "";
        const currentScene = suspendData["scormObj"]
          ? suspendData["scormObj"].currentScene
          : "";
        const currentSubScene = suspendData["scormObj"]
          ? suspendData["scormObj"].currentSubScene
          : "";
        const assessmentStatus = suspendData.assessmentStatus
          ? suspendData.assessmentStatus
          : "NA";
        const assessmentScore = suspendData.assessmentScore
          ? suspendData.assessmentScore
          : 0;
        const assessmentArray = suspendData.assessmentArray
          ? suspendData.assessmentArray
          : null;

        if (suspendData.KCData) {
          console.log("kc data recived from server:", suspendData.KCData);
          setKCDataObj(0, suspendData.KCData);
        }

        if (
          suspendData.KCData &&
          suspendData.KCData.knowledgeCheckUserSelection
        ) {
          // window.knowledgeCheckUserSelection =
          //   suspendData.KCData.knowledgeCheckUserSelection;

          windowObj = getCommonWindowObj();
          windowObj.knowledgeCheckUserSelection =
            suspendData.KCData.knowledgeCheckUserSelection;
          setCommonWindowObj(windowObj);
        }
        // window.knowledgeCheckUserSelection =
        //   suspendData.knowledgeCheckUserSelection
        //     ? suspendData.knowledgeCheckUserSelection
        //     : window.knowledgeCheckUserSelection;

        if (
          suspendData.KCData &&
          suspendData.KCData.knowledgeCheckQuestionStatus
        ) {
          // window.knowledgeCheckQuestionStatus =
          //   suspendData.KCData.knowledgeCheckQuestionStatus;

          windowObj = getCommonWindowObj();
          windowObj.knowledgeCheckQuestionStatus =
            suspendData.KCData.knowledgeCheckQuestionStatus;
          setCommonWindowObj(windowObj);
        }
        // window.knowledgeCheckQuestionStatus =
        //   suspendData.knowledgeCheckQuestionStatus
        //     ? suspendData.knowledgeCheckQuestionStatus
        //     : window.knowledgeCheckQuestionStatus;

        if (
          suspendData.KCData &&
          suspendData.KCData.knowledgeCheckUserAttempt
        ) {
          // window.knowledgeCheckUserAttempt =
          //   suspendData.KCData.knowledgeCheckUserAttempt;

          windowObj = getCommonWindowObj();
          windowObj.knowledgeCheckUserAttempt =
            suspendData.KCData.knowledgeCheckUserAttempt;
          setCommonWindowObj(windowObj);
        }
        // window.knowledgeCheckUserAttempt = suspendData.knowledgeCheckUserAttempt
        //   ? suspendData.knowledgeCheckUserAttempt
        //   : window.knowledgeCheckUserAttempt;

        if (
          suspendData.KCData &&
          suspendData.KCData.knowledgeCheckCorrectStatus
        ) {
          // window.knowledgeCheckCorrectStatus =
          //   suspendData.KCData.knowledgeCheckCorrectStatus;

          windowObj = getCommonWindowObj();
          windowObj.knowledgeCheckCorrectStatus =
            suspendData.KCData.knowledgeCheckCorrectStatus;
          setCommonWindowObj(windowObj);
        }
        // window.knowledgeCheckCorrectStatus =
        //   suspendData.knowledgeCheckCorrectStatus
        //     ? suspendData.knowledgeCheckCorrectStatus
        //     : window.knowledgeCheckCorrectStatus;

        if (
          suspendData.KCData &&
          suspendData.KCData.knowledgeCheckShuffleStatus
        ) {
          // window.knowledgeCheckShuffleStatus =
          //   suspendData.KCData.knowledgeCheckShuffleStatus;

          windowObj = getCommonWindowObj();
          windowObj.knowledgeCheckShuffleStatus =
            suspendData.KCData.knowledgeCheckShuffleStatus;
          setCommonWindowObj(windowObj);
        }
        // window.knowledgeCheckShuffleStatus =
        //   suspendData.knowledgeCheckShuffleStatus
        //     ? suspendData.knowledgeCheckShuffleStatus
        //     : window.knowledgeCheckShuffleStatus;

        if (
          suspendData.KCData &&
          suspendData.KCData.knowledgeCheckHintClicked
        ) {
          // window.knowledgeCheckHintClicked =
          //   suspendData.KCData.knowledgeCheckHintClicked;

          windowObj = getCommonWindowObj();
          windowObj.knowledgeCheckHintClicked =
            suspendData.KCData.knowledgeCheckHintClicked;
          setCommonWindowObj(windowObj);
        }

        if (suspendData.KCData && suspendData.KCData.isChallengeQuestion) {
          // window.knowledgeCheckHintClicked =
          //   suspendData.KCData.knowledgeCheckHintClicked;

          windowObj = getCommonWindowObj();
          windowObj.isChallengeQuestion =
            suspendData.KCData.isChallengeQuestion;
          setCommonWindowObj(windowObj);
        }
        // window.knowledgeCheckHintClicked = suspendData.knowledgeCheckHintClicked
        //   ? suspendData.knowledgeCheckHintClicked
        //   : window.knowledgeCheckHintClicked;

        if (suspendData.KCData && suspendData.KCData.infoPopupClickedStatus) {
          // window.infoPopupClickedStatus =
          //   suspendData.KCData.infoPopupClickedStatus;

          windowObj = getCommonWindowObj();
          windowObj.infoPopupClickedStatus =
            suspendData.KCData.infoPopupClickedStatus;
          setCommonWindowObj(windowObj);
        }
        // window.infoPopupClickedStatus = suspendData.infoPopupClickedStatus
        //   ? suspendData.infoPopupClickedStatus
        //   : window.infoPopupClickedStatus;
        if (suspendData.KCData) {
          console.log("KC data recieved from server :", suspendData.KCData);
        }

        // console.log('apiConnected', this.props.sco.apiConnected);
        if (value) {
          // console.log('===================Socrm Revisit==================');
          this.props.updatePageArrayData(value);
          this.props.updateSection(currentSection);
          this.props.updateScene(currentScene);
          this.props.updateSubScene(currentSubScene);
          this.props.updateZoomIndex(1);
          // this.props.updateCurrentPage(currentPage);
          this.props.updateAssessmentStatus(assessmentStatus);
          this.props.updateAssessmentScore(assessmentScore);
          this.props.updateAssessmentArray(assessmentArray);
          // window.courseRevisit = true;

          let windowObj = getCommonWindowObj();
          windowObj.courseRevisit = true;
          setCommonWindowObj(windowObj);

          this.setState({ isLaunchVisible: false });
        } else {
          // console.log('===================Socrm First Visit==================');
          this.initGlobalData(visitedArray);
        }
      }
    });
  }

  handleImageLoaded = (e) => {
    let windowObj = getCommonWindowObj();
    this.imageArr.push(e);
    if (this.imageArr.length === windowObj.totalImages) {
      this.setState({ isAllImagesLoaded: true });
    }
  };

  initGlobalData = (visitedArray) => {
    let localData = localStorage.getItem('scormObj');
    console.log("localData", JSON.parse(localData))
    if (localData) {
      let jsonData = JSON.parse(localData)
      this.props.updatePageArrayData(jsonData.visitedArray);
      this.props.updateSection(jsonData.currentSection);
      this.props.updateScene(jsonData.currentScene);
      this.props.updateSubScene(jsonData.currentSubScene);
      this.props.updateZoomIndex(1);
    } else {

      this.props.updatePageArrayData(visitedArray);
      this.props.updateSection(0);
      this.props.updateScene(0);
      this.props.updateSubScene(0);
      this.props.updateZoomIndex(1);
    }
    if (this.props.sco.apiConnected) {
      updateAssessmetStatus(this.props.sco, "failed");
      setTimeout(() => {
        updateScormData(this.props.sco, 0, 0, 0, visitedArray);
      }, 3000);
    }
    this.props.updateAssessmentStatus("NA");
    this.props.updateAssessmentScore(0);
    // window.courseRevisit = false;
    let windowObj = getCommonWindowObj();
    windowObj.courseRevisit = false;
    setCommonWindowObj(windowObj);
    this.setState({ isLaunchVisible: false });
  };

  registerEventListeners = () => {
    console.log("Event Listeners added");
    if (
      window.frameElement !== null &&
      navigator.userAgent.indexOf("Chrome") > -1
    ) {
      window.addEventListener("beforeunload", this.props.sco.closeScormAPIConnection, false);
    } else if ("onpagehide" in window) {
      window.addEventListener("pagehide", this.props.sco.closeScormAPIConnection, false);
      window.addEventListener("beforeunload", this.props.sco.closeScormAPIConnection, false);
    }
  };

  render() {
    return !this.state.isLaunchVisible && this.state.isAllImagesLoaded ? (
      <div className={this.classPointer}>
        <Header data={this.props.courseData && this.props.courseData} />
        <Body data={this.props.courseData && this.props.courseData} />

        <Footer data={this.props.courseData && this.props.courseData} />
      </div>
    ) : (
      <div className='loader'></div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    courseData: state.courseData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCourseData: (data) =>
      dispatch({ type: "UPDATE_COURSE_DATA", payload: data }),
    updatePageArrayData: (data) =>
      dispatch({ type: "UPDATE_PAGE_ARRAY", payload: data }),
    updatePageTotalCounter: (data) =>
      dispatch({ type: "UPDATE_TOTAL_PAGES", payload: data }),
    updateSection: (data) =>
      dispatch({ type: "UPDATE_SECTION", payload: data }),
    updateScene: (data) => dispatch({ type: "UPDATE_SCENE", payload: data }),
    updateSubScene: (data) =>
      dispatch({ type: "UPDATE_SUB_SCENE", payload: data }),
    updateCurrentPage: (data) =>
      dispatch({ type: "UPDATE_CURRENT_PAGE", payload: data }),
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
    updateAssessmentQuestionNum: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_QUESTION_NUM", payload: data }),
    updateNextDisable: (data) =>
      dispatch({ type: "UPDATE_NEXT_DISABLE_BOOL", payload: data }),
    updateMaterialScreenSelectedTab: (data) =>
      dispatch({ type: "UPDATE_MATERIAL_SCREEN_SELECTED_TAB", payload: data }),
    updateZoomIndex: (data) =>
      dispatch({ type: "UPDATE_ZOOM_INDEX", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(MainContainer)
);
