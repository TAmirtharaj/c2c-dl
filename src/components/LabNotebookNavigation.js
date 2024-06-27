/** @format */

import { connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import {
  getCommonWindowObj,
  imagePath,
  setCurrentLabNotebookPage,
  setImgLoadedCount,
  setImgRefCount,
  storeLabNotebookPagesDataToScorm,
} from "../helper/Helper";
import "./LabNotebookNavigation.css";
import { useState } from "react";
import CustomButton from "./CustomButton";

const LabNoteBookNavigation = (props) => {
  const nextIcon = imagePath("core/labNotebookNextIcon.svg");
  const nextIconH = imagePath("core/labNotebookNextIconH.svg");
  const previousIcon = imagePath("core/labNotebookPreviousIcon.svg");
  const previousIconH = imagePath("core/labNotebookPreviousIconH.svg");

  const maxPages = props.courseData.labNotebookData.pages.length - 1;
  let page = props.labNotebookPages ? props.labNotebookPages : 0;

  const [previousIconImage, setPreviousIconImage] = useState(previousIcon);
  const [nextIconImage, setNextIconImage] = useState(nextIcon);

  const mouseOverPreviousHandler = () => {
    setPreviousIconImage(previousIconH);
  };
  const mouseOutPreviousHandler = () => {
    setPreviousIconImage(previousIcon);
  };

  const mouseOverNextHandler = () => {
    setNextIconImage(nextIconH);
  };
  const mouseOutNextHandler = () => {
    setNextIconImage(nextIcon);
  };

  const previousNavigationClickhandler = () => {
    const lightbox = document.querySelector(".lightbox-content-col");
    lightbox.scrollTop = 0;
    storeLabNotebookPagesDataToScorm(
      props.sco,
      props.hasLabNotebookSubmitted,
      page
    ); // Save data to scrom
    page = page > 0 ? (page -= 1) : page;
    setCurrentLabNotebookPage(page);
    props.updateLabNotebookPages(page);
  };

  // document.addEventListener("onWindowClose", () => {
  //   console.log(
  //     "on close method called",
  //     props.sco,
  //     props.hasLabNotebookSubmitted,
  //     page,
  //     getCommonWindowObj()
  //   );
  //   storeLabNotebookPagesDataToScorm(
  //     props.sco,
  //     props.hasLabNotebookSubmitted,
  //     page
  //   );
  // });

  const nextNavigationClickhandler = () => {
    const lightbox = document.querySelector(".lightbox-content-col");
    lightbox.scrollTop = 0;
    storeLabNotebookPagesDataToScorm(
      props.sco,
      props.hasLabNotebookSubmitted,
      page
    ); // Save data to scrom
    page = page < maxPages ? (page += 1) : page;
    setCurrentLabNotebookPage(page);
    if (page === maxPages) {
      console.log("reach at end of the labnotebook");
      // props.updateLoadedRefArray([]);
      // props.updateImgRefArray([]);
      setImgRefCount(0);
      setImgLoadedCount(0);
      // props.updateIsPrintPage(true);
    }
    props.updateLabNotebookPages(page);
  };

  return (
    <div className='lightbox-navigation'>
      <CustomButton
        className={`lightbox-right-navigation ${
          page === maxPages ? "disabled" : ""
        }`}
        onClick={nextNavigationClickhandler}
        onMouseOver={mouseOverNextHandler}
        onMouseOut={mouseOutNextHandler}
        url={nextIconImage}
        ariaLabel='Go to next notebook page'
        type='icon'
        tabIndex={`${page === maxPages ? "-1" : ""}`}
        disabled={page === maxPages ? true : false}
        ariaHidden={page === maxPages}
        // btnTitle='Go to next notebook page'
      />
      <CustomButton
        className={`lightbox-left-navigation ${page === 0 ? "disabled" : ""}`}
        onClick={previousNavigationClickhandler}
        onMouseOver={mouseOverPreviousHandler}
        onMouseOut={mouseOutPreviousHandler}
        url={previousIconImage}
        ariaLabel='Go to previous notebook page'
        type='icon'
        tabIndex={`${page === 0 ? "-1" : ""}`}
        disabled={page === 0 ? true : false}
        ariaHidden={page === 0}
        // btnTitle='Go to previous notebook page'
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    labNotebookPages: state.labNotebookPages,
    courseData: state.courseData,
    hasLabNotebookSubmitted: state.hasLabNotebookSubmitted,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLabNotebookPages: (data) =>
      dispatch({ type: "UPDATE_LAB_NOTEBOOK_PAGES", payload: data }),
    updateIsPrintPage: (data) =>
      dispatch({ type: "UPDATE_IS_PRINT_PAGE", payload: data }),
    updateImgRefArray: (data) => dispatch({ type: "UPDATE_IMG_REF_ARRAY" }),
    updateLoadedRefArray: (data) =>
      dispatch({ type: "UPDATE_IMG_LOADED_ARRAY" }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(LabNoteBookNavigation)
);
