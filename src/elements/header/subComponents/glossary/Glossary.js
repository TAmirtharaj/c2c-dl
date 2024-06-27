/** @format */

import React, { useState } from "react";
import "./Glossary.css";
import {
  getCurrentLabNotebookPage,
  getIsLabNotebook,
  imagePath,
  storeLabNotebookPagesDataToScorm,
} from "../../../../helper/Helper";
import CustomButton from "../../../../components/CustomButton";
import { connect } from "react-redux";
import GlossarySlideBar from "../../../../components/GlossarySlideBar";
import { withScorm } from "react-scorm-provider-v2";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const Glossary = (props) => {
  const glossaryImage = imagePath(
    props.data && props.data.headerData.images.glossaryImage
  );
  const glossaryImageH = imagePath(
    props.data && props.data.headerData.images.glossaryImageH
  );

  let [imageSrc, setImageSrc] = useState(glossaryImage);

  const glossaryHandler = (e) => {
    switch (e.type) {
      case "mouseover":
        setImageSrc(glossaryImageH);
        break;
      case "mouseout":
        setImageSrc(glossaryImage);
        break;
      case "click":
        // console.log("Glossary Button clicked");
        const page = getCurrentLabNotebookPage()
          ? getCurrentLabNotebookPage()
          : 0;

        console.log("lab notebook page--->", page, getIsLabNotebook());
        props.updateShowLightBoxBool(false);
        props.updateLightBoxData(undefined);
        document.querySelectorAll(".toolbar-class").forEach((item) => {
          if (item) item.style.visibility = "hidden";
        });

        if (props.showLightBox && getIsLabNotebook())
          storeLabNotebookPagesDataToScorm(
            props.sco,
            props.hasLabNotebookSubmitted,
            page
          );
        // const editor = document
        //   .querySelector(".toolbar-class");

        // document.getElementsByClassName("lightbox-closebtn")[0].click();

        props.updateGlossarySideBarBool(!props.showGlossarySideBarBool);

        if (props.showMenuBool) {
          props.updateMenuBool(false);
        }
        if (props.showResourceSideBarBool) {
          props.updateResourceSideBarBool(false);
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
        id='glossary-button'
        className={`glossary-button ${props.showLightBox ? "disable-lab" : ""}`}
        onClick={glossaryHandler}
        onMouseOver={glossaryHandler}
        onMouseOut={glossaryHandler}
        type='icon'
        url={imageSrc}
        tabIndex='0'
        ariaHidden={props.showLightBox ? true : false}
        ariaLabel='glossary'
        btnTitle='Open Glossary'
        disabled={props.showLightBox ? true : false}
      ></CustomButton>
      <GlossarySlideBar />
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
    labNotebookPages: state.labNotebookPages,
    hasLabNotebookSubmitted: state.hasLabNotebookSubmitted,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
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
  connect(mapStateToProps, mapDispatchToProps)(Glossary)
);
