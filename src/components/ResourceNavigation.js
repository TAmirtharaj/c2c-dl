/** @format */

import { connect } from "react-redux";
import { imagePath } from "../helper/Helper";
import { useState } from "react";
import CustomButton from "./CustomButton";

const ResourceNavigation = (props) => {
  // icons
  const nextIcon = imagePath("core/labNotebookNextIcon.svg");
  const nextIconH = imagePath("core/labNotebookNextIconH.svg");

  const previousIcon = imagePath("core/labNotebookPreviousIcon.svg");
  const previousIconH = imagePath("core/labNotebookPreviousIconH.svg");

  const maxPages2 = Window.maxPages - 1;
  let maxPages = maxPages2;
  let page = props.resourcePages ? props.resourcePages : 0;
  const imageData2 = Window.content[1];

  let imageData = [];
  imageData2.forEach((element) => {
    let hideFromList = element.type === "PDF" ? true : false;
    // hideFromList = element.hideFromList ? element.hideFromList : hideFromList;

    if (element.hideFromList === false) hideFromList = false;
    if (element.hideFromList === true) hideFromList = true;
    // console.log(
    //   "hide from list element",
    //   element.type,
    //   element.hideFromList,
    //   hideFromList
    // );
    if (hideFromList !== true) {
      imageData.push(element);
    } else {
      maxPages = maxPages - 1;
    }
  });
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
    const lightboxContent = document.querySelector(".lightbox-content-row");
    if (lightboxContent) lightboxContent.scrollTop = 0;
    page = page > 0 ? (page -= 1) : page;
    // console.log("prev btn", imageData[page], page);
    if (imageData[page].type === "Images")
      props.updateLightBoxData({
        type: "ResourceImage",
        url: imagePath(imageData[page].src),
        maxWidth: imageData[page].maxWidth ? imageData[page].maxWidth : "auto",
        altText: imageData[page].altText ? imageData[page].altText : "",
        scrollImg: imageData[page].scrollImg
          ? imageData[page].scrollImg
          : false,
      });
    else if (imageData[page].type === "PDF" && imageData[page].src) {
      props.updateLightBoxData({
        type: "ResourceImage",
        url: imagePath(imageData[page].src),
        maxWidth: imageData[page].maxWidth ? imageData[page].maxWidth : "auto",
        altText: imageData[page].altText ? imageData[page].altText : "",
        scrollImg: imageData[page].scrollImg
          ? imageData[page].scrollImg
          : false,
      });
    } else if (imageData[page].type === "Videos")
      props.updateLightBoxData({
        type: "ResourceVideo",
        url: imageData[page].src,
      });
    else if (imageData[page].type === "DataTable") {
      props.updateLightBoxData({
        type: "DataTable",
        pageData: imageData[page],
      });
    }
    props.updateResourcePageData(page);
  };

  const nextNavigationClickhandler = () => {
    const lightboxContent = document.querySelector(".lightbox-content-row");
    if (lightboxContent) lightboxContent.scrollTop = 0;
    page = page < maxPages ? (page += 1) : page;
    // console.log("next btn", imageData, page);

    if (imageData[page].type === "Images") {
      props.updateLightBoxData({
        type: "ResourceImage",
        url: imagePath(imageData[page].src),
        maxWidth: imageData[page].maxWidth ? imageData[page].maxWidth : "auto",
        altText: imageData[page].altText ? imageData[page].altText : "",
        scrollImg: imageData[page].scrollImg
          ? imageData[page].scrollImg
          : false,
      });
    } else if (imageData[page].type === "PDF" && imageData[page].src) {
      props.updateLightBoxData({
        type: "ResourceImage",
        url: imagePath(imageData[page].src),
        maxWidth: imageData[page].maxWidth ? imageData[page].maxWidth : "auto",
        altText: imageData[page].altText ? imageData[page].altText : "",
        scrollImg: imageData[page].scrollImg
          ? imageData[page].scrollImg
          : false,
      });
    } else if (imageData[page].type === "Videos") {
      props.updateLightBoxData({
        type: "ResourceVideo",
        url: imageData[page].src,
      });
    } else if (imageData[page].type === "DataTable") {
      props.updateLightBoxData({
        type: "DataTable",
        pageData: imageData[page],
      });
    }

    props.updateResourcePageData(page);
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
        ariaLabel='go to next resource'
        type='icon'
        tabIndex={`${page === maxPages ? "-1" : ""}`}
        disabled={page === maxPages ? true : false}
        ariaHidden={page === maxPages}
        // btnTitle='go to next resource'
      />
      <CustomButton
        className={`lightbox-left-navigation ${page === 0 ? "disabled" : ""}`}
        onClick={previousNavigationClickhandler}
        onMouseOver={mouseOverPreviousHandler}
        onMouseOut={mouseOutPreviousHandler}
        url={previousIconImage}
        ariaLabel='go to previous resource'
        type='icon'
        tabIndex={`${page === 0 ? "-1" : ""}`}
        disabled={page === 0 ? true : false}
        ariaHidden={page === 0}
        // btnTitle='go to previous resource'
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    resourcePages: state.resourcePages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
    updateResourcePageData: (data) =>
      dispatch({ type: "UPDATE_RESOURCE_NOTEBOOK_PAGES", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceNavigation);
