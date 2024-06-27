import React from "react";
import { withScorm } from "react-scorm-provider-v2";
import { connect } from "react-redux";
import "./CommonButton.css";

const PageCounter = (props) => {
  let currentPageCounter;
  let totalPageCounter;
  // for (let i = 0; i < props.courseData.pages.length; i++) {
  //   if (
  //     !props.courseData.pages[i].hasOwnProperty("isHidden") ||
  //     !props.courseData.pages[i].isHidden
  //   ) {
  //     for (let j = 0; j < props.courseData.pages[i].pages.length; j++) {
  //       if (
  //         !props.courseData.pages[i].pages[j].hasOwnProperty("isHidden") ||
  //         !props.courseData.pages[i].pages[j].isHidden
  //       ) {
  //         for (
  //           let k = 0;
  //           k < props.courseData.pages[i].pages[j].pages.length;
  //           k++
  //         ) {
  //           if (
  //             !props.courseData.pages[i].pages[j].pages[k].hasOwnProperty(
  //               "isHidden"
  //             ) ||
  //             !props.courseData.pages[i].pages[j].pages[k].isHidden
  //           ) {
  //             totalPageCounter++;
  //             props.courseData.pages[i].pages[j].pages[k].pageNum =
  //               totalPageCounter;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // console.log(props.courseData.pages[props.currentSection].pages);
  // console.log(props.courseData.pages[props.currentSection].pages[props.currentScene].pages);
  // console.log(props.courseData.pages[props.currentSection].pages[props.currentScene].pages[props.currentSubScene].pageNum);
  const isMaterial =
    props.courseData.pages[props.currentSection].pages[props.currentScene]
      .title === "Materials";

  //if scene is materials then make currentSubScene 0 as we made tabs as subscene which wont count here
  currentPageCounter =
    props.courseData.pages[props.currentSection].pages[props.currentScene]
      .pages[isMaterial ? 0 : props.currentSubScene].pageNum;

  totalPageCounter = props.totalPages;

  let bool = true;
  for (let i = 0; i < props.visitedArray[0].length - 1; i++) {
    if (props.visitedArray[0][i].length === 1) {
      if (props.visitedArray[0][i][0] !== 2) {
        bool = false;
      }
    } else {
      for (let j = 0; j < props.visitedArray[0][i].length; j++) {
        if (props.visitedArray[0][i][j] !== 2) {
          bool = false;
        }
      }
    }
  }
  props.updatePreLabStatus(bool);

  return (
    <div
      className='page-counter-holder'
      aria-label={`Page ${currentPageCounter} of ${totalPageCounter}`}
      aria-hidden='false'
    >
      <div className='current-page'>{currentPageCounter}</div>
      <div className='seperator'>/</div>
      <div className='total-pages'>{totalPageCounter}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    courseData: state.courseData,
    currentSection: state.currentSection,
    currentScene: state.currentScene,
    currentSubScene: state.currentSubScene,
    visitedArray: state.visitedArray,
    totalPages: state.totalPages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePreLabStatus: (data) =>
      dispatch({ type: "UPDATE_PRELAB_STATUS", payload: data }),
    updateCurrentPage: (data) =>
      dispatch({ type: "UPDATE_CURRENT_PAGE", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(PageCounter)
);
