/** @format */

import React from "react";
import { connect } from "react-redux";
import { imagePath } from "../helper/Helper";
import "./ResourceSideBarContent.css";
import Parser from "html-react-parser";

const ResourceSideBarContent = (props) => {
  const resourceTabsData = [];
  const courseData = props.mainCourseData;
  let count = 0;

  const resourceHandler = (e) => {
    // console.log("here at course data", courseData[e.target.name].maxWidth);
    props.updateShowLightBoxBool(true);
    if (props.showResourceSideBarBool) props.updateResourceSideBarBool(false);
    if (e.target.id === "Images")
      props.updateLightBoxData({
        type: "ResourceImage",
        url: imagePath(courseData[e.target.name].src),
        maxWidth: courseData[e.target.name].maxWidth
          ? courseData[e.target.name].maxWidth
          : {},
        altText: courseData[e.target.name].altText
          ? courseData[e.target.name].altText
          : "",
        scrollImg: courseData[e.target.name].scrollImg
          ? courseData[e.target.name].scrollImg
          : false,
      });
    else if (e.target.id === "PDF") {
      //if PDF open in new window
      window.open(courseData[e.target.name].ref, "_blank");
      props.updateShowLightBoxBool(false);
    } else if (e.target.id === "Pages") {
      //if PDF open in new window
      window.open(courseData[e.target.name].ref, "_blank");
      props.updateShowLightBoxBool(false);
    } else if (e.target.id === "Videos")
      props.updateLightBoxData({
        type: "ResourceVideo",
        url: courseData[e.target.name].src,
      });
    else if (e.target.id === "DataTable")
      props.updateLightBoxData({
        type: "DataTable",
        pageData: courseData[e.target.name],
      });

    let nonListCount = 0;

    courseData.forEach((item, index) => {
      //count all no listing component ( i.e PDF, Page) and subtract that number from resourcepage as we are skipping non listing elements
      if (index < +e.target.name) {
        let hideFromList = item.type === "PDF" ? true : false;
        // hideFromList = element.hideFromList ? element.hideFromList : hideFromList;

        if (item.hideFromList === false) hideFromList = false;
        if (item.hideFromList === true) hideFromList = true;

        if (hideFromList) nonListCount = nonListCount + 1;
      }
    });
    Window.pageNumber = +e.target.name;
    props.updateResourcePageData(+e.target.name - nonListCount);
    Window.maxPages = +courseData.length;
    Window.content = [e.target.id, courseData];
  };

  courseData.forEach((data, i) => {
    // console.log("data resoruces", data);
    resourceTabsData.push(
      <div
        key={i * new Date().getTime() * Math.random() * 1000000}
        className='resource-wrapper'
      >
        <div className='inner-resource-wrapper'>
          <button
            name={count}
            aria-hidden={false}
            aria-label={Parser(data.content)}
            id={data.type}
            // style={{
            //   pointerEvents: data.disableClick === true ? "none" : "auto",
            // }}
            className='resource-button'
            onClick={resourceHandler}
          />
          <div className='resource-image-wrapper'>
            <img
              draggable={false}
              src={imagePath(data.thumbnailSrc)}
              alt='image'
              aria-hidden={true}
            />
          </div>
          <div className='resource-content-wrapper' aria-hidden={true}>{Parser(data.content)}</div>
        </div>
      </div>
    );
    count = count + 1;

    // console.log(count);
  });
  return (
    <div className='resource-sidebar-content customScrollbar'>
      <div className='resource-sidebar-content-wrapper'>{resourceTabsData}</div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    showResourceSideBarBool: state.showResourceSideBarBool,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
    updateResourcePageData: (data) =>
      dispatch({ type: "UPDATE_RESOURCE_NOTEBOOK_PAGES", payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceSideBarContent);
