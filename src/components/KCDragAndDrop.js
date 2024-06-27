/** @format */

import Parser from "html-react-parser";
import React from "react";
import { connect } from "react-redux";
import {
  shuffle,
  getFlagDND,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../helper/Helper";
import DragAndDropWrapper from "./DragAndDropWrapper";
import "./KCDragAndDrop.css";
import { labNoteBookZoomLineheight } from "../helper/Helper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const KCDragAndDrop = (props) => {
  let leftClassList = "mcss-comp-wrapper-left";

  // document.querySelector(".ContentZoomHolder").classList.add("disable-button");
  console.log("KC drag and drop", props);
  if (document.querySelector(".ContentZoomHolder")) {
    document
      .querySelector(".ContentZoomHolder")
      .classList.add("disable-button");
    document.getElementById("circle_1").disabled = true;
  }
  let dragItemArray = [];
  const srNo = props.pageData.sr ? props.pageData.sr : 0;
  const zoomIndex = useSelector((state) => state.zoomIndex);
  let windowObj = getCommonWindowObj();
  const [shuffleFlag, setShuffle] = useState(
    windowObj.shuffleOption && windowObj.shuffleOption[srNo]
      ? windowObj.shuffleOption[srNo]
      : true
  );

  windowObj.shuffledArray = windowObj.shuffledArray
    ? windowObj.shuffledArray
    : [];
  windowObj.shuffledArray[srNo] = windowObj.shuffledArray[srNo]
    ? windowObj.shuffledArray[srNo]
    : shuffle(dragItemArray);

  windowObj.shuffleOption = windowObj.shuffleOption
    ? windowObj.shuffleOption
    : [];
  windowObj.shuffleOption[srNo] = windowObj.shuffleOption[srNo]
    ? windowObj.shuffleOption[srNo]
    : true;
  if (windowObj.shuffleOption[srNo] === true) {
    windowObj.shuffleOption[srNo] = true;
  } else if (windowObj.shuffleOption[srNo] === false) {
    windowObj.shuffleOption[srNo] = false;
  } else {
    windowObj.shuffleOption[srNo] = true;
  }

  if (windowObj.droppedEle && windowObj.droppedEle[srNo]) {
    windowObj.droppedEle[srNo].forEach((item) => {
      if (item) {
        windowObj.shuffleOption[srNo] = false;
      }
    });
  }
  setCommonWindowObj(windowObj);
  // setShuffle(window.shuffleOption[srNo]);
  // console.log("heree", window.shuffleOption[srNo]);
  useEffect(() => {
    // console.log("dropped ", document.querySelectorAll(".dropped"));
    let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
      zoomContent = { fontSize: 0.95, lineHeight: 0.95 };
    if (zoomIndex === 1) {
      zoomContent = { fontSize: 0.95, lineHeight: 0.95 };
      zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
    } else if (zoomIndex === 2) {
      zoomContent = { fontSize: 1.05, lineHeight: 1.05 };
      zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
    } else {
      zoomContent = { fontSize: 1.15, lineHeight: 1.15 };
      zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
    }

    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".draggable-item"),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".drop-text"),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".mcss-comp-heading "),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".dropped"),
    //   zoomContent
    // );
  }, [zoomIndex]);

  useEffect(() => {
    // console.log(0
    //   "useeffect called at initaial...............................",
    //   window.shuffleOption[srNo]
    // );
    windowObj = getCommonWindowObj();
    if (windowObj.shuffleOption[srNo]) {
      windowObj.shuffledArray[srNo] = shuffle(dragItemArray);
    }
    setCommonWindowObj(windowObj);
    // setShuffle(window.shuffleOption[srNo]);
    // if (getFlagDND(srNo) === 0) {
    //   window.shuffleOption[srNo] = true;
    // } else {
    //   window.shuffleOption[srNo] = false;
    // }
  }, []);

  props.pageData.options.forEach((element) => {
    let id = element.id;
    let answer = element.answer;
    dragItemArray.push({ id, answer });
  });

  windowObj = getCommonWindowObj();
  return (
    <div className='kc-drag-and-drop'>
      <div className={leftClassList}>
        {props.pageData.question && (
          <div className='mcss-comp-heading bodyMediumSubHeading'>
            {Parser(props.pageData.question)}
          </div>
        )}

        <DragAndDropWrapper
          pageData={props.pageData}
          onChallengeQuestion={props.onChallengeQuestion}
          onLoadNextQue={props.onLoadNextQue}
          onUpdateResult={props.onUpdateResult}
          onHint={props.onHint}
          optionArray={windowObj.shuffledArray[srNo]}
          kcRef={props.kcRef}
          isChallengeQuestion={props.isChallengeQuestion}
          // optionArray={shuffle(dragItemArray)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
  };
};

export default connect(mapStateToProps, null)(KCDragAndDrop);
