/** @format */

import React from 'react';

const ResourceSideBarHead = (props) => {
  const titleArray = [];
  // console.log(props);
  props.data.forEach((title) => {
    titleArray.push(
      <button
        name={title}
        key={title}
        onClick={(e) => {
          setResourceTab(e.target.name);
        }}
      >
        {title}
      </button>
    );
  });

  return (
    <div className="resource-sidebar-header">
      {/* <div className="resource-sidebar-maintitle">{props.courseData.resources.title}</div> */}
      <div className="resource-sidebar-tabs">{'resourceTabTitle'}</div>
    </div>
  );
};

export default ResourceSideBarHead;
