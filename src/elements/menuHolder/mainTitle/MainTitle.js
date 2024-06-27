import React from "react";
import "./MainTitle.css";
import SemiCircle from "./semiCircle/SemiCircle";
import { imagePath } from "../../../helper/Helper";

import { connect } from "react-redux";

const MainTitle = (props) => {
  console.log("MAin Title", props.assessmentScore)
  const iconPath = imagePath(props.data && props.data.menuIcon);
  const moreBtnOpenPath = imagePath(
    props.courseData && props.courseData.headerData.images.moreBtnOpenImage
  );
  const moreBtnPath = imagePath(
    props.courseData && props.courseData.headerData.images.moreBtnImage
  );

  const calculateStatus = (_type, _subArray) => {
    let str = "NA";
    let bool = true;
    switch (props.type) {
      case "mainTitle":
        let tempArr = [];
        for (let i = 0; i < _subArray.length; i++) {
          if (_subArray.length === 1) {
            str = getStatus(_subArray[0][0]);
          } else {
            for (let j = 0; j < _subArray[i].length; j++) {
              if (_subArray[i].length === 1) {
                if (
                  _subArray[i][0] === 0 ||
                  _subArray[i][0] === 1 ||
                  _subArray[i][0] === 3
                ) {
                  bool = false;
                }
                tempArr.push(_subArray[i][0]);
              } else {
                for (let k = 0; k < _subArray[i].length; k++) {
                  if (
                    _subArray[i][j] === 0 ||
                    _subArray[i][j] === 1 ||
                    _subArray[i][j] === 3
                  ) {
                    bool = false;
                  }
                  tempArr.push(_subArray[i][j]);
                }
              }
            }
            if (!bool) {
              if (tempArr.indexOf(1) === -1 && tempArr.indexOf(2) === -1) {
                str = "NA";
              } else {
                str = "visited";
              }
            } else {
              str = "completed";
            }
          }
        }
        break;
      case "subTitle":
        for (let i = 0; i < _subArray.length; i++) {
          if (_subArray.length === 1) {
            str = getStatus(_subArray[0]);
          } else {
            for (let j = 0; j < _subArray.length; j++) {
              if (
                _subArray[i] === 0 ||
                _subArray[i] === 1 ||
                _subArray[i] === 3
              ) {
                bool = false;
              }
            }
            if (!bool) {
              if (
                _subArray.indexOf(1) === -1 &&
                _subArray.indexOf(2) === -1 &&
                _subArray.indexOf(3) === -1
              ) {
                str = "NA";
              } else {
                str = "visited";
              }
            } else {
              str = "completed";
            }
          }
        }
        break;
      case "subSubTitle":
        str = getStatus(_subArray);
        break;
      default:
        break;
    }
    return str;
  };

  const getStatus = (id) => {
    let str = "NA";
    switch (id) {
      case 0:
        str = "NA";
        break;
      case 1:
        str = "visited";
        break;
      case 2:
        str = "completed";
        break;
      case 3:
        str = "failed";
        break;
      case 4:
        str = "passed";
        break;
    }
    return str;
  };

  let buttonClass,
    textClass,
    subArray,
    status,
    isDisable = false;
  switch (props.type) {
    case "mainTitle":
      buttonClass = props.currentPageBool ? "title menuClicked" : "title";
      textClass = "menuText";
      subArray = props.visitedArray[props.id];
      status = calculateStatus(props.type, subArray);
      break;
    case "subTitle":
      buttonClass = props.currentPageBool
        ? "menuSubTitle menuClicked"
        : "menuSubTitle";
      textClass = "subMenuText";
      subArray = props.visitedArray[props.mainID][props.id];
      status = calculateStatus(props.type, subArray);
      break;
    case "subSubTitle":
      buttonClass = props.currentPageBool
        ? "menuSubSubTitle menuClicked"
        : "menuSubSubTitle";
      textClass = "subSubMenuText";
      subArray = props.visitedArray[props.mainID][props.subMenuID][props.id];
      status = calculateStatus(props.type, subArray);
      break;
    default:
      break;
  }

  if (props.courseData.locked) {
    if (
      props.type === "subTitle" &&
      props.data.pages[0].hasOwnProperty("isAssessment") &&
      props.data.pages[0].isAssessment
    ) {
      isDisable = !props.preLabStatus;
    } else if (
      props.type === "subSubTitle" &&
      props.data.hasOwnProperty("isAssessment") &&
      props.data.isAssessment
    ) {
      isDisable = !props.preLabStatus;
    } else if (props.type === "mainTitle" && props.id > 0) {
      if (props.preLabStatus && props.assessmentStatus === "passed") {
        isDisable = false;
      } else {
        isDisable = true;
      }
    }
  }

  buttonClass += isDisable ? " disabledTile" : "";

  return (
    <button
      className={buttonClass}
      id={props.id}
      onClick={
        !isDisable
          ? () => {
              props.clickHandler(props.id, props.type);
            }
          : undefined
      }
      tabIndex={isDisable ? "-1" : "0"}
      aria-hidden={false}
      aria-label={props.data.title}
      disabled={isDisable}
    >
      <SemiCircle data={props.data} status={status} />
      {props.type === "mainTitle" ? (
        <img draggable={false} src={iconPath} className='menuIcon' aria-hidden={true}></img>
      ) : (
        false
      )}
      <div className={textClass} aria-hidden={true}>{props.data.title}</div>
      {props.data.hasOwnProperty("pages") && props.data.pages.length > 1 ? (
        props.clickedState ? (
          <img
            draggable={false}
            className='moreButton'
            src={moreBtnOpenPath}
            aria-hidden={true}
          ></img>
        ) : (
          <img draggable={false} className='moreButton' src={moreBtnPath} aria-hidden={true}></img>
        )
      ) : (
        false
      )}
      {isDisable ? <div className='dissableButton'></div> : false}
    </button>
  );
};

const mapStateToProps = (state) => {
  return {
    visitedArray: state.visitedArray,
    courseData: state.courseData,
    assessmentStatus: state.assessmentStatus,
    preLabStatus: state.preLabStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageArrayData: (data) =>
      dispatch({ type: "UPDATE_PAGE_ARRAY", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainTitle);
