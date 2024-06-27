/** @format */
import { returnComponent } from "../createComponent/CreateComponent";
import "./LabNotebookPagesData.css";
import "./Wrapper.css";
import React from "react";

const Wrapper = (props) => {
  // console.log(props, "Wrapper");
  const page = props.customizeData.page;
  /* Creating an empty array. */
  const Components = [];
  /* Pushing the returnComponent function into the Components array. */
  props.pageData.pageData.forEach((comp, index) =>
    Components.push(
      returnComponent(comp, {
        page: `${page}`,
        index: props.customizeData.index,
        classList: " lab-plain-text",
      })
    )
  );

  /* Creating a div element with className wrapper-container and Components as children. */
  return React.createElement(
    props.pageData.tag || "div",
    {
      className: `wrapper-container ${Components[0].key}`,
      style: { ...props.pageData.style, width: `${props.pageData.width}` },
    },
    Components
  );
};

export default Wrapper;
