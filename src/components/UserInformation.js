/** @format */

import { Col } from "react-bootstrap";
import Parser from "html-react-parser";
import { withScorm } from "react-scorm-provider-v2";
import { connect } from "react-redux";
import "./UserInformation.css";
import Input from "./Input";
import CustomButton from "./CustomButton";
import {
  getCommonWindowObj,
  labNoteBookZoomLineheight,
  setCommonWindowObj,
} from "../helper/Helper";
import { useState, useEffect } from "react";

const UserInformation = (props) => {
  const courseData = props.courseData;
  const zoomIndex = props.zoomIndex;
  let windowObj = getCommonWindowObj();
  const [userInputValue, setUserInputValue] = useState("");

  const userNameInputHandler = (e) => {
    const userInputValue = e.target.value;
    setUserInputValue(userInputValue.trim());
  };

  useEffect(() => {
    let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
    if (zoomIndex === 1) {
      zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
    } else if (zoomIndex === 2) {
      zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
    } else {
      zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
    }

    // labNoteBookZoomLineheight(document.querySelectorAll(".user-information-container"), zoomHeader);
  }, [zoomIndex]);

  const gotoLabNotebookHandler = () => {
    const userNameVal = userInputValue;
    if (userNameVal !== "") {
      const userNameValue =
        userNameVal.charAt(0).toUpperCase() + userNameVal.slice(1);
      windowObj = getCommonWindowObj();
      windowObj.userName = userNameValue;
      setCommonWindowObj(windowObj);
      if (props.sco.apiConnected) {
        props.sco.setSuspendData(`userName`, userNameValue).then((data) => {
          props.sco.setStatus("completed").then(() => {
            // console.log("completionStatus :::: completed");
          });
        });
      }
      props.updateShowLightBoxBool(true);
      props.updateLightBoxData({ type: "LabNoteBook" });
    }
  };

  return (
    <Col className='user-information-container'>
      <div className='user-name-info'>
        <label className='username-label'>
          {Parser(courseData.labNotebookData.printLayoutData.userLabel)}
        </label>
        <Input
          id='user-name-input'
          className='user-input'
          defaultValue={userInputValue}
          inputType='input'
          onChange={userNameInputHandler}
        />
      </div>
      <CustomButton
        className={`info-go-button ${
          userInputValue.trim().length === 0 ? "disabled" : ""
        }`}
        id='user-go-btn'
        btnTitle='Submit student name and enter lab notebook'
        title={Parser(courseData.labNotebookData.printLayoutData.userGoBtn)}
        onClick={gotoLabNotebookHandler}
        ariaLabel={courseData.labNotebookData.printLayoutData.userGoBtn}
        ariaHidden={userInputValue.trim().length === 0}
        tabIndex={userInputValue.trim().length === 0 ? "-1" : "0"}
        disabled={userInputValue.trim().length === 0 ? true : false}
      />
    </Col>
  );
};

const mapStateToProps = (state) => {
  return {
    showLightBox: state.showLightBox,
    courseData: state.courseData,
    zoomIndex: state.zoomIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(UserInformation)
);
