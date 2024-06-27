/** @format */

import React, { useState } from "react";
import Parser from "html-react-parser";
import MCSSForm from "./MCSSForm";
import "./MCSS.css";
import { connect } from "react-redux";
import Feedback from "./Feedback";
import { shuffleArray } from "../shuffleArray/shuffleArray";
import {
  getCommonWindowObj,
  getZoomClassList,
  setCommonWindowObj,
} from "../helper/Helper";

const MCSS = (props) => {
  const [isAnsSubmit, setIsAnsSubmit] = useState(false);
  const formSubmitHandler = (flag) => {
    setIsAnsSubmit(flag);
    if (flag && typeof props.updatePageStatus === "function")
      props.updatePageStatus(true);
  };

  // console.log(props);
  let windowObj = getCommonWindowObj();
  const condition =
    props.pageData.purpose === "Assessment"
      ? !isAnsSubmit
      : windowObj.knowledgeCheckUserSelection[props.pageData.kcRef] === -1 &&
        !isAnsSubmit;

  // if (condition) {
  //   props.pageData.options = shuffleArray(props.pageData.options);
  // }
  windowObj.mcssShuffleStatus = windowObj.mcssShuffleStatus
    ? windowObj.mcssShuffleStatus
    : [];
  if (!windowObj.mcssShuffleStatus[props.pageData.assessmentRef]) {
    props.pageData.options = shuffleArray(props.pageData.options);
    windowObj.mcssShuffleStatus[props.pageData.assessmentRef] = true;
  }

  setCommonWindowObj(windowObj);
  let classList =
    props.pageData.purpose === "Assessment"
      ? "mcss-comp-wrapper-for-assestment "
      : "mcss-comp-wrapper-left ";

  let rightZoomClass = "mcss-comp-wrapper-right ";
  if (props.pageData.purpose === "Assessment") {
    // classList += getZoomClassList(props.zoomIndex, 'center', '100');
  } else {
    classList += getZoomClassList(props.zoomIndex, "left");
  }

  return (
    <div>
      <div className={classList}>
        {props.pageData.question && (
          <div className='mcss-comp-heading bodyMediumSubHeading'>
            {Parser(props.pageData.question)}
          </div>
        )}
        <MCSSForm
          pageData={props.pageData}
          currentQue={props.currentQue}
          totalQues={props.totalQues}
          onLoadNextQue={props.onLoadNextQue}
          onUpdateResult={props.onUpdateResult}
          onFormSubmit={formSubmitHandler}
        />
      </div>
      <div className={rightZoomClass}>
        {props.pageData.feedbackData &&
          windowObj.knowledgeCheckUserSelection[props.pageData.kcRef] !==
            -1 && <Feedback pageData={props.pageData.feedbackData} />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
  };
};

export default connect(mapStateToProps, null)(MCSS);
