/** @format */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import CustomButton from "./CustomButton";
import InfoPopUp from "./InfoPopUp";
import "./InformationIcon.css";
import {
  getCommonWindowObj,
  imagePath,
  setCommonWindowObj,
} from "../helper/Helper";
import { connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
const InformationIcon = (props) => {
  const infoButtonURL = imagePath(props.data && props.data.src);
  const infoButtonHURL = imagePath(props.data && props.data.hoverSrc);

  let [hoverState, setHoverState] = useState(false);
  let [showPopUp, setShowPopUp] = useState(false);
  let classList = `info-button `;

  // console.log(window.infoPopupClickedStatus[props.type.pageNum], "...................", props.type.pageNum);

  if (!getCommonWindowObj().infoPopupClickedStatus[props.type.pageNum]) {
    classList += `flash `;
  }

  const nextBtn = document.getElementById("Next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      setShowPopUp(false);
    });
  }

  const backBtn = document.getElementById("Back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      setShowPopUp(false);
    });
  }

  useEffect(() => {
    if (props.showMenuBool) setShowPopUp(false);
  }, [props.showMenuBool]);

  const infoHandler = (e) => {
    switch (e.type) {
      case "mouseover":
        setHoverState(true);
        break;
      case "mouseout":
        setHoverState(false);
        break;
      case "click":
        setShowPopUp(!showPopUp);
        // window.infoPopupClickedStatus[props.type.pageNum] = true;

        let windowObj = getCommonWindowObj();
        windowObj.infoPopupClickedStatus[props.type.pageNum] = true;
        setCommonWindowObj(windowObj);
        if (props.sco.apiConnected) {
          props.sco
            .setSuspendData(
              "infoPopupClickedStatus",
              getCommonWindowObj.infoPopupClickedStatus
            )
            .then((data) => {
              // console.log("info Popup Clicked Status updated...");
            });
        }
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <CustomButton
        className={classList}
        onClick={infoHandler}
        onMouseOver={infoHandler}
        onMouseOut={infoHandler}
        type='icon'
        url={
          props.showMenuBool
            ? infoButtonHURL
            : hoverState
            ? infoButtonHURL
            : infoButtonURL
        }
        tabIndex='0'
        ariaLabel='Info'
        ariaHidden={`${props.showLightBox?'true':'false'}`}
        btnTitle='Open information'
      ></CustomButton>
      {showPopUp && <InfoPopUp type={props.type.infoPopUp} data={props.data} />}
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    showMenuBool: state.showMenuBool,
    showLightBox: state.showLightBox,
  };
};

export default withScorm()(connect(mapStateToProps, null)(InformationIcon));
