/** @format */

import React, { useLayoutEffect, useState } from "react";
import "./Menu.css";
import CustomButton from "../../../../components/CustomButton";
import {
  BrowserDetect,
  getIsLabNotebook,
  imagePath,
  storeLabNotebookPagesDataToScorm,
} from "../../../../helper/Helper";
import { connect, useSelector } from "react-redux";
import MenuHolder from "../../../menuHolder/MenuHolder";
import { withScorm } from "react-scorm-provider-v2";

const Menu = (props) => {
  const isMobileDevice = BrowserDetect.isMobile();
  const menuButtonURL = imagePath(
    props.data && props.data.headerData.images.menuIcon
  );
  const hideNavigation = useSelector((state) => state.hideNavigation);
  const menuButtonHURL = imagePath(
    props.data && props.data.headerData.images.menuIconH
  );
  let [hoverState, setHoverState] = useState(false);
  const showMenuBool =
    typeof props.showMenuBool === "undefined" ? false : props.showMenuBool;
  let [holderHeight, setHolderHeight] = useState(0);

  const menuHandler = (e) => {
    switch (e.type) {
      case "mouseover":
        setHoverState(true);
        break;
      case "mouseout":
        setHoverState(false);
        break;
      case "click":
        const page = props.labNotebookPages ? props.labNotebookPages : 0;
        if (props.showLightBox && getIsLabNotebook()) {
          storeLabNotebookPagesDataToScorm(
            props.sco,
            props.hasLabNotebookSubmitted,
            page
          );
        }

        setHolderHeight(
          document.getElementsByClassName("bodyHolder")[0].clientHeight
        );
        props.updateMenuBool(!showMenuBool);

        if (props.showMenuBool) {
          props.updateMenuBool(false);
        }
        if (props.showResourceSideBarBool) {
          props.updateResourceSideBarBool(false);
        }
        if (props.showGlossarySideBarBool) {
          props.updateGlossarySideBarBool(false);
        }

        if (isMobileDevice) {
          props.updateMaterialScreenSelectedTab(-1);
        }
        break;
      default:
        break;
    }
  };
  useLayoutEffect(() => {
    function updateSize() {
      setHolderHeight(
        document.getElementsByClassName("bodyHolder")[0].clientHeight
      );
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <React.Fragment>
      <CustomButton
        className={`menu-button ${hideNavigation ? "force-disable" : ""} ${
          props.showLightBox ? "disable-lab" : ""
        }`}
        onClick={menuHandler}
        onMouseOver={menuHandler}
        onMouseOut={menuHandler}
        disabled={props.showLightBox ? true : false}
        type='icon'
        url={
          props.showMenuBool
            ? menuButtonHURL
            : hoverState
            ? menuButtonHURL
            : menuButtonURL
        }
        btnTitle='Open Table of Contents'
        tabIndex='0'
        ariaLabel='Menu'
        ariaHidden='false'
      ></CustomButton>
      {props.showMenuBool ? (
        <MenuHolder data={props.data.pages} height={holderHeight} />
      ) : (
        false
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    showMenuBool: state.showMenuBool,
    showResourceSideBarBool: state.showResourceSideBarBool,
    showGlossarySideBarBool: state.showGlossarySideBarBool,
    labNotebookPages: state.labNotebookPages,
    hasLabNotebookSubmitted: state.hasLabNotebookSubmitted,
    showLightBox: state.showLightBox,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMaterialScreenSelectedTab: (data) =>
      dispatch({ type: "UPDATE_MATERIAL_SCREEN_SELECTED_TAB", payload: data }),
    updateMenuBool: (data) =>
      dispatch({ type: "UPDATE_MENU_BOOL", payload: data }),
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
    updateGlossarySideBarBool: (data) =>
      dispatch({ type: "SHOW_GLOSSARY_SIDEBAR_BOOL", payload: data }),
  };
};

export default withScorm()(connect(mapStateToProps, mapDispatchToProps)(Menu));
