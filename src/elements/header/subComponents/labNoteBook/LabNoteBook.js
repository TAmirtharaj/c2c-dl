/** @format */

import "./LabNoteBook.css";
import {
  imagePath,
  BrowserDetect,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../../../../helper/Helper";
import { connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import { useState , useRef } from "react";

const LabNoteBook = (props) => {
  const imageHover = imagePath("core/LabNoteIconH.svg");
  const imageOut = imagePath("core/LabNoteIcon.svg");
  let [hoverState, setHoverState] = useState(false);
  let windowObj = getCommonWindowObj();
  const classList =
    props.assessmentStatus === "passed" && !props.showLightBox
      ? `labNoteBookWrapper`
      : `labNoteBookWrapper disable-button`;
  // const classList = props.assessmentStatus === "passed" ? `labNoteBookWrapper` : `labNoteBookWrapper`;

  let userName;
  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    const scromUserData = scromData["userName"];
    userName = scromUserData ? scromUserData : "";
    windowObj["userName"] = userName;
  } else {
    userName = windowObj["userName"] ? windowObj["userName"] : "";
  }
  setCommonWindowObj(windowObj);
  const labNoteBookRef = useRef(null);
  const clickHandler = (e) => {
    switch (e.type) {
      case "click":
        const type = userName ? "LabNoteBook" : "UserInformation";
        props.updateShowLightBoxBool(true);
        props.updateLightBoxData({
          type,
          refs: labNoteBookRef
        });

        document.activeElement.blur();
        if (props.showMenuBool) {
          props.updateMenuBool(false);
        }
        if (props.showResourceSideBarBool) {
          props.updateResourceSideBarBool(false);
        }
        if (props.showGlossarySideBarBool) {
          props.updateGlossarySideBarBool(false);
        }
        break;
      case "mouseover":
        setHoverState(true);
        if(document.getElementById("labNoteBookText"))
        {document.getElementById("labNoteBookText").style.color = "#123457";}
        break;
      case "mouseout":
        setHoverState(false);
        if(document.getElementById("labNoteBookText"))
        {document.getElementById("labNoteBookText").style.color = "#0062B8";}
        break;
      default:
        break;
    }
  };

  return props.visible !== false ? (
    <button
      className={classList}
      onClick={clickHandler}
      onMouseOver={clickHandler}
      onMouseOut={clickHandler}
      ref={labNoteBookRef}
      disabled={props.assessmentStatus === "passed" ? false : true}
      tabIndex={classList.indexOf(`disable-button`) !== -1 ? "-1" : "0"}
      aria-label='Lab Notebook'
      aria-hidden={false}
      title='Open Lab Notebook'
    >
      <img
        draggable={false}
        src={hoverState ? imageHover : imageOut}
        alt={imageOut}
        className='labNoteBookIcon'
        aria-label='Lab Notebook'
        aria-hidden={true}
      />
      {BrowserDetect.isMobile() ? (
        false
      ) : (
        <div className='labNoteBookText' id='labNoteBookText' aria-hidden={true}>
          Lab Notebook
        </div>
      )}
    </button>
  ) : (
    <></>
  );
};

const mapStateToProps = (state) => {
  return {
    showLightBox: state.showLightBox,
    showMenuBool: state.showMenuBool,
    assessmentStatus: state.assessmentStatus,
    showResourceSideBarBool: state.showResourceSideBarBool,
    showGlossarySideBarBool: state.showGlossarySideBarBool,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
    updateMenuBool: (data) =>
      dispatch({ type: "UPDATE_MENU_BOOL", payload: data }),
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
    updateGlossarySideBarBool: (data) =>
      dispatch({ type: "SHOW_GLOSSARY_SIDEBAR_BOOL", payload: data }),
  };
};
export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(LabNoteBook)
);
