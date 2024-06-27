/** @format */

import React from "react";
import DraggableItem from "./DraggableItem";
import "./DragArea.css";

const DragArea = (props) => {
  const Component = [];

  props.pageData.forEach((element, index) => {
    Component.push(
      <DraggableItem
        key={element.id}
        sr={props.sr}
        data={element}
        index={index}
        purpose={props.purpose}
      />
    );
  });

  return <div className='drag-area-holder'>{Component}</div>;
};

export default DragArea;
