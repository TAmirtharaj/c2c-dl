/** @format */

import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { imagePath } from "../helper/Helper";
import { returnComponent } from "../createComponent/CreateComponent";
import "./LabNotebookPagesData.css";
import React from "react";

const LabNotebookPagesData = () => {
  const waterMarkImage = imagePath("core/bodyBookmark.svg");

  const courseData = useSelector((state) => state.courseData);
  const page = useSelector((state) => state.labNotebookPages) || 0;
  const waterMark = courseData.labNotebookData.pages[page].waterMark;

  const Components = [];
  courseData.labNotebookData.pages[page].pageData.forEach((comp, index) =>
    Components.push(
      returnComponent(comp, {
        page: `page_${page}`,
        index:
          courseData.labNotebookData.pages[page].pageData[index].type ===
          "Wrapper"
            ? index
            : 0,
        classList: " lab-plain-text",
      })
    )
  );

  return (
    <React.Fragment>
      {waterMark && (
        <img
          draggable={false}
          aria-hidden='true'
          className="lightbox-watermark"
          alt={waterMarkImage}
          src={waterMarkImage}
        />
      )}

      <Row
        className={`lightbox-content-col customScrollbar ${Components[0].key}`}
      >
        {Components}
      </Row>
    </React.Fragment>
  );
};

export default LabNotebookPagesData;
