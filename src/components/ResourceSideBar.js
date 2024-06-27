/** @format */
import React, { useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import "./ResourceSideBar.css";
import ResourceSideBarContent from "./ResourceSideBarContent";

const ResourceSideBar = (props) => {
  let [holderHeight, setHolderHeight] = useState(0);
  let [resourceTab, setResourceTab] = useState("All");
  let resourceTabTitle = [];
  let resourceTabTitle2 = [];
  let resourceData2 = [];

  const resourceCourseDataMain = props.courseData.resources.pageData;
  resourceCourseDataMain.forEach((data) => resourceTabTitle2.push(data.type));
  resourceTabTitle2 = [
    "All",
    ...resourceTabTitle2.filter(
      (data, index) => resourceTabTitle2.indexOf(data) === index
    ),
  ];
  resourceTabTitle2.sort();
  resourceTabTitle2.forEach((data) => {
    resourceTabTitle.push(
      <button
        name={data}
        key={data}
        id={data}
        className={`title-${data} ${
          data === resourceTab ? "selectedTitle" : ""
        }`}
        onClick={(e) => {
          setResourceTab(e.target.name);
        }}
      >
        {data === "DataTable" ? "Tables" : data}
      </button>
    );
  });

  if (resourceTab === "All") resourceData2 = resourceCourseDataMain;
  else
    resourceData2 = resourceCourseDataMain.filter(
      (data) => data.type === resourceTab
    );

  useLayoutEffect(() => {
    let updateSize = () =>
      setHolderHeight(
        document.getElementsByClassName("bodyHolder")[0].clientHeight
      );
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return props.showResourceSideBarBool ? (
    <div className='resource-holder'>
      <div
        className='resource-sidebar-wrapper'
        style={{ height: `${holderHeight - 4}px` }}
      >
        <div className='resource-sidebar-container'>
          <div className='resource-sidebar-header'>
            <div className='resource-sidebar-maintitle'>
              {props.courseData.resources.title}
            </div>
            <div className='resource-sidebar-tabs'>{resourceTabTitle}</div>
          </div>
          <ResourceSideBarContent
            mainData={props.courseData.resources}
            currentTab={resourceTab}
            mainCourseData={resourceData2}
          />
        </div>
      </div>
    </div>
  ) : null;
};
const mapStateToProps = (state) => {
  return {
    showResourceSideBarBool: state.showResourceSideBarBool,
    courseData: state.courseData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateResourceSideBarBool: (data) =>
      dispatch({ type: "SHOW_RESOURCE_SIDEBAR_BOOL", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceSideBar);
