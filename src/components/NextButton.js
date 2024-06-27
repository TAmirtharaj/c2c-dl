import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import {
  imagePath,
  updateScormData,
  BrowserDetect,
  storeLabNotebookPagesDataToScorm,
  setScroll,
  getCommonWindowObj,
  setCommonWindowObj,
  getIsLabNotebook,
  callScoreEveryPage,
} from "../helper/Helper";
import "./CommonButton.css";
import PopUp from "./PopUp";
import { useEffect } from "react";

let canRun = true;

const NextButton = (props) => {
  const imageHover = imagePath("core/nextH.svg");
  const imageOut = imagePath("core/next.svg");
  let [image, setImage] = useState(imageOut);
  let windowObj = getCommonWindowObj();
  let classList = props.nextDisable
    ? `next-button common disable-button`
    : `next-button common`;
  const isMobileDevice = BrowserDetect.isMobile();
  // if (props.hideNavigation) {
  //   classList = classList + " force-disable";
  // }

  const hideNavigation = useSelector((state) => state.hideNavigation);
  // console.log("classlist---->", classList, classList + " force-disable");
  // console.log("Next Component");
  useEffect(() => {
    console.log(
      "HIDE NAVIGATION TRIGGERED------------------------::::",
      hideNavigation
    );
  }, [hideNavigation]);
  const handleHoverIn = (e) => {
    setImage(imageHover);
    document.getElementById("Next").childNodes[1].style.color = "#123457";
  };
  const handleHoverOut = (e) => {
    setImage(imageOut);
    document.getElementById("Next").childNodes[1].style.color = "white";
  };
  const clickHandler = (e) => {
    // if (window.assementObj) window.assementObj = null;
    props.updateHideNavigationBool(true);
    console.log(
      "next bool changed--------------------->",
      props.hideNavigation
    );
    const page = props.labNotebookPages ? props.labNotebookPages : 0;
    if (props.showLightBox && getIsLabNotebook())
      storeLabNotebookPagesDataToScorm(
        props.sco,
        props.hasLabNotebookSubmitted,
        page
      );

    const lightbox = document.querySelector(".bodyContainer");
    lightbox.scrollTop = 0;

    setScroll();

    if (props.materialScreenSelectedTab !== 0) {
      props.updateMaterialScreenSelectedTab(0);
    }

    if (isMobileDevice) {
      props.updateMaterialScreenSelectedTab(-1);
    }
    let _currentPage =
      props.courseData.pages[props.currentSection].pages[props.currentScene]
        .pages[props.currentSubScene];

    const nextPage =
      props.courseData.pages[props.currentSection].pages[
        props.currentScene + 2
      ];
    if (nextPage) {
      // console.log("current page", nextPage.title === "Pre-Lab Assessment");
      windowObj.isNextPagePrelab = nextPage.title === "Pre-Lab Assessment";
      setCommonWindowObj(windowObj);
    }

    // if(props.preLabStatus){
    // console.log("prelab status", props.preLabStatus);
    // }
    let _nextpage;
    let myTimeout;

    const updatePage = () => {
      let counter = props.currentPage;
      counter = counter + 1;

      const subScenePointer =
        props.visitedArray[props.currentSection][props.currentScene].length;
      const scenePointer = props.visitedArray[props.currentSection].length;
      const sectPointer = props.visitedArray.length;

      const commonCheck = () => {
        if (scenePointer - 1 === props.currentScene) {
          if (sectPointer - 1 === props.currentSection) {
            // THIS WILL BE LAST PAGE OF THE COURSE
            console.log("last page of the course");
            // console.log("Condition 0");
          } else {
            // This condition will trigger when user will be on the last scene and last sub scene in the course.
            // In this condition Section will be increamented by 1;
            const cSection = props.currentSection + 1;
            const cScene = 0;
            const cSubScene = 0;
            props.updateSection(cSection);
            props.updateScene(cScene);
            props.updateSubScene(cSubScene);
            // console.log("Condition 1");
            updateScormData(
              props.sco,
              cSection,
              cScene,
              cSubScene,
              props.visitedArray
            );
          }
        } else {
          // This condition will trigger when user will be on the last sub scene in the course.
          // In this condition Scene will be increamented by 1;
          // In this condition Sub Scene will be reset to 0;
          const cSection = props.currentSection;
          const cScene = props.currentScene + 1;
          const cSubScene = 0;
          props.updateScene(cScene);
          props.updateSubScene(cSubScene);
          // console.log("Condition 2");
          updateScormData(
            props.sco,
            cSection,
            cScene,
            cSubScene,
            props.visitedArray,
            new Date()
          );
        }
      };

      // In the below condition, if condition will trigger in case of 3 tier Menu and else will trigger in case of 2 tier menu.
      // Internal if condition will be same in above and below conditions.
      if (subScenePointer) {
        const materialFlag =
          props.data.pages[props.currentSection].pages[props.currentScene]
            .title === "Materials";
        if (materialFlag || subScenePointer - 1 === props.currentSubScene) {
          commonCheck();
        } else {
          const cSection = props.currentSection;
          const cScene = props.currentScene;
          const cSubScene = props.currentSubScene + 1;
          props.updateSubScene(cSubScene);
          // console.log("Condition 3");
          updateScormData(
            props.sco,
            cSection,
            cScene,
            cSubScene,
            props.visitedArray,
            new Date()
          );
        }
      } else {
        commonCheck();
      }

      // console.log("=========================================================================");

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
    var saveExitButton = document.getElementById("save-placeholder");
    console.log("llplokokmo", saveExitButton);

    // document
    //   .getElementById("save-placeholder")
    //   .addEventListener("mouseleave", function () {
    //     // updateScormData(
    //     //   props.sco,
    //     //   props.currentSection + 1,
    //     //   props.currentScene,
    //     //   props.currentSubScene
    //     // );
    //     updatePage();
    //     console.log("Mouse has left the iframe");
    //   });
    callScoreEveryPage(props.sco);
    setImage(imageOut);
    document.getElementById("Next").childNodes[1].style.color = "white";
    updatePage();
  };

  return (
    <div
      style={Object.assign({
        display: "inline-flex",
        alignItems: "center",
      })}
    >
      <button
        id="Next"
        className={`${classList} ${hideNavigation ? "force-disable" : ""} ${
          props.showLightBox ? "disable-lab" : ""
        }`}
        style={{
          width: "100px",
        }}
        onMouseOver={BrowserDetect.isDevice() ? false : handleHoverIn}
        onMouseOut={BrowserDetect.isDevice() ? false : handleHoverOut}
        onClick={
          classList.indexOf(`disable-button`) !== -1 ? () => {} : clickHandler
        }
        aria-label="Go to next page"
        tabIndex={classList.indexOf(`disable-button`) !== -1 ? "-1" : "0"}
        aria-hidden={false}
        disabled={props.nextDisable ? true : props.showLightBox ? true : false}
        title="Next"
        // title='Go to next page'
      >
        <img
          draggable={false}
          src={image}
          alt="next"
          width="15"
          height="25"
          // aria-label='Next'
          aria-hidden={classList.indexOf(`disable-button`) !== -1}
        />
        <div aria-hidden={classList.indexOf(`disable-button`) !== -1}>
          {" "}
          Next{" "}
        </div>
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
    courseData: state.courseData,
    nextDisable: state.nextDisable,
    showLightBox: state.showLightBox,
    materialScreenSelectedTab: state.materialScreenSelectedTab,
    showResourceSideBarBool: state.showResourceSideBarBool,
    showGlossarySideBarBool: state.showGlossarySideBarBool,
    preLabStatus: state.preLabStatus,
    labNotebookPages: state.labNotebookPages,
    hasLabNotebookSubmitted: state.hasLabNotebookSubmitted,
    showLightBox: state.showLightBox,
    hideNavigation: state.hideNavigation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSection: (data) =>
      dispatch({
        type: "UPDATE_SECTION",
        payload: data,
      }),
    updateScene: (data) =>
      dispatch({
        type: "UPDATE_SCENE",
        payload: data,
      }),
    updateSubScene: (data) =>
      dispatch({
        type: "UPDATE_SUB_SCENE",
        payload: data,
      }),
    updateMenuBool: (data) =>
      dispatch({
        type: "UPDATE_MENU_BOOL",
        payload: data,
      }),
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateMaterialScreenSelectedTab: (data) =>
      dispatch({ type: "UPDATE_MATERIAL_SCREEN_SELECTED_TAB", payload: data }),
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
    updateGlossarySideBarBool: (data) =>
      dispatch({ type: "SHOW_GLOSSARY_SIDEBAR_BOOL", payload: data }),
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(NextButton)
);
