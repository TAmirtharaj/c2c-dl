/** @format */

import React, { Suspense, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import InformationIcon from "../../components/InformationIcon";
import {
  imagePath,
  checkForCompletion,
  BrowserDetect,
  setScroll,
  updateScormData,
  getScroll,
  setIsLabNotebook,
  setScoRef,
} from "../../helper/Helper";
import "./Body.css";

const LaunchTemplate = React.lazy(() =>
  import("../../templates/Launch/LaunchTemplate")
);
const OverView = React.lazy(() => import("../../templates/OverView/OverView"));
const Outcomes = React.lazy(() => import("../../templates/Outcomes/Outcomes"));
const DisposalAndCleanup = React.lazy(() =>
  import("../../templates/DisposalAndCleanup/DisposalAndCleanup")
);
const Key = React.lazy(() => import("../../templates/Key/Key"));
const Background = React.lazy(() =>
  import("../../templates/Background/Background")
);
const ExperimentalDesign = React.lazy(() =>
  import("../../templates/ExperimentalDesign/ExperimentalDesign")
);
const Materials = React.lazy(() =>
  import("../../templates/Materials/Materials")
);
const Safety = React.lazy(() => import("../../templates/Safety/Safety"));
const Assessment = React.lazy(() =>
  import("../../templates/Assessment/Assessment")
);
const AssessmentIntroduction = React.lazy(() =>
  import("../../templates/Assessment/AssessmentIntroduction")
);
const LabNotebook = React.lazy(() =>
  import("../../templates/LabNotebook/LabNotebook")
);
const Completion = React.lazy(() =>
  import("../../templates/Completion/Completion")
);
const LightBox = React.lazy(() => import("../../components/LightBox"));
const KnowledgeCheck = React.lazy(() =>
  import("../../templates/Background/KnowledgeCheck")
);
const ActivityAndPreparation = React.lazy(() =>
  import("../../templates/ActivityAndPreparation/ActivityAndPreparation")
);
const WhyShouldICare = React.lazy(() =>
  import("../../templates/WhyShouldICare/WhyShouldICare")
);
const VirtualLab = React.lazy(() =>
  import("../../templates/VirtualLab/VirtualLab")
);

const HoverActivityTemplate = React.lazy(() =>
  import("../../templates/HoverActivity/HoverActivityTemplate")
);
const BodyTitle = React.lazy(() => import("../../components/BodyTitle"));
const Body = (props) => {
  /* console.log(
    "Body Component :: ",
    props.currentSection,
    props.currentScene,
    props.currentSubScene
  ); */
  //console.log(props.data.pages[props.currentSection].pages[props.currentScene]);

  useEffect(() => {
    const scrollValue = getScroll();
    const bodyContainer = document.querySelector(".bodyContainer");
    if (bodyContainer && scrollValue !== 0) {
      bodyContainer.scrollTop = scrollValue;
      // console.log("scroll value recieved", getScroll());
    }
    setScoRef(props.sco);
    setIsLabNotebook(
      props.lightBoxData && props.lightBoxData.type === "LabNoteBook"
    );

    return function cleanup() {
      console.log("Cleaning data");
    };
  });
  const imageLoaderBool = useSelector((state) => state.imageLoaderBool);

  const deviceDescription = BrowserDetect.getOrientation();
  // console.log(deviceDescription);
  const checkPreLabStatus = () => {
    // if (!props.preLabStatus) {
    let bool = true;
    for (let i = 0; i < props.visitedArray[0].length - 1; i++) {
      // console.log(props.visitedArray);
      if (props.visitedArray[0][i].length === 1) {
        if (props.visitedArray[0][i][0] !== 2) {
          bool = false;
          break;
        }
      } else {
        for (let j = 0; j < props.visitedArray[0][i].length; j++) {
          if (props.visitedArray[0][i][j] !== 2) {
            bool = false;
            break;
          }
        }
      }
    }
    // console.log("loop exit - bool : " + bool);
    return bool;
    // }
  };

  const isMaterial =
    props.courseData.pages[props.currentSection].pages[props.currentScene]
      .title === "Materials";

  //if Materials subScene made 0
  const currentSubSceneflag = isMaterial ? 0 : props.currentSubScene;
  const updatePageStatus = (boolRef = false) => {
    let currentPage;

    currentPage =
      props.courseData.pages[props.currentSection].pages[props.currentScene]
        .pages[currentSubSceneflag];

    console.log("current pagr--------------->", props.currentSubScene);
    const isKnowledgeCheck = currentPage.isKnowledgeCheck;
    const autoCompletion = currentPage.hasOwnProperty("autoCompletion");
    const isCheckPoint = currentPage.isCheckPoint;
    const isAssessment = currentPage.isAssessment;
    const isVisted =
      props.visitedArray[props.currentSection][props.currentScene][
        currentSubSceneflag
      ] === 2;
    const isLastPage =
      props.currentSection === props.courseData.pages.length - 1 &&
      props.currentScene ===
        props.courseData.pages[props.currentSection].pages.length - 1 &&
      currentSubSceneflag ===
        props.courseData.pages[props.currentSection].pages[props.currentScene]
          .pages.length -
          1;
    let nextBool = false;

    if (!isVisted) {
      if (!isKnowledgeCheck && !isAssessment && !autoCompletion) {
        // console.log(boolRef, "Simple Screen");
        props.visitedArray[props.currentSection][props.currentScene][
          currentSubSceneflag
        ] = 2;
      } else {
        // console.log(boolRef, "Activity");
        if (boolRef) {
          if (isAssessment) {
            // console.log(props.assessmentStatus);
            if (props.assessmentStatus === "passed") {
              props.visitedArray[props.currentSection][props.currentScene][
                currentSubSceneflag
              ] = 2;
            } else if (props.assessmentStatus === "failed") {
              props.visitedArray[props.currentSection][props.currentScene][
                currentSubSceneflag
              ] = 3;
              nextBool = true;
            } else {
              props.visitedArray[props.currentSection][props.currentScene][
                currentSubSceneflag
              ] = 1;
              nextBool = true;
            }
          } else {
            props.visitedArray[props.currentSection][props.currentScene][
              currentSubSceneflag
            ] = 2;
          }
        } else {
          if (
            props.visitedArray[props.currentSection][props.currentScene][
              currentSubSceneflag
            ] === 0
          ) {
            props.visitedArray[props.currentSection][props.currentScene][
              currentSubSceneflag
            ] = 1;
          }
          nextBool = true;
        }
      }
      props.updatePageArrayData(props.visitedArray);
      // if (isCheckPoint) {
      //   if (!checkPreLabStatus()) {
      //     nextBool = true;
      //   }
      // }
    }
    // Below condition is moved down from line number 175.
    if (isCheckPoint) {
      if (!checkPreLabStatus()) {
        nextBool = true;
      }
    }
    //
    if (isLastPage) nextBool = true;

    // if (!props.preLabStatus && window.isNextPagePrelab !== false) {
    //   nextBool = true;
    // } else {
    //   nextBool = false;
    // }
    props.updateNextDisable(nextBool);
  };
  const templateData = props.data.pages[props.currentSection].pages[
    props.currentScene
  ].pages[currentSubSceneflag]
    ? props.data.pages[props.currentSection].pages[props.currentScene].pages[
        currentSubSceneflag
      ]
    : props.data.pages[props.currentSection].pages[props.currentScene];
  let componentRef = "";
  let componentKey = `"sec_"+${props.currentSection}+"_sce_"+${props.currentScene}+"_subscen_"+${currentSubSceneflag}`;
  const launchURL = templateData.waterMark
    ? templateData.waterMarkImage
      ? imagePath(templateData.waterMarkImage)
      : imagePath("core/bodyBookmark.svg")
    : "";
  const additionalClass = templateData.waterMarkClass
    ? templateData.waterMarkClass
    : "bgBodyHolderPartialScreen";

  if (document.querySelector(".ContentZoomHolder")) {
    if (
      templateData.template === "LaunchTemplate" ||
      templateData.template === "VirtualLab" ||
      props.showLightBox
    ) {
      document
        .querySelector(".ContentZoomHolder")
        .classList.add("disable-button");

      document.getElementById("circle_1").disabled = true;
    } else {
      document
        .querySelector(".ContentZoomHolder")
        .classList.remove("disable-button");
      document.getElementById("circle_1").disabled = false;
    }
  }

  const calcScroll = () => {
    const bodyContainer = document.querySelector(".bodyContainer");
    if (bodyContainer) {
      if (bodyContainer.scrollTop) {
        // console.log("body scroll", bodyContainer.scrollTop);
        setScroll(bodyContainer.scrollTop);
      }
    }
  };
  // console.log("template", templateData);
  switch (templateData.template) {
    case "LaunchTemplate":
      componentRef = (
        <LaunchTemplate key={componentKey} templateData={templateData} />
      );
      break;
    case "OverView":
      componentRef = (
        <OverView key={componentKey} templateData={templateData} />
      );
      break;
    case "Outcomes":
      componentRef = (
        <Outcomes key={componentKey} templateData={templateData} />
      );
      break;
    case "DisposalAndCleanup":
      componentRef = (
        <DisposalAndCleanup key={componentKey} templateData={templateData} />
      );
      break;
    case "Key":
      componentRef = <Key key={componentKey} templateData={templateData} />;
      break;
    case "WhyShouldICare":
      componentRef = (
        <WhyShouldICare key={componentKey} templateData={templateData} />
      );
      break;
    case "Background":
      componentRef = (
        <Background key={componentKey} templateData={templateData} />
      );
      break;
    case "ExperimentalDesign":
      componentRef = (
        <ExperimentalDesign key={componentKey} templateData={templateData} />
      );
      break;
    case "Materials":
      componentRef = (
        <Materials
          key={componentKey}
          templateData={templateData}
          updatePageStatus={updatePageStatus}
        />
      );
      break;
    case "Safety":
      componentRef = <Safety key={componentKey} templateData={templateData} />;
      break;
    case "Assessment":
      //console.log("Assessment Template is called...");
      componentRef = (
        <Assessment
          key={componentKey}
          templateData={templateData}
          updatePageStatus={updatePageStatus}
        />
      );
      break;
    case "AssessmentIntroduction":
      //console.log("AssessmentIntroduction Template is called...");
      componentRef = (
        <AssessmentIntroduction
          key={componentKey}
          templateData={templateData}
        />
      );
      break;
    case "LabNotebook":
      componentRef = (
        <LabNotebook key={componentKey} templateData={templateData} />
      );
      break;
    case "Completion":
      componentRef = (
        <Completion
          key={componentKey}
          templateData={templateData}
          labNoteBookFlag={
            props.data.labNoteBookFlag === false
              ? props.data.labNoteBookFlag
              : true
          }
        />
      );
      break;
    case "KnowledgeCheck":
      componentRef = (
        <KnowledgeCheck
          key={componentKey}
          templateData={templateData}
          updatePageStatus={updatePageStatus}
        />
      );
      break;
    case "ActivityAndPreparation":
      componentRef = (
        <ActivityAndPreparation
          key={componentKey}
          templateData={templateData}
          updatePageStatus={updatePageStatus}
        />
      );
      break;
    case "VirtualLab":
      componentRef = (
        <VirtualLab
          key={componentKey}
          templateData={templateData}
          updatePageStatus={updatePageStatus}
        />
      );
      break;

    case "HoverActivityTemplate":
      componentRef = (
        <HoverActivityTemplate
          key={componentKey}
          templateData={templateData}
          updatePageStatus={updatePageStatus}
        />
      );
      break;
    default:
      break;
  }
  console.log(
    "scene id for current page---------->",
    `${props.currentSection}/${props.currentScene}/${props.currentSubScene}`
  );
  updatePageStatus();

  checkForCompletion(props.sco, props.visitedArray);

  const handleClick = (e) => {
    props.showMenuBool && props.updateMenuBool(false);
    props.updateGlossarySideBarBool && props.updateGlossarySideBarBool(false);
    props.showResourceSideBarBool && props.updateResourceSideBarBool(false);
  };

  // if (document.getElementsByClassName("customScrollbar")[0])
  //   document.getElementsByClassName("customScrollbar")[0].scrollTop = 0;

  const handleClickOfBody = (e) => {
    // console.log(
    //   "inside the handle click",
    //   e.target,
    //   e.target.closest(".glossary-text")
    // );
    calcScroll();
    if (e.target.classList.contains("resource-text")) {
      !props.showResourceSideBarBool && props.updateResourceSideBarBool(true);
    }
    if (e.target.closest(".glossary-text")) {
      props.updateGlossarySideBarBool && props.updateGlossarySideBarBool(true);
    }
    if (e.target.classList.contains("resource-text-underline")) {
      !props.showResourceSideBarBool && props.updateResourceSideBarBool(true);
    }
    if (e.target.classList.contains("glossary-text-underline")) {
      props.updateGlossarySideBarBool && props.updateGlossarySideBarBool(true);
    }
    if (e.target.classList.contains("jump-to-page-button")) {
      const sceneArray = e.target.id.split("/");
      // console.log("id of the button", +sceneArray[0]);
      // props.updateScene(+e.target.id);
      props.updateSection(+sceneArray[0]);
      props.updateScene(+sceneArray[1]);
      props.updateSubScene(+sceneArray[2]);

      updateScormData(
        props.sco,
        +sceneArray[0],
        +sceneArray[1],
        +sceneArray[2],
        props.visitedArray
      );
    }
  };

  const onBodyClick = (e) => {
    //when user click on resource text shift focus to resource button same for glossary
    if (
      e.target.classList.contains("glossary-text") ||
      e.target.classList.contains("resource-text") ||
      e.target.classList.contains("glossary-text-underline") ||
      e.target.classList.contains("resource-text-underline")
    ) {
      if (
        e.target.classList.contains("resource-text") ||
        e.target.classList.contains("resource-text-underline")
      ) {
        const resource = document.getElementById("resource-button");
        if (resource) {
          resource.focus();
        }
      }
      if (
        e.target.classList.contains("glossary-text") ||
        e.target.classList.contains("glossary-text-underline")
      ) {
        const glossary = document.getElementById("glossary-button");
        if (glossary) glossary.focus();
      }
    }
  };

  return (
    <div className='bodyHolder' onClick={onBodyClick}>
      {imageLoaderBool && <div className='image-loader'></div>}
      <div
        className={"bgBodyHolder " + additionalClass}
        style={Object.assign({}, { backgroundImage: `url(${launchURL})` })}
        onClick={
          props.showMenuBool ||
          props.showResourceSideBarBool ||
          props.showGlossarySideBarBool
            ? handleClick
            : () => {}
        }
      >
        <Suspense fallback={<div className='loader'></div>}>
          <div
            className='bodyContainer customScrollbar'
            onClick={handleClickOfBody}
            onScroll={() => {calcScroll()}}
            tabIndex='-1'
            aria-hidden={props.showLightBox ? true : false}
          >
            {templateData.hasOwnProperty("showPageTitle") &&
            templateData.showPageTitle ? (
              <div role="heading" aria-level="1" className='bodyTitle' tabIndex='-1'>
                <BodyTitle data={templateData} />
              </div>
            ) : (
              false
            )}
            <div
              className='bodyContent'
              style={
                templateData.hasOwnProperty("showPageTitle") &&
                templateData.showPageTitle
                  ? deviceDescription.type === "M" &&
                    deviceDescription.orientation === "L"
                    ? Object.assign({ height: `95%` })
                    : Object.assign({ height: `95%` })
                  : Object.assign({ height: `100%` })
              }
              onLoad={() => {
                // console.log("template loaded successfully-------!!");
                // props.updateHideNavigationBool(false);
              }}
            >
              {componentRef}
            </div>
          </div>
          {props.showLightBox && <LightBox data={props.lightBoxData} />}
          {templateData.hasOwnProperty("infoPopUp") && (
            <InformationIcon data={props.data.info} type={templateData} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    totalPages: state.totalPages,
    currentSection: state.currentSection,
    currentScene: state.currentScene,
    currentSubScene: state.currentSubScene,
    visitedArray: state.visitedArray,
    showMenuBool: state.showMenuBool,
    showLightBox: state.showLightBox,
    lightBoxData: state.lightBoxData,
    courseData: state.courseData,
    assessmentStatus: state.assessmentStatus,
    assessmentScore: state.assessmentScore,
    preLabStatus: state.preLabStatus,
    showResourceSideBarBool: state.showResourceSideBarBool,
    showGlossarySideBarBool: state.showGlossarySideBarBool,
    hideNavigation: state.hideNavigation,
    lightBoxData: state.lightBoxData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageArrayData: (data) =>
      dispatch({ type: "UPDATE_PAGE_ARRAY", payload: data }),
    updateMenuBool: (data) =>
      dispatch({ type: "UPDATE_MENU_BOOL", payload: data }),
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateNextDisable: (data) =>
      dispatch({ type: "UPDATE_NEXT_DISABLE_BOOL", payload: data }),
    updatePreLabStatus: (data) =>
      dispatch({ type: "UPDATE_PRELAB_STATUS", payload: data }),
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
    updateGlossarySideBarBool: (data) =>
      dispatch({ type: "SHOW_GLOSSARY_SIDEBAR_BOOL", payload: data }),
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
    updateScene: (data) => dispatch({ type: "UPDATE_SCENE", payload: data }),
    updateSubScene: (data) =>
      dispatch({ type: "UPDATE_SUB_SCENE", payload: data }),
    updateSection: (data) =>
      dispatch({ type: "UPDATE_SECTION", payload: data }),
  };
};

export default withScorm()(connect(mapStateToProps, mapDispatchToProps)(Body));
