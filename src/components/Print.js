/** @format */

import Parser from "html-react-parser";
import React, { useRef, useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
import ReactToPrint from "react-to-print";
import { useSelector } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import ComponentToPrint from "./ComponentToPrint";
import { storeLabNotebookPagesDataToScorm } from "../helper/Helper";
import CustomButton from "./CustomButton";
import "./Print.css";

const Print = (props) => {
  const componentRef = useRef();
  const page = useSelector((state) => state.labNotebookPages) || 0;
  const hasLabNotebookSubmitted = useSelector(
    (state) => state.hasLabNotebookSubmitted
  );
  const courseData = useSelector((state) => state.courseData);

  const setting = courseData.labNotebookData.printLayoutData.pageSetting
    ? courseData.labNotebookData.printLayoutData.pageSetting
    : "";

  console.log(
    "course data",
    setting,
    courseData.labNotebookData.printLayoutData.pageSetting
  );

  const setPrintStyle = () => {
    console.log("setPrintStyle");
    const css = `@page { size: ${setting}; }`,
      head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style");
    style.id = "printCSS";
    style.type = "text/css";
    style.media = "print";

    if (!document.getElementById("printCSS")) {
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);
    }
  };

  const wrapperResize = () => {
    const Wrapper = document.querySelectorAll(".wrapper-container");
    if (Wrapper) {
      Wrapper.forEach((item) => {
        item.style.width = "100%";
      });
    }
  };
  const dataTableResize = () => {
    const TablebodyContainer = document.querySelectorAll(
      ".data-table-component"
    );
    if (TablebodyContainer) {
      TablebodyContainer.forEach((item) => {
        item.style.width = "98%";
      });
    }
  };
  const textAreaIds = courseData.labNotebookData.pages.filter((page) => {
    // if (typeof page.textAreaId === "string") {
    //   return page.textAreaId;
    // } else if (typeof page.textAreaId === "object") {
    //   page.textAreaId.forEach((id) => {
    //     return id;
    //   });
    // }
    // return page.textAreaId
    return typeof page.textAreaId === "object"
      ? [...page.textAreaId]
      : page.textAreaId;
  });

  useEffect(() => {
    setPrintStyle();
  }, []);

  // console.log(textAreaIds);

  // Using Functional Component and useReactToPrint Hook
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  // return (
  //   <div>
  //     <CustomButton
  //       className="print-button"
  //       id={Parser(props.pageData.btnTitle)}
  //       title={Parser(props.pageData.btnTitle)}
  //       onClick={handlePrint}
  //     />
  //     {/* <div style={{ display: "none" }}> */}
  //     <ComponentToPrint ref={componentRef} />
  //     {/* </div> */}
  //   </div>
  // );

  // Another way using ReactToPrint Component

  // Calculate Line Breaks i.e \n
  const calcHeight = (value) => {
    let numberOfLines = (value.match(/\n/g) || []).length;
    let numberOfLineBreaks = (value.match(/\s/g) || []).length;
    let newHeight =
      20 + (numberOfLineBreaks / 15 + numberOfLines) * 24 + 12 + 2;
    return newHeight;
  };

  const hideToolbarEditor = () => {
    const editor = document.querySelectorAll(".toolbar-class");
    if (editor) {
      editor.forEach((element, index) => {
        // console.log("element is ", element);
        element.style.visibility = "hidden";
        element.style.position = "absolute";
      });
    }
  };
  // Modifying Height of text area and their parent components
  const adjustTextAreaHeight = (element, extraHeight = 0) => {
    if (element) {
      const height = calcHeight(element.value);
      element.style.height = height + "px";
      element.parentElement.style.height = height * 0.82 + "px";
      element.parentElement.style.minHeight = setting.includes("landscape")
        ? "600px"
        : "930px";
      element.parentElement.parentElement.style.height =
        "-webkit-fill-available";
    }
  };

  // Adjust all Text Areas
  const adjustTextAreas = () => {
    textAreaIds.forEach(({ textAreaId }) => {
      if (typeof textAreaId === "string") {
        if (textAreaId === "Notes")
          adjustTextAreaHeight(
            document.getElementById(textAreaId)
            , 10
          );
        else adjustTextAreaHeight(document.getElementById(textAreaId));
      } else if (typeof textAreaId === "object") {
        if (textAreaId === "Notes")
          adjustTextAreaHeight(
            document.getElementById(textAreaId)
            // , 10
          );
        else
          textAreaId.forEach((id) => {
            adjustTextAreaHeight(document.getElementById(id));
          });
      }
    });

    const textEditor = document.querySelectorAll(".text-area");
    if (textEditor) {
      textEditor.forEach((item) => {
        item.style.height = "100%";
      });
    }

    const textEditorWrappper = document.querySelectorAll(".question-body ");
    if (textEditorWrappper) {
      textEditorWrappper.forEach((item) => {
        item.style.height = "100%";
      });
    }
  };

  const adjustQueNo = () => {
    const wrapperContainer = document.querySelectorAll(
      ".list-comp-group-list-item"
    );
    if (wrapperContainer) {
      wrapperContainer.forEach((item) => {
        item.style.right = "0px";
      });
    }
  };
  // saving Notes Data before print
  const saveNotesData = () => {
    const { textAreaId } = textAreaIds[textAreaIds.length - 1];
    const lastTextArea =
      courseData.labNotebookData.pages[
        courseData.labNotebookData.pages.length - 1
      ].pageData[0].id;

    const notesArea = document.getElementById("notes-area");
    const notesArea2 = document.getElementById(lastTextArea);
    console.log(notesArea);
    if (notesArea) {
      console.log(notesArea2.value);
      document.getElementById("notes-area").innerText =
        document.getElementById(lastTextArea).value;
      console.log(notesArea);
    }
    storeLabNotebookPagesDataToScorm(props.sco, hasLabNotebookSubmitted, page);
  };

  // const saveNotesData = () => {
  //   storeLabNotebookPagesDataToScorm(props.sco, hasLabNotebookSubmitted, page);
  // };

  const adjustImageSize = () => {
    const imageData = document.getElementsByClassName("imageData");
    if (imageData) {
      Array.from(imageData).forEach((item) => {
        const width = item.width;
        const height = item.height;

        if (width > height) {
          if (width > 700) {
            item.width = 700;
          }
        } else {
          if (height > 500) {
            item.height = 500;
          }
        }
        // item.height = 100;
      });
    }
    // if (imageData) {
    //   imageData.forEach((item) => {
    //     console.log("hereeeeeeeeeeeeee", item);
    //   });
    // }
  };
  return (
    <div style={{ height: "50px" }}>
      <ReactToPrint
        // onClick to Trigger event
        trigger={() => (
          <CustomButton
            className="print-button "
            id={Parser(props.pageData.btnTitle)}
            title={Parser(props.pageData.btnTitle)}
            ariaLabel="Print"
            ariaHidden="false"
            btnTitle="Download the lab notebook"
          />
        )}
        content={() => {
          // save notes before print
          saveNotesData();
          // Adjust Height before print
          adjustTextAreas();
          adjustImageSize();
          hideToolbarEditor();
          wrapperResize();
          dataTableResize();
          adjustQueNo();
          return componentRef.current;
        }}
      />
      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>
    </div>
  );
};

export default withScorm()(Print);
