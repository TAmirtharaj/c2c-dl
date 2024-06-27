/** @format */

import {React, useRef} from "react";
import "./CustomButton.css";
import {
  BrowserDetect,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../helper/Helper";

const CustomButton = (props) => {
  let windowObj = getCommonWindowObj();
  windowObj.listeners = windowObj.listeners ? windowObj.listeners : [];
  setCommonWindowObj(windowObj);
  const keyboardHandler = (e) => {
    // console.log(e.shiftKey && e.altKey, e.keyCode);
    // For Escape Key
    if (e.keyCode === 27) {
      const tList = document.querySelectorAll(".menuHolder");
      const tList1 = document.querySelectorAll(".lightbox-container");
      if (tList.length >= 1) {
        document.getElementsByClassName("menu-button")[0].click();
      }
      if (tList1.length >= 1) {
        document.getElementsByClassName("lightbox-closebtn")[0].click();
      }
    }
    if (e.shiftKey && e.altKey) {
      switch (e.keyCode) {
        case 187: // Plus
        case 189: // Minus
          if (document.getElementById("circle_2") === null) {
            document.getElementById("circle_1").click();
          }
          if (e.keyCode === 187) {
            document.getElementById("circle_3").click();
            // console.log('Zoom In');
          }
          if (e.keyCode === 189) {
            document.getElementById("circle_2").click();
            // console.log('Zoom Out');
          }
          break;
        case 66: // Back - B
          document.getElementsByClassName("back-button")[0].click();
          break;
        case 77: // Menu - M
          const tList = document.querySelectorAll(".menuHolder");
          if (tList.length < 1) {
            document.getElementsByClassName("menu-button")[0].click();
          }
          break;
        case 78: // Next - N
          document.getElementsByClassName("next-button")[0].click();
          break;
        default:
      }
    }
  };
  let customButtonRef = useRef(null);
  windowObj = getCommonWindowObj();
  if (windowObj.listeners && windowObj.listeners.length === 0) {
    windowObj.listeners.push(
      document.addEventListener("keyup", keyboardHandler)
    );
    setCommonWindowObj(windowObj);
  }
  if (props.type === "icon") {
    const classList = props.className
      ? `icon-button ${props.className}`
      : `icon-button`;

    // console.log("diable props check", props.title, props.disabled);
    return (
      <button
        id={props.id ? props.id : null}
        className={classList}
        onClick={props.onClick}
        ref={props.customButtonRef}
        aria-label={props.ariaLabel}
        onMouseOver={BrowserDetect.isDevice() ? () => {} : props.onMouseOver}
        onMouseOut={BrowserDetect.isDevice() ? () => {} : props.onMouseOut}
        tabIndex={props.tabIndex}
        aria-hidden={props.ariaHidden}
        style={{ width: props.width } && props.style}
        disabled={props.disabled ? props.disabled : false}
        title={props.btnTitle ? props.btnTitle : ""}
      >
        <img
          draggable={false}
          src={props.url}
          className={props.imgClassList}
          aria-label={props.ariaLabel}
          aria-hidden={true}
          alt={props.ariaLabel}
        ></img>
      </button>
    );
  } else {
    const classList = props.className
      ? `custom-button ${props.className}`
      : `custom-button`;
    return (
      <button
        id={props.id ? props.id : null}
        className={classList}
        onLoad={props.onLoad ? props.onLoad : null}
        style={props.style ? props.style : null}
        onClick={props.onClick}
        aria-label={props.ariaLabel}
        onMouseOver={BrowserDetect.isDevice() ? () => {} : props.onMouseOver}
        onMouseOut={BrowserDetect.isDevice() ? () => {} : props.onMouseOut}
        tabIndex={props.tabIndex}
        aria-hidden={props.ariaHidden}
        disabled={props.disabled ? props.disabled : false}
        title={props.btnTitle ? props.btnTitle : ""}
      >
        {props.title}
      </button>
    );
  }
};

export default CustomButton;
