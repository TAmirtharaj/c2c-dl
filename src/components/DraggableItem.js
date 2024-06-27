/** @format */

import React, { useState, useEffect } from "react";
import {
  BrowserDetect,
  getCommonWindowObj,
  getFlagDND,
  setCommonWindowObj,
} from "../helper/Helper";
import "./DraggableItem.css";

const DraggableItem = (props) => {
  const srNo = props.sr ? props.sr : 0;
  const [disableFlag, setDisableFlag] = useState(false);
  // let disableFlag = false;
  const [opacity, setOpacity] = useState(100);
  const [pointerEvent, setPointerEvent] = useState("auto");
  let windowObj = getCommonWindowObj();
  useEffect(() => {
    windowObj = getCommonWindowObj();
    if (windowObj.droppedEle[srNo]) {
      let flag = false;
      windowObj.droppedEle[srNo].forEach((element) => {
        if (element !== null) {
          if (element.innerHTML === props.data.answer) flag = true;
        }
      });
      if (flag) {
        console.log("flag here---->", props.data.answer, flag);
        // console.log("here isnide");
        setOpacity(0);
        // hi.style.opacity = 0;
        setDisableFlag(true);
        setPointerEvent("none");
      }
      if (
        windowObj.KCDragAndDrop &&
        windowObj.KCDragAndDrop[srNo] &&
        windowObj.KCDragAndDrop[srNo].isSubmit !== false
      ) {
        setPointerEvent("none");
      }
    }

    console.log("DND flag---------------->", getFlagDND(srNo), props.purpose);
    if (getFlagDND(srNo) === 0 && props.purpose === "Assessment") {
      setDisableFlag(false);
      setOpacity(100);
    }
  }, []);

  useEffect(() => {
    // console.log("disabled flag changed", window.droppedEle[srNo], disableFlag);
  }, [disableFlag]);
  // useEffect(() => {
  //   const dragOptions = document.querySelectorAll(".drag-option");
  //   dragOptions.forEach((ele) => {
  //     if (ele.style.opacity === "0") {
  //       console.log("Im called");

  //       ele.style.pointerEvent = "none";
  //     }
  //   });
  // });

  let btnRef;
  let btnClone;

  const onTouchDown = (e) => {
    e.preventDefault();
    commonMouseDownActions(e);
  };
  const onMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    commonMouseDownActions(e);
  };

  /**
   * It creates a clone of the button that was clicked, and adds it to the DOM.
   * @param e - The event object
   */
  const commonMouseDownActions = (e) => {
    btnRef = e.target;
    btnRef.style.opacity = "0.5";
    btnClone = e.target.cloneNode(true);
    btnClone.id = new Date().getTime() * Math.random() * 1000000;
    btnClone.style.opacity = 0;
    const dragObj = { orignal: btnRef, clone: btnClone };

    windowObj = getCommonWindowObj();
    windowObj.dragElements = windowObj.dragElements
      ? windowObj.dragElements
      : [];
    windowObj.dragElements.push(dragObj);
    setCommonWindowObj(windowObj);
    document.getElementsByClassName("main-container")[0].appendChild(btnClone);
    // setPointerEvent("none");
  };

  return (
    <button
      className={`draggable-item drag-option drag_${props.data.id}  ${
        disableFlag ? "disabled" : ""
      }`}
      tabIndex={-1}
      id={props.data.id}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchDown}
      style={{
        top: `${
          BrowserDetect.isMobile() ? props.index * 38.5 : props.index * 58.5
        }px`,
        opacity: opacity,
        // pointerEvents: pointerEvent,
      }}
      // disabled={disableFlag === true ? true : false}
    >
      {props.data.answer}
    </button>
  );
};
export default DraggableItem;
