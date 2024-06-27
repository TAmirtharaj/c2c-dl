/** @format */

import "./Notes.css";
import Input from "./Input";
import { withScorm } from "react-scorm-provider-v2";
import { Card, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getCommonWindowObj,
  labNoteBookZoomLineheight,
} from "../helper/Helper";

const Notes = (props) => {
  console.log("Notes props", props);
  let notesData, hasLabNotebookSubmitted;
  const zoomIndex = useSelector((state) => state.zoomIndex);
  const emptyArray = new Array(10);
  emptyArray.fill("");
  let windowObj = getCommonWindowObj();
  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    const scromNotesData =
      scromData && scromData[props.page] && scromData[props.page].textareaData
        ? scromData[props.page].textareaData
        : "";
    notesData = scromNotesData ? scromNotesData : emptyArray;
    const hasLabNotebookSubmittedFlag = scromData["hasLabNotebookSubmitted"];
    hasLabNotebookSubmitted = hasLabNotebookSubmittedFlag
      ? hasLabNotebookSubmittedFlag
      : false;
  } else {
    notesData = windowObj[props.page]
      ? windowObj[props.page].textareaData
      : emptyArray;
    hasLabNotebookSubmitted = windowObj.hasLabNotebookSubmitted
      ? windowObj.hasLabNotebookSubmitted
      : false;
  }

  useEffect(() => {
    let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
      zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
    if (zoomIndex === 1) {
      zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
      zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
    } else if (zoomIndex === 2) {
      zoomContent = { fontSize: 1.05, lineHeight: 1.4 };
      zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
    } else {
      zoomContent = { fontSize: 1.15, lineHeight: 1.5 };
      zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
    }

    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".card-header"),
    //   zoomHeader
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".notes-body"),
    //   zoomContent
    // );
  }, [zoomIndex]);

  return (
    <Row className="notes-container">
      <div className="notes-card">
        <div className="card-header">
          {props.pageData.title}
        </div>
        <div className="notes-body">
          <Input
            id={props.pageData.id}
            page={props.page}
            inputType="textarea"
            className="text-area notes-text-area"
            defaultValue={notesData[props.index]}
            disabled={hasLabNotebookSubmitted}
            maxLength={props.pageData.maxLength}
            characterCountClass="notes-text-area-counter"
            tabIndex={hasLabNotebookSubmitted ? "-1" : ""}
          />
        </div>
      </div>
    </Row>
  );
};

export default withScorm()(Notes);
