import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import {
  imagePath,
  updateScormData,
  storeLabNotebookPagesDataToScorm,
  setScroll,
  getCommonWindowObj,
  setCommonWindowObj,
  BrowserDetect,
  getIsLabNotebook,
} from "../helper/Helper";
import "./CommonButton.css";

const BackButton = (props) => {
  const isMobileDevice = BrowserDetect.isMobile();
  const imageHover = imagePath("core/backH.svg");
  const imageOut = imagePath("core/back.svg");
  let [image, setImage] = useState(imageOut);
  let classList =
    props.currentSection === 0 &&
    props.currentScene === 0 &&
    props.currentSubScene === 0
      ? `back-button common disable-button`
      : `back-button common`;
  // console.log("Back Component");
  const handleHoverIn = (e) => {
    setImage(imageHover);
    document.getElementById("Back").childNodes[0].style.color = "#123457";
  };

  const hideNavigation = useSelector((state) => state.hideNavigation);
  useEffect(() => {
    console.log(
      "HIDE NAVIGATION TRIGGERED------------------------::::",
      hideNavigation
    );
  }, [hideNavigation]);

  const handleHoverOut = (e) => {
    setImage(imageOut);
    document.getElementById("Back").childNodes[0].style.color = "white";
  };
  const clickHandler = (e) => {
    props.updateHideNavigationBool(true);
    let windowObj = getCommonWindowObj();
    if (windowObj.assementObj) {
      windowObj.assementObj = null;
      setCommonWindowObj(windowObj);
    }
    const page = props.labNotebookPages ? props.labNotebookPages : 0;

    console.log("labPage------------>", props.labNotebookPages);
    if (props.showLightBox && getIsLabNotebook())
      storeLabNotebookPagesDataToScorm(
        props.sco,
        props.hasLabNotebookSubmitted,
        page
      );
    if (isMobileDevice) {
      props.updateMaterialScreenSelectedTab(-1);
    }
    setScroll(0);
    const lightbox = document.querySelector(".bodyContainer");
    lightbox.scrollTop = 0;
    //console.log(e);\

    // console.log("=========================================================================");

    const subScenePointer =
      props.visitedArray[props.currentSection][props.currentScene].length;

    const commonCheck = () => {
      if (props.currentScene === 0) {
        if (props.currentSection === 0) {
          // THIS WILL BE FIRST PAGE OF THE COURSE
          console.log("last page of the course");
          // console.log("Condition 0");
        } else {
          // This condition will trigger when user will be on the First scene and First sub scene in the course.
          // In this condition Section will be decremented by 1;
          const cSection = props.currentSection - 1;
          const cScene = props.visitedArray[cSection].length - 1;
          const cSubScene = props.visitedArray[cSection][cScene].length - 1;
          props.updateSection(cSection);
          props.updateScene(cScene);
          props.updateSubScene(cSubScene);
          updateScormData(
            props.sco,
            cSection,
            cScene,
            cSubScene,
            props.visitedArray,
            new Date()
          );
          // console.log("Condition 1", props.visitedArray);
        }
      } else {
        // This condition will trigger when user will be on the first sub scene in the course.
        // In this condition Scene will be decremented by 1;
        // In this condition Sub Scene will be reset to 0;
        const cSection = props.currentSection;
        const cScene = props.currentScene - 1;
        const cSubScene = props.visitedArray[cSection][cScene].length - 1;
        props.updateScene(cScene);
        props.updateSubScene(cSubScene);
        updateScormData(
          props.sco,
          cSection,
          cScene,
          cSubScene,
          props.visitedArray
        );
        // console.log("Condition 2", props.visitedArray);
      }

      setImage(imageOut);
      document.getElementById("Back").childNodes[0].style.color = "white";
    };

    if (props.assessmentStartedBool) {
      props.updateAssessmentScreenNum(0);
      props.updateAssessmentStartedBool(false);
    } else {
      // In the below condition, if condition will trigger in case of 3 tier Menu and else will trigger in case of 2 tier menu.
      // Internal if condition will be same in above and below conditions.
      if (subScenePointer) {
        const materialFlag =
          props.data.pages[props.currentSection].pages[props.currentScene]
            .title === "Materials";
        if (materialFlag || props.currentSubScene === 0) {
          commonCheck();
        } else {
          const cSection = props.currentSection;
          const cScene = props.currentScene;
          const cSubScene = props.currentSubScene - 1;
          props.updateSubScene(cSubScene);
          updateScormData(
            props.sco,
            cSection,
            cScene,
            cSubScene,
            props.visitedArray,
            new Date()
          );
          // console.log("Condition 3", props.visitedArray);
        }
      } else {
        commonCheck();
      }
    }

    /* console.log(
      "========================================================================="
    ); */

    if (props.showMenuBool) {
      props.updateMenuBool(false);
    }
    if (props.showResourceSideBarBool) {
      props.updateResourceSideBarBool(false);
    }
    if (props.showGlossarySideBarBool) {
      props.updateGlossarySideBarBool(false);
    }
    if (props.showLightBox) {
      props.updateShowLightBoxBool(false);
    }
  };
  return (
    <div
      style={Object.assign({
        display: "inline-flex",
        alignItems: "center",
      })}
    >
      <button
        id='Back'
        className={`${classList} ${hideNavigation ? "force-disable" : ""} ${
          props.showLightBox ? "disable-lab" : ""
        }`}
        style={{ width: "100px", marginRight: "13px" }}
        onMouseEnter={handleHoverIn}
        onMouseLeave={handleHoverOut}
        onClick={
          classList.indexOf(`disable-button`) !== -1 ? () => {} : clickHandler
        }
        aria-label='Go to previous page'
        tabIndex={classList.indexOf(`disable-button`) !== -1 ? "-1" : "0"}
        aria-hidden={false}
        disabled={
          classList.indexOf(`disable-button`) !== -1
            ? true
            : props.showLightBox
            ? true
            : false
        }
        title='Back'
        // title='Go to previous page'
      >
        <div aria-hidden={classList.indexOf(`disable-button`) !== -1}>Back</div>
        <img
          draggable={false}
          src={image}
          alt='next'
          width='15'
          height='25'
          // aria-label='Back'
          aria-hidden={classList.indexOf(`disable-button`) !== -1}
        />
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    visitedArray: state.visitedArray,
    currentSection: state.currentSection,
    currentScene: state.currentScene,
    currentSubScene: state.currentSubScene,
    showMenuBool: state.showMenuBool,
    showLightBox: state.showLightBox,
    assessmentStartedBool: state.assessmentStartedBool,
    showResourceSideBarBool: state.showResourceSideBarBool,
    showGlossarySideBarBool: state.showGlossarySideBarBool,
    labNotebookPages: state.labNotebookPages,
    hasLabNotebookSubmitted: state.hasLabNotebookSubmitted,
    showLightBox: state.showLightBox,
    hideNavigation: state.hideNavigation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageArrayData: (data) =>
      dispatch({ type: "UPDATE_PAGE_ARRAY", payload: data }),
    updateSection: (data) =>
      dispatch({ type: "UPDATE_SECTION", payload: data }),
    updateScene: (data) => dispatch({ type: "UPDATE_SCENE", payload: data }),
    updateSubScene: (data) =>
      dispatch({ type: "UPDATE_SUB_SCENE", payload: data }),
    updateMenuBool: (data) =>
      dispatch({ type: "UPDATE_MENU_BOOL", payload: data }),
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateAssessmentScreenNum: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_SCREEN_NUM", payload: data }),
    updateAssessmentStartedBool: (data) =>
      dispatch({ type: "UPDATE_ASSESSMENT_STARTED_BOOL", payload: data }),
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
    updateGlossarySideBarBool: (data) =>
      dispatch({ type: "SHOW_GLOSSARY_SIDEBAR_BOOL", payload: data }),
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
    updateMaterialScreenSelectedTab: (data) =>
      dispatch({ type: "UPDATE_MATERIAL_SCREEN_SELECTED_TAB", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(BackButton)
);
