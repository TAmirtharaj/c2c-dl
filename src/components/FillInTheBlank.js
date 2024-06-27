/** @format */

import React, { useEffect, useState } from "react";
import { withScorm } from "react-scorm-provider-v2";
import Parser from "html-react-parser";
import "./FillInTheBlank.css";
import { connect } from "react-redux";
import { getCommonWindowObj } from "../helper/Helper";

const FillInTheBlank = (props) => {
  let [questionData, setQuestionData] = useState(
    props.pageData.flag === "activity" ? props.fillInBlank : ""
  );
  let hasLabNotebookSubmitted;
  let windowObj = getCommonWindowObj();
  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    const hasLabNotebookSubmittedFlag =
      scromData && scromData["hasLabNotebookSubmitted"];
    hasLabNotebookSubmitted = hasLabNotebookSubmittedFlag
      ? hasLabNotebookSubmittedFlag
      : false;
  } else {
    hasLabNotebookSubmitted = windowObj.hasLabNotebookSubmitted
      ? windowObj.hasLabNotebookSubmitted
      : false;
  }
  useEffect(() => {
    // console.log(
    //   "inside fill in the blank",
    //   window[props.page]
    //     ? window[props.page].fillInBlank[props.pageData.sr]
    //     : ""
    // );
    let windowObj = getCommonWindowObj();
    if (props.pageData.flag !== "activity") {
      if (props.sco.apiConnected) {
        const scromData = props.sco.suspendData;
        const scromQuestionData =
          scromData &&
          scromData[props.page] &&
          scromData[props.page].fillInBlank &&
          scromData[props.page].fillInBlank[props.pageData.sr]
            ? scromData[props.page].fillInBlank[props.pageData.sr]
            : undefined;
        setQuestionData(scromQuestionData ? scromQuestionData : "");
      } else {
        setQuestionData(
          windowObj[props.page]
            ? windowObj[props.page].fillInBlank[props.pageData.sr]
            : ""
        );
      }
    }
  }, []);

  console.log("question data.", questionData);
  const onChange = (e) => {
    // console.log("here ", e.target.id);
    // console.log(props.fillInBlank);
    if (props.pageData.flag === "activity") {
      let obj = [];
      obj = props.fillInBlank ? { ...props.fillInBlank } : [];
      // console.log("here obj", obj);
      obj[e.target.id] = e.target.value;
      // console.log("here after obj", obj);
      props.updateHintClicked(obj);
      // console.log("here", props.fillInBlank);
      // setQuestionData(e.target.value);
    }
  };
  return (
    // <div className='fill-in-the-blank-component'>
    <div
      key={props.pageData.id}
      className={`fill-in-the-blank-component ${
        props.classList ? props.classList : ""
      }`}
      id={`fill-in-the-blank-component_${props.pageData.id}`}
      style={{
        "flexDirection": props.pageData.text.length > 45 ? "column" : "row",
      }}
    >
      <div className='text' id={`text_${props.pageData.id}`}>
        {Parser(props.pageData.text)} :
      </div>
      <div
        className='input-holder'
        style={{
          width: props.pageData.width ? props.pageData.width : "100%",
        }}
      >
        <input
          type='text'
          maxLength={
            props.pageData.maxLength ? props.pageData.maxLength : false
          }
          defaultValue={
            props.pageData.flag === "activity"
              ? questionData
                ? questionData[props.pageData.id]
                : ""
              : questionData
          }
          className={`fill-in-blank fib-textarea-component textarea-component ${
            hasLabNotebookSubmitted ? "disabled" : ""
          }`}
          placeholder={props.placeholder ? props.placeholder : "Write your Answer here..."}
          tabIndex='1'
          onChange={onChange}
          id={props.pageData.id}
          disabled={hasLabNotebookSubmitted}
        ></input>
        <div className='underLine'></div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    fillInBlank: state.fillInBlank,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateHintClicked: (data) =>
      dispatch({
        type: "UPDATE_FILL_IN_BLANK",
        payload: data,
      }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(FillInTheBlank)
);
