/** @format */

import { useEffect } from "react";
import "./LightboxKnowledgeCheckFeedback.css";
import OverView from "../templates/OverView/OverView";
import { imagePath, labNoteBookZoomLineheight } from "../helper/Helper";
import { useSelector } from "react-redux";
import Parser from "html-react-parser";
import DataTable from "./DataTable";

const LightboxKnowledgeCheckFeedback = (props) => {
  console.log(props, "LightboxKnowledgeCheckFeedback $$$$$$$$$");
  const zoomIndex = useSelector((state) => state.zoomIndex);
  useEffect(() => {
    let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
      zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
    if (zoomIndex === 1) {
      zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
      zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
    } else if (zoomIndex === 2) {
      zoomContent = { fontSize: 1.05, lineHeight: 1.4 };
      zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
    } else {
      zoomContent = { fontSize: 1.15, lineHeight: 1.5 };
      zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
    }
    labNoteBookZoomLineheight(
      document.querySelectorAll(".knowledgecheckHeading"),
      zoomHeader
    );
    labNoteBookZoomLineheight(
      document.querySelectorAll(".knowledgecheckBody"),
      zoomContent
    );

    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".tablebody-container"),
    //   { fontSize: 0.95, lineHeight: 1.3 }
    // );

    // to disable zoom  for datatable inside the hint\
    const table = document.querySelectorAll(".tablebody-container");
    if (table) {
      table.forEach((ele) => {
        ele.style.fontSize = "initial";
        ele.style.lineHeight = "initial";
      });
    }

    // to disable zoom for table header
    const tableHeading = document.querySelectorAll(
      ".data-table-text-comp-heading"
    );
    if (tableHeading) {
      tableHeading.forEach((ele) => {
        ele.style.fontSize = "initial";
        ele.style.lineHeight = "initial";
      });
    }
  }, [zoomIndex]);
  console.log("max width", props.data);
  setTimeout(() => {
      const hint = document.getElementsByClassName('lightbox-content-knowledgecheck customScrollbar');
      console.log(hint);
      if( hint ) hint[0].focus();
    }, 500);
  return (
    <div
      className='lightbox-content-knowledgecheck customScrollbar'
      aria-hidden={false}
      tabIndex='0'>
      <div role="heading" aria-level="1" className='lightbox-content-knowledgecheck-heading bodyHeading knowledgecheckHeading'>
        {props.data.title}
      </div>
      <div className='lightbox-content-knowledgecheck-container bodyPara knowledgecheckBody'>
        <div
          className='lightbox-content-knowledgecheck-left-holder'
          style={{
            width:
              props.data.hasOwnProperty("img") &&
              !props.data.hasOwnProperty("imgContainer")
                ? "50%"
                : "100%",
          }}
        >
          {props.data.hasOwnProperty("body") && (
            <div
              className='lightbox-content-knowledgecheck-left-container '
              style={{
                width: props.data.hasOwnProperty("img") ? "100%" : "100%",
              }}
            >
              {Parser(props.data.body)}
            </div>
          )}
          {props.data.hasOwnProperty("dataTable") &&
            props.data.dataTable.map((item) => {
              console.log("data table in hint", item);
              const flexFlag =
                !props.data.hasOwnProperty("img") &&
                !props.data.hasOwnProperty("body");
              return (
                <div
                  style={
                    flexFlag
                      ? { display: "flex", justifyContent: "center" }
                      : {}
                  }
                >
                  <DataTable pageData={item}></DataTable>
                </div>
              );
            })}

          {props.data.hasOwnProperty("img") &&
            props.data.imgContainer === "leftContainer" && (
              <div className='lightbox-content-knowledgecheck-image-container '>
                {typeof props.data.img === "string" ? (
                  <img
                    draggable={false}
                    src={imagePath(props.data.img)}
                    style={{
                      width: "100%",
                      marginTop: "0px",
                    }}
                    title={`${
                      !props.data.alt
                        ? ``
                        : props.data.alt.replace(/<\/?[^>]+(>|$)/g, "")
                    }`}
                    alt={`image, ${
                      !props.data.alt
                        ? ``
                        : props.data.alt.replace(/<\/?[^>]+(>|$)/g, "")
                    }`}
                  ></img>
                ) : (
                  props.data.img.map((img, i) => (
                    <img
                      draggable={false}
                      key={i}
                      src={imagePath(img.src)}
                      style={{
                        width: img.maxWidth ? img.maxWidth : "",
                        height: img.maxHeight ? img.maxHeight : "",
                        marginTop: `${i === 0 ? "10px" : "10px"}`,
                        // marginRight: "15px",
                        marginRight: "5px",
                        verticalAlign: "top",
                        marginLeft: "5px",
                      }}
                      alt={`image, ${
                        !img.alt ? `` : img.alt.replace(/<\/?[^>]+(>|$)/g, "")
                      }`}
                      title={`${
                        !img.alt ? `` : img.alt.replace(/<\/?[^>]+(>|$)/g, "")
                      }`}
                    ></img>
                  ))
                )}
              </div>
            )}
        </div>
        {props.data.hasOwnProperty("img") &&
          !props.data.hasOwnProperty("imgContainer") && (
            <div className='lightbox-content-knowledgecheck-right-container '>
              {typeof props.data.img === "string" ? (
                <img
                  draggable={false}
                  src={imagePath(props.data.img)}
                  style={{
                    width: "100%",
                    marginTop: "0px",
                  }}
                  title={`${
                    !props.data.alt
                      ? ``
                      : props.data.alt.replace(/<\/?[^>]+(>|$)/g, "")
                  }`}
                  alt={`image, ${
                    !props.data.alt
                      ? ``
                      : props.data.alt.replace(/<\/?[^>]+(>|$)/g, "")
                  }`}
                ></img>
              ) : (
                props.data.img.map((img, i) => (
                  <img
                    draggable={false}
                    key={i}
                    src={imagePath(img.src)}
                    style={{
                      width: img.maxWidth ? img.maxWidth : "100%",
                      verticalAlign: "top",
                      marginTop: `${i === 0 ? "5px" : "14px"}`,
                    }}
                    alt={`image, ${
                      !img.alt ? `` : img.alt.replace(/<\/?[^>]+(>|$)/g, "")
                    }`}
                    title={`${
                      !img.alt ? `` : img.alt.replace(/<\/?[^>]+(>|$)/g, "")
                    }`}
                  ></img>
                ))
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default LightboxKnowledgeCheckFeedback;
