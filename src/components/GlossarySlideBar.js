/** @format */

import React, { useLayoutEffect, useState, useEffect } from "react";
import { connect } from "react-redux";
import Parser from "html-react-parser";
import "./GlossarySlideBar.css";
import {
  getCommonWindowObj,
  setCommonWindowObj,
} from "../helper/Helper";

const GlossarySlideBar = (props) => {
  let windowObj = getCommonWindowObj();
  windowObj.listeners = windowObj.listeners ? windowObj.listeners : [];
  setCommonWindowObj(windowObj);
  const keyboardHandler = (e) => {
    // console.log(e.keyCode);
    // For Escape Key
    if (e.keyCode === 27) {
      const tList = document.querySelectorAll(".glossary-holder");
      if (tList.length >= 1) {
        document.getElementsByClassName("icon-button glossary-button ")[0].click();
      }
    }
  };
  windowObj = getCommonWindowObj();
  {
    windowObj.listeners.push(
      document.addEventListener("keyup", keyboardHandler)
    );
    setCommonWindowObj(windowObj);
    // console.log(windowObj);
  }
  
  let [holderHeight, setHolderHeight] = useState(0);

  let glossaryArray = [];

  props.courseData.glossary.data.forEach((data, i) => {
    glossaryArray.push(
      <div key={i} className='glossary-wrapper'>
        <div className='glossary-title'>{Parser(data.title)}</div>
        <div className='glossary-content'>{Parser(data.content)}</div>
      </div>
    );
  });

  // console.log(props.courseData.glossary);

  useLayoutEffect(() => {
    let updateSize = () =>
      setHolderHeight(
        document.getElementsByClassName("bodyHolder")[0].clientHeight
      );
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return props.showGlossarySideBarBool ? (
    <div className='glossary-holder'>
      <div
        className='glossary-slide-bar'
        style={{ height: `${holderHeight - 4}px` }}
      >
        <div className='glossary-slide-wrapper'>
          <div className='glossary-slide-bar-title-wrapper'>
            <div className='glossary-slide-bar-title'>
              {props.courseData.glossary.title}
            </div>
          </div>
          <div
            tabindex='0'
            className='glossary-slide-bar-scroll-bar customScrollbar'
          >
            <div className='glossary-slide-bar-container'>{glossaryArray}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    showGlossarySideBarBool: state.showGlossarySideBarBool,
    courseData: state.courseData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateGlossarySideBarBool: (data) =>
      dispatch({ type: "SHOW_GLOSSARY_SIDEBAR_BOOL", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GlossarySlideBar);
