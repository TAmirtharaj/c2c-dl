/** @format */

import Input from "./Input";
import { withScorm } from "react-scorm-provider-v2";
import { Col, Card } from "react-bootstrap";
import { useEffect } from "react";
import {
  getCommonWindowObj,
  labNoteBookZoomLineheight,
  storeLabNotebookPagesDataToScorm,
} from "../helper/Helper";
import "./Questions.css";
import { useSelector } from "react-redux";

const Questions = (props) => {
  const serialNumberData = props.pageData.sr ? props.pageData.sr : 0;
  let questionDatas, hasLabNotebookSubmitted;
  const zoomIndex = useSelector((state) => state.zoomIndex);
  const emptyArray = new Array(10);
  emptyArray.fill(undefined);
  let windowObj = getCommonWindowObj();
  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    const suspendData = scromData[props.page];
    const scromQuestionData =
      suspendData &&
      suspendData.textareaData &&
      suspendData.textareaData[serialNumberData]
        ? suspendData.textareaData[serialNumberData]
        : undefined;
    questionDatas = scromQuestionData ? scromQuestionData : "";
    const hasLabNotebookSubmittedFlag = scromData["hasLabNotebookSubmitted"];
    hasLabNotebookSubmitted = hasLabNotebookSubmittedFlag
      ? hasLabNotebookSubmittedFlag
      : false;
  } else {
    // console.log(
    //   "here",
    //   serialNumberData,
    //   window[props.page]
    //     ? window[props.page].textareaData[serialNumberData]
    //     : emptyArray
    // );
    questionDatas = windowObj[props.page]
      ? windowObj[props.page].textareaData[serialNumberData]
      : "";
    // questionDatas = window[props.page] ? window[props.page].textareaData : "";
    hasLabNotebookSubmitted = windowObj.hasLabNotebookSubmitted
      ? windowObj.hasLabNotebookSubmitted
      : false;
  }

  const onChange = () => {
    console.log("on changed called");
    storeLabNotebookPagesDataToScorm(
      props.sco,
      props.hasLabNotebookSubmitted,
      props.page
    );
  };
  // useEffect(() => {
  //   let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
  //     zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
  //   if (zoomIndex === 1) {
  //     zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
  //     zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
  //   } else if (zoomIndex === 2) {
  //     zoomContent = { fontSize: 1.05, lineHeight: 1.4 };
  //     zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
  //   } else {
  //     zoomContent = { fontSize: 1.15, lineHeight: 1.5 };
  //     zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
  //   }

  //   labNoteBookZoomLineheight(
  //     document.querySelectorAll(".lab-plain-text"),
  //     zoomHeader
  //   );
  //   labNoteBookZoomLineheight(
  //     document.querySelectorAll(".list-comp-heading"),
  //     zoomHeader
  //   );
  //   labNoteBookZoomLineheight(
  //     document.querySelectorAll(".question-body"),
  //     zoomContent
  //   );
  // }, [zoomIndex]);

  return (
    <Col className='question-container'>
      <Card className='question-card'>
        {/* <Card.Header className='question-card-header'></Card.Header> */}
        <Card.Body
          className='question-body'
          style={{
            height: props.pageData.inputHeight
              ? props.pageData.inputHeight
              : "48vh",
          }}
        >
          <Input
            id={props.pageData.id}
            page={props.page}
            maxLength={props.pageData.maxLength}
            inputType='editor'
            className='text-area'
            onChange={onChange}
            defaultValue={questionDatas}
            disabled={hasLabNotebookSubmitted}
            placeholder={props.pageData.placeholder}
            characterCountClass='question-Char-count'
            tabIndex={hasLabNotebookSubmitted ? "-1" : ""}
          />
        </Card.Body>
      </Card>
    </Col>
  );
};

export default withScorm()(Questions);
