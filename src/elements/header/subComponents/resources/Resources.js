/** @format */

import React, { useState } from "react";
import "./Resources.css";
import {
  getIsLabNotebook,
  imagePath,
  storeLabNotebookPagesDataToScorm,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../../../../helper/Helper";
import CustomButton from "../../../../components/CustomButton";
import { connect } from "react-redux";
import ResourceSideBar from "../../../../components/ResourceSideBar";
import { withScorm } from "react-scorm-provider-v2";

const Resources = (props) => {
  let windowObj = getCommonWindowObj();
  windowObj.listeners = windowObj.listeners ? windowObj.listeners : [];
  setCommonWindowObj(windowObj);
  const keyboardHandler = (e) => {
    // console.log(e.keyCode);
    // For Escape Key
    if (e.keyCode === 27) {
      const tList = document.querySelectorAll(".resource-holder");
      if (tList.length >= 1) {
        document.getElementsByClassName("icon-button resorce-button ")[0].click();
      }
    }
  };
  windowObj = getCommonWindowObj();
  {
    windowObj.listeners.push(
      document.addEventListener("keyup", keyboardHandler)
    );
    setCommonWindowObj(windowObj);
    // console.log(windowObj);
  }
  
  const resorceURL = imagePath(
    props.data && props.data.headerData.images.resourceImage
  );
  const resorceHURL = imagePath(
    props.data && props.data.headerData.images.resourceImageH
  );

  let [imageSrc, setImageSrc] = useState(resorceURL);

  const resorceHandler = (e) => {
    switch (e.type) {
      case "mouseover":
        setImageSrc(resorceHURL);
        break;
      case "mouseout":
        setImageSrc(resorceURL);
        break;
      case "click":
        const page = props.labNotebookPages ? props.labNotebookPages : 0;
        if (props.showLightBox && getIsLabNotebook())
          storeLabNotebookPagesDataToScorm(
            props.sco,
            props.hasLabNotebookSubmitted,
            page
          );
        props.updateResourceSideBarBool(!props.showResourceSideBarBool);
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
        break;
      default:
        break;
    }
  };


  return props.visible !== false ? (
    <React.Fragment>
      <CustomButton
        id='resource-button'
        className={`resorce-button ${props.showLightBox ? "disable-lab" : ""}`}
        onClick={resorceHandler}
        onMouseOver={resorceHandler}
        onMouseOut={resorceHandler}
        type='icon'
        url={imageSrc}
        ariaHidden={props.showLightBox ? true : false}
        disabled={props.showLightBox ? true : false}
        btnTitle='Open Resources'
      ></CustomButton>
      <ResourceSideBar />
    </React.Fragment>
  ) : (
    <></>
  );
};
const mapStateToProps = (state) => {
  return {
    showMenuBool: state.showMenuBool,
    showResourceSideBarBool: state.showResourceSideBarBool,
    showLightBox: state.showLightBox,
    showGlossarySideBarBool: state.showGlossarySideBarBool,
    hasLabNotebookSubmitted: state.hasLabNotebookSubmitted,
    labNotebookPages: state.labNotebookPages,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateMenuBool: (data) =>
      dispatch({ type: "UPDATE_MENU_BOOL", payload: data }),
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
    updateGlossarySideBarBool: (data) =>
      dispatch({ type: "SHOW_GLOSSARY_SIDEBAR_BOOL", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(Resources)
);
