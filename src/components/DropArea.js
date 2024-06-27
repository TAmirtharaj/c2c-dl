/** @format */

import React, { useEffect } from "react";
import {
  BrowserDetect,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../helper/Helper";
import "./DropArea.css";
import Parser from "html-react-parser";
import { withScorm } from "react-scorm-provider-v2";
import { imagePath, getFlagDND, setFlagDND } from "../helper/Helper";
import { get } from "jquery";

const DropArea = (props) => {
  let btnRef;
  let btnClone,
    allTop = 0;
  const srNo = props.sr ? props.sr : 0;
  let windowObj = getCommonWindowObj();

  windowObj.droppedEle = windowObj.droppedEle ? windowObj.droppedEle : [];
  windowObj.droppedEle[srNo] = windowObj.droppedEle[srNo]
    ? windowObj.droppedEle[srNo]
    : [];

  windowObj.dataContollerPara = windowObj.dataContollerPara
    ? windowObj.dataContollerPara
    : [];
  windowObj.dataContollerPara[srNo] = windowObj.dataContollerPara[srNo]
    ? windowObj.dataContollerPara[srNo]
    : false;

  setCommonWindowObj(windowObj);

  useEffect(() => {
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", touchUp);
    // console.log("DND flag", getFlagDND(srNo));
    // setFlagDND(srNo, 1);
    // if(getFlagDND(srNo)===1){

    // }

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchUp);
    };
  }, []);

  useEffect(() => {
    windowObj = getCommonWindowObj();
    props.dataContoller(windowObj.dataContollerPara[srNo]);

    const drops = document.querySelectorAll(".drop-box");

    windowObj = getCommonWindowObj();
    drops.forEach((ele, i) => {
      if (windowObj.droppedEle[srNo][ele.id]) {
        console.log(windowObj.droppedEle[srNo][ele.id]);
        if (
          windowObj.droppedEle[srNo][ele.id] &&
          windowObj.droppedEle[srNo][ele.id].classList &&
          !windowObj.droppedEle[srNo][ele.id].classList.contains("disabled")
        ) {
          ele.appendChild(windowObj.droppedEle[srNo][ele.id]);
          ele.style.border = "none";
          const dragArea = document.querySelector(`.drag_${ele.id}`);
        } else {
          ele.style.border = "2px dashed #707070";
        }
      } else {
        // console.log("im out of focus", ele);
        // resetFun();
        ele.style.border = "2px dashed #707070";
      }
    });

    // if (window.droppedEle[srNo]) {
    //   if (window.droppedEle[srNo].length - 1 === props.pageData.length)
    //     console.log("condition fullflled");
    // }
  }, []);

  const mouseMove = (e) => {
    windowObj = getCommonWindowObj();
    if (windowObj.dragElements && windowObj.dragElements.length > 0) {
      e.stopPropagation();
      e.preventDefault();
      const pointer = windowObj.dragElements[0].clone;
      windowObj.dragElements[0].clone.style.opacity = 1;
      setCommonWindowObj(windowObj);
      // window.dragElements[0].orignal.style.opacity = 0;
      // console.log(window.dragElements[0].orignal);
      pointer.style.left =
        pointerEventToXY(e).touches.pageX -
        pointer.getBoundingClientRect().width / 2 +
        "px";
      pointer.style.top =
        pointerEventToXY(e).touches.pageY -
        pointer.getBoundingClientRect().height / 2 +
        "px";

      // document.querySelectorAll(".drop-box").forEach((ele) => {
      //   if (ele.childNodes[0]) {
      //     ele.style.border = "2px dashed #707070";
      //   }
      // });
    }
  };

  const touchMove = (e) => {
    windowObj = getCommonWindowObj();
    if (windowObj.dragElements && windowObj.dragElements.length > 0) {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        let pointer = windowObj.dragElements[i].clone;
        pointer.style.opacity = 1;
        // window.dragElements[0].orignal.style.opacity = 0.5;
        pointer.style.left =
          e.touches[i].pageX - pointer.getBoundingClientRect().width / 2 + "px";
        pointer.style.top =
          e.touches[i].pageY -
          pointer.getBoundingClientRect().height / 2 +
          "px";

        // document.querySelectorAll(".drop-box").forEach((ele) => {
        //   if (ele.childNodes[0]) {
        //     ele.style.border = "2px dashed #707070";
        //   }
        // });
      }
    }
  };

  const removeDragElements = (e) => {
    document.querySelectorAll(".drop-box").forEach((ele, i) => {
      if (ele.childNodes[0]) {
        if (ele.childNodes[0].classList.contains("disabled")) {
          ele.childNodes[0].remove();
        } else ele.style.border = "unset";
      }
    });

    const para = [...document.querySelectorAll(".drop-box")].every(
      (ele) => ele.childNodes.length >= 1
    );
    windowObj = getCommonWindowObj();
    windowObj.dataContollerPara[srNo] = para;
    props.dataContoller(para);
    windowObj.dragElements = [];

    setCommonWindowObj(windowObj);
  };

  const updateDropElements = (ele, flag) => {
    if (flag) {
      ele.orignal.classList.add("disabled");
      ele.orignal.style.pointerEvents = "none";
    } else ele.orignal.style.opacity = 1;
  };

  const mouseUp = (e) => {
    windowObj = getCommonWindowObj();
    // console.log("here dropped target .......", e.target);
    if (windowObj.dragElements && windowObj.dragElements.length > 0) {
      e.preventDefault();
      for (let i = 0; i < windowObj.dragElements.length; i++)
        dropable(windowObj.dragElements[i]);
      removeDragElements(e);
    }
    setCommonWindowObj(windowObj);
    // props.saveDataToScorm();
  };

  const touchUp = (e) => {
    windowObj = getCommonWindowObj();
    if (windowObj.dragElements && windowObj.dragElements.length > 0) {
      e.preventDefault();
      for (let i = 0; i < windowObj.dragElements.length; i++)
        dropable(windowObj.dragElements[i]);
      removeDragElements(e);
    }
    setCommonWindowObj(windowObj);
    // props.saveDataToScorm();
  };

  const pointerEventToXY = function (e) {
    let out = {};
    if (
      e.type === "touchstart" ||
      e.type === "touchmove" ||
      e.type === "touchend" ||
      e.type === "touchcancel"
    ) {
      out.touches = e.changedTouches;
      out.touchType = true;
    } else if (
      e.type === "mousedown" ||
      e.type === "mouseup" ||
      e.type === "mousemove" ||
      e.type === "mouseover" ||
      e.type === "mouseout" ||
      e.type === "mouseenter" ||
      e.type === "mouseleave"
    ) {
      out.touches = e;
      out.touchType = false;
    }
    return out;
  };

  const commonMouseTouchDownAction = (e) => {
    windowObj = getCommonWindowObj();
    e.stopPropagation();
    e.preventDefault();
    console.log("mouse down", e.target);
    btnRef = e.target;
    btnRef.style.opacity = "0.5";
    btnClone = e.target.cloneNode(true);
    btnClone.id = new Date().getTime() * Math.random() * 1000000;
    btnClone.style.opacity = 1;
    btnClone.classList.add("clone");
    const dragObj = { orignal: btnRef, clone: btnClone };
    windowObj.dragElements = windowObj.dragElements
      ? windowObj.dragElements
      : [];
    windowObj.dragElements.push(dragObj);
    setCommonWindowObj(windowObj);
    document.getElementsByClassName("main-container")[0].appendChild(btnClone);
  };

  const saveDataToScorm = () => {
    console.log("inside the scorm function", props);

    /*  window.droppedEle[srNo]
      window.shuffleOption[srNo]
      window.KCDragAndDrop[srNo]
      window.submitFlag[srNo]
      window.knowledgeCheckHintClicked[props.kcRef]
      window.assessmentImageClick
      
    */

    // if (props.sco.apiConnected) {
    //   if (window.droppedEle && window.droppedEle[srNo]) {
    //     props.sco
    //       .setSuspendData(`droppedEle${[srNo]}`, window.droppedEle[srNo])
    //       .then((data) => {
    //         props.sco.setStatus("completed").then(() => {
    //           console.log("completionStatus :::: completed");
    //         });
    //       });
    //   }
    // }
  };

  const dropable = (dropableElement) => {
    let flag = false,
      count = 0;
    const dropableCordinates = dropableElement.clone.getBoundingClientRect();
    const drops = document.querySelectorAll(".drop-box");
    drops.forEach((ele, index) => {
      const dropsCordinates = ele.getBoundingClientRect();
      ele.style.border = "2px dashed #707070";
      if (
        dropableCordinates.x >
          dropsCordinates.left - dropsCordinates.width / 2 &&
        dropableCordinates.x <
          dropsCordinates.left + dropsCordinates.width / 2 &&
        dropableCordinates.y >
          dropsCordinates.top - dropsCordinates.height / 2 &&
        dropableCordinates.y < dropsCordinates.top + dropsCordinates.height / 2
      ) {
        if (
          ele.childNodes[0] &&
          ele.childNodes[0].id !== dropableElement.orignal.id
        ) {
          document
            .querySelectorAll(`.drag_${ele.childNodes[0].id}`)
            .forEach((ele) => {
              if (ele.classList.contains("disabled")) {
                ele.classList.remove("disabled");
                ele.style.opacity = 1;
                ele.style.pointerEvents = "auto";
              }
            });
          ele.childNodes[0].remove();
        } else ele.style.border = "unset";

        const droppedSpan = document.createElement("span");
        droppedSpan.className = "dropped";
        droppedSpan.id = `${dropableElement.orignal.id}`;
        droppedSpan.classList.add(`drag_${dropableElement.orignal.id}`);
        droppedSpan.innerText = dropableElement.clone.innerText;
        droppedSpan.addEventListener("mousedown", commonMouseTouchDownAction);
        droppedSpan.addEventListener("touchstart", commonMouseTouchDownAction);
        ele.appendChild(droppedSpan);

        // window.droppedEle[srNo][ele.id] = droppedSpan;
        // window.shuffleOption[srNo] = false;
        windowObj = getCommonWindowObj();
        windowObj.droppedEle[srNo][ele.id] = droppedSpan;
        windowObj.shuffleOption[srNo] = false;
        setCommonWindowObj(windowObj);
        // console.log("initi array", window.droppedEle[srNo]);
        dropableElement.orignal.style.opacity = 0;
        // dropableElement.orignal.style.pointerEvents = "none";
        // dropableElement.orignal.style.pointerEvents = "none";
        // const dragOptions = document.querySelectorAll(".drag-option");
        // dragOptions.forEach((ele) => {
        //   console.log("HERE .......", ele.style.opacity);
        //   if (parseInt(ele.style.opacity) === 0)
        //     ele.style.pointerEvent = "none";
        // });

        ele.style.border = "unset";

        flag = true;
      } else count = count + 1;
    });
    if (props.pageData.length === count) {
      windowObj = getCommonWindowObj();
      const dragParameter = dropableElement.orignal.id;
      document.querySelectorAll(`.drag_${dragParameter}`).forEach((ele, i) => {
        if (!ele.classList.contains("clone")) {
          if (ele.classList.contains("disabled")) {
            ele.classList.remove("disabled");
            ele.style.opacity = 1;
            ele.style.pointerEvents = "auto";
            // window.droppedEle[srNo].splice(i, 1);
            windowObj.droppedEle[srNo].forEach((item, index) => {
              if (item && ele) {
                if (item.innerText === ele.innerText) {
                  windowObj.droppedEle[srNo][index] = null;
                }
              }
            });
          }
          if (ele.classList.contains("dropped")) {
            ele.remove();
            windowObj.droppedEle[srNo].forEach((item, index) => {
              if (item && ele) {
                if (item.innerText === ele.innerText) {
                  windowObj.droppedEle[srNo][index] = null;
                }
              }
            });

            // console.log(
            //   "here element",
            //   ele.id,
            //   document.getElementsByClassName(`drag_${ele.id}`)[0]
            // );
            // window.droppedEle[srNo].splice(i, 1);
            // window.droppedEle[srNo][parseInt(ele.id)] = null;
            // console.log("in dropabble ", window.droppedEle[srNo]);
            document.getElementsByClassName(
              `drag_${ele.id}`
            )[0].style.opacity = 100;
            // document.getElementsByClassName(
            //   `drag_${ele.id}`
            // )[0].style.pointerEvents = "auto";
          }

          console.log(
            "final array",
            windowObj.droppedEle[srNo],
            ".............."
          );
        }
      });

      setCommonWindowObj(windowObj);
    }

    updateDropElements(dropableElement, flag);
    document
      .getElementsByClassName("main-container")[0]
      .removeChild(dropableElement.clone);

    // saveDataToScorm();
  };
  const allTopArray = [];
  for (let i = 0; i < props.pageData.length; i++) {
    if (BrowserDetect.isMobile()) {
      allTop = i * 38.5 + 10;
    } else {
      allTop = i * 58.5 + 10;
    }
    allTopArray.push(allTop);
  }

  // console.log("props......", props);

  const isTextEmpty = () => {
    let count = 0;
    props.pageData.forEach((item, index) => {
      if (item.text === "") count = count + 1;
    });
    if (count === props.pageData.length) return false;
    else return true;
  };
  return (
    <div className='drop-area'>
      {props.image ? (
        <div className='image-box'>
          <img
            draggable={false}
            alt={props.image.altText ? props.image.altText : ''}
            className={`drop-box-img`}
            src={imagePath(props.image.src)}
            style={{
              height: props.image.height ? props.image.height : "auto",
              width: props.image.width ? props.image.width : "auto",
            }}
          />
          <ol className='drop-box-questions' style={{ width: "4vw" }}>
            {props.pageData.map((item, index) => {
              return (
                <li
                  className='drop-box-item-holder'
                  key={index}
                  id={item.id}
                  style={{
                    top: `${allTopArray[index]}px`,
                  }}
                >
                  {item.text && (
                    <p className='drop-text '>{Parser(item.text)}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <ol
          className='drop-box-questions'
          style={{ width: isTextEmpty() ? "32.5vw" : "auto" }}
        >
          {props.pageData.map((item, index) => {
            return (
              <li
                className='drop-box-item-holder'
                key={index}
                id={item.id}
                style={{
                  top: `${allTopArray[index]}px`,
                  lineHeight: isTextEmpty() ? "" : "2",
                }}
              >
                {item.text && <p className='drop-text '>{Parser(item.text)}</p>}
              </li>
            );
          })}
        </ol>
      )}
      <div className='drop-box-holder'>
        {props.pageData.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <div
                key={`sign_${index}`}
                className={`sign-drop-box sign_${item.id}`}
                id={item.id}
                style={{
                  top: `${allTopArray[index] + 5}px`,
                }}
              ></div>
              <div
                id={item.id}
                className='drop-box drop-box-item '
                style={{ top: `${allTopArray[index]}px` }}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
export default withScorm()(DropArea);
