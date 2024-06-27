/** @format */

import React, { useEffect , useRef } from "react";
import { withScorm } from "react-scorm-provider-v2";
import { returnComponent } from "../../createComponent/CreateComponent";
import "./Steps.css";
import SubSteps from "./SubSteps";
import { getCommonWindowObj, setCommonWindowObj } from "../../helper/Helper";

// import { Row } from "react-bootstrap";

const Steps = (props) => {
  const scormAPI = props.sco.apiConnected;
  let windowObj = getCommonWindowObj();
  const stepRef = useRef(null);
  // console.log(props);
  let suspendData;
  if (!windowObj.btnState) {
    windowObj.btnState = {};
  }
  if (!windowObj.btnState[`${props.keyID}`]) {
    windowObj.btnState[`${props.keyID}`] = [];
  }
  setCommonWindowObj(windowObj);
  // if (!window.scrollState) {
  //   window.scrollState = {};
  // }
  // if (!window.scrollState[`${props.keyID}`]) {
  //   window.scrollState[`${props.keyID}`] = [];
  // } else {
  //   const bodyContainer = document.querySelector(".bodyContainer");
  //   if (bodyContainer && window.scrollState[`${props.keyID}`]) {
  //     // console.log("scroll value set", window.scrollState[`${props.keyID}`]);
  //     bodyContainer.scrollTop = window.scrollState[`${props.keyID}`];
  //   }
  // }

  // if (scormAPI) {
  //   suspendData = props.sco.suspendData;
  //   window.btnState = suspendData.btnState
  //     ? suspendData.btnState
  //     : window.btnState;
  //   window.scrollState = suspendData.scrollState
  //     ? suspendData.scrollState
  //     : window.scrollState;

  //   const bodyContainer = document.querySelector(".bodyContainer");
  //   if (bodyContainer && window.scrollState[`${props.keyID}`]) {
  //     // console.log("scroll value set", window.scrollState[`${props.keyID}`]);
  //     bodyContainer.scrollTop = window.scrollState[`${props.keyID}`];
  //   }
  // }

  const Components = [],
    comp = [];
  let classList = "";
  props.content.forEach((data) => {
    if (data.type === "Plain") {
      classList = "step-comp-plainText";
    }
    Components.push(returnComponent(data, { classList }));

    data.typeBefore &&
      data.typeBefore.forEach((temp) => comp.push(returnComponent(temp)));
    data.typeAfter &&
      data.typeAfter.forEach((temp) => comp.push(returnComponent(temp)));
  });

  const subList = props.content.some((data) => data.hasOwnProperty("child"));

  const stepCount =
    props.stepCount < 10 ? `0${props.stepCount}` : props.stepCount;

  windowObj = getCommonWindowObj();
  const subClassList = windowObj.btnState
    ? windowObj.btnState[`${props.keyID}`] &&
      windowObj.btnState[`${props.keyID}`][props.index - 1]
      ? "step-comp-step-box clicked"
      : "step-comp-step-box"
    : "step-comp-step-box";

  let stepsAriaLabel = windowObj.btnState
    ? windowObj.btnState[`${props.keyID}`] &&
      windowObj.btnState[`${props.keyID}`][props.index - 1]
      ? "Selected"
      : "Unselected"
    : "Unselected";

  useEffect(() => {
    console.log("steps rendered");
    stepsAriaLabel = windowObj.btnState
    ? windowObj.btnState[`${props.keyID}`] &&
      windowObj.btnState[`${props.keyID}`][props.index - 1]
      ? "Selected"
      : "Unselected"
    : "Unselected";
  });

  // function getScroll() {
  //   console.log("getScroll called");
  //   const bodyContainer = document.querySelector(".bodyContainer");
  //   if (bodyContainer) {
  //     if (bodyContainer.scrollTop)
  //       window.scrollState[`${props.keyID}`] = bodyContainer.scrollTop;
  //     else window.scrollState[`${props.keyID}`] = 0;
  //     console.log(
  //       "bodycontainer scroll position",
  //       window.scrollState[`${props.keyID}`]
  //     );
  //     if (scormAPI) {
  //       props.sco.setSuspendData("scrollState", window.scrollState);
  //     }
  //   }
  // }

  // const bodyContainer = document.querySelector(".bodyContainer");
  // if (bodyContainer) {
  //   var timer = null;
  //   bodyContainer.addEventListener("scroll", () => {
  //     console.log("scroll detected");

  //     if (timer !== null) {
  //       clearTimeout(timer);
  //     }
  //     timer = setTimeout(function () {
  //       // do something
  //       console.log("scroll ended");
  //       getScroll();
  //     }, 150);
  //   });
  // }
  function updateState(e) {
    // props.getScroll();
    windowObj = getCommonWindowObj();
    const classList =
      e.target.getElementsByClassName("step-comp-step-box")[0].classList;
    let text;
    let myArray;
    if (classList.value.indexOf("clicked") === -1) {
      e.target
        .getElementsByClassName("step-comp-step-box")[0]
        .classList.add("clicked");
      windowObj.btnState[`${props.keyID}`][props.index - 1] = 1;
      text = e.target
        .getElementsByClassName("step-comp-step-box")[0].ariaLabel;
      myArray = text.split(",");
      e.target
        .getElementsByClassName("step-comp-step-box")[0].ariaLabel = myArray[0].concat(", selected"); 
    } else {
      e.target
        .getElementsByClassName("step-comp-step-box")[0]
        .classList.remove("clicked");
      windowObj.btnState[`${props.keyID}`][props.index - 1] = 0;
      text = e.target
        .getElementsByClassName("step-comp-step-box")[0].ariaLabel;
      myArray = text.split(",");
      e.target
        .getElementsByClassName("step-comp-step-box")[0].ariaLabel = myArray[0].concat(", unselected"); 
    }
    if (scormAPI) {
      props.sco.setSuspendData("btnState", windowObj.btnState);
    }
    stepsAriaLabel = windowObj.btnState
    ? windowObj.btnState[`${props.keyID}`] &&
      windowObj.btnState[`${props.keyID}`][props.index - 1]
      ? "Selected"
      : "Unselected"
    : "Unselected";
  }

  const typeStyle = {
    maxWidth: "80%",
  };
  const typeClassList = "type-comp-wrapper";

  return (
    <div className="step-comp-wrapper row">
      {props.content.map(
        (content, index) =>
          content.typeBefore && (
            <div key={index}>
              <div className={typeClassList} style={typeStyle}>
                {comp}
              </div>
            </div>
          )
      )}
      <button
        className="step-comp-step-label-col-width col-md-2"
        style={props.stepStyle}
        ref={stepRef}
        onClick={updateState}
        title={`Step ${props.index - props.stepBreak}`}
      >
        <div
          className={subClassList}
          aria-label={`Step ${stepCount}, ${stepsAriaLabel}`}
          aria-hidden={false}
        >
          <div className="step-comp-step-text" aria-hidden={true}>
            {"Step"}
          </div>
        </div>
        <div className="step-comp-step-count-text" aria-hidden={true}>
          {stepCount}
        </div>
      </button>
      <div className="col" style={{ width: "calc(100% - 100px)" }}>
        <div className="step-comp-step-content">{Components}</div>

        {subList
          ? props.content.map((data) => {
              return data.child.map((subContent, index) => {
                return (
                  <SubSteps
                    stepCount={index + 97}
                    content={subContent}
                    key={`subSteps_${index}`}
                    // getScroll={props.getScroll}
                  />
                );
              });
            })
          : ""}
      </div>
      {props.content.map(
        (content) =>
          content.typeAfter && (
            <div>
              <div className={typeClassList} style={typeStyle}>
                {comp}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default withScorm()(Steps);
