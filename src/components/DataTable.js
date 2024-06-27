/** @format */

import React, { useRef } from "react";
import Parser from "html-react-parser";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Input from "./Input";
import { withScorm } from "react-scorm-provider-v2";
import "./DataTable.css";
import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  getCommonWindowObj,
  imagePath,
  labNoteBookZoomLineheight,
} from "../helper/Helper";
import { useEffect } from "react";
import { connect } from "react-redux";
import userEvent from "@testing-library/user-event";

const DataTable = (props) => {
  let hasLabNotebookSubmitted, tableData;
  const dataTableRef = useRef(null);
  const dataTableTitleRef = useRef(null);
  const zoomIndex = useSelector((state) => state.zoomIndex);

  const serialNumberData = props.pageData.sr ? props.pageData.sr : 0;

  let titleComponent = [];

  useEffect(() => {
    // if (dataTableRef.current.closest(".zoomLevelRight2")) {
    //   dataTableRef.current
    //     .closest(".zoomLevelRight2")
    //     .classList.remove("zoomWidth50Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight2")
    //     .classList.remove("zoomWidth75Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight2")
    //     .classList.remove("zoomWidth25Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight2")
    //     .classList.remove("zoomWidth100Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight2")
    //     .classList.remove("zoomLevelRight2");
    // }
    // if (dataTableRef.current.closest(".zoomLevelRight3")) {
    //   dataTableRef.current
    //     .closest(".zoomLevelRight3")
    //     .classList.remove("zoomWidth50Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight3")
    //     .classList.remove("zoomWidth75Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight3")
    //     .classList.remove("zoomWidth25Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight3")
    //     .classList.remove("zoomWidth100Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelRight3")
    //     .classList.remove("zoomLevelRight3");
    // }
    // if (dataTableRef.current.closest(".zoomLevelLeft2")) {
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft2")
    //     .classList.remove("zoomWidth50Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft2")
    //     .classList.remove("zoomWidth75Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft2")
    //     .classList.remove("zoomWidth25Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft2")
    //     .classList.remove("zoomWidth100Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft2")
    //     .classList.remove("zoomLevelLeft2");
    // }
    // if (dataTableRef.current.closest(".zoomLevelLeft3")) {
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft3")
    //     .classList.remove("zoomWidth50Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft3")
    //     .classList.remove("zoomWidth75Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft3")
    //     .classList.remove("zoomWidth25Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft3")
    //     .classList.remove("zoomWidth100Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelLeft3")
    //     .classList.remove("zoomLevelLeft3");
    // }
    // if (dataTableRef.current.closest(".zoomLevelCenter2")) {
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter2")
    //     .classList.remove("zoomWidth50Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter2")
    //     .classList.remove("zoomWidth75Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter2")
    //     .classList.remove("zoomWidth25Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter2")
    //     .classList.remove("zoomWidth100Level2");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter2")
    //     .classList.remove("zoomLevelCenter2");
    // }
    // if (dataTableRef.current.closest(".zoomLevelCenter3")) {
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter3")
    //     .classList.remove("zoomWidth50Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter3")
    //     .classList.remove("zoomWidth75Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter3")
    //     .classList.remove("zoomWidth25Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter3")
    //     .classList.remove("zoomWidth100Level3");
    //   dataTableRef.current
    //     .closest(".zoomLevelCenter3")
    //     .classList.remove("zoomLevelCenter3");
    // }
    // dataTableRef.current.closest(".zoomLevelRight2").classList
  }, []);
  const createTableData = (newData) => {
    const newArray = props.pageData.tableData;
    props.pageData.tableData.forEach((item, index) => {
      item.forEach((item2, index2) => {
        if (item2.type === "text") {
          newArray[index][index2] = item2;
        } else if (newData[index] && newData[index][index2]) {
          newArray[index][index2] = newData[index][index2];
        }
        // console.log("item", item2.type, newData[index][index2].type);
      });
    });

    return newArray;
  };

  let windowObj = getCommonWindowObj();
  tableData = props.pageData.tableData;
  // if (props.sco.apiConnected) {
  //   const scromData = props.sco.suspendData;
  //   const suspendData = scromData[props.page];
  //   const scromTableData =
  //     suspendData && suspendData.mainDataTable
  //       ? suspendData.mainDataTable[serialNumberData]
  //       : "";
  //   tableData = scromTableData ? scromTableData : props.pageData.tableData;

  //   if (scromTableData) {
  //     tableData = createTableData(scromTableData);
  //   }
  //   const hasLabNotebookSubmittedFlag = scromData["hasLabNotebookSubmitted"];
  //   hasLabNotebookSubmitted = hasLabNotebookSubmittedFlag
  //     ? hasLabNotebookSubmittedFlag
  //     : false;
  // } else {
  //   // tableData = windowObj[props.page]
  //   //   ? windowObj[props.page].mainDataTable[serialNumberData]
  //   //   : props.pageData.tableData;

  //   tableData = props.pageData.tableData;
  //   // if (
  //   //   windowObj[props.page] &&
  //   //   windowObj[props.page].mainDataTable &&
  //   //   windowObj[props.page].mainDataTable[serialNumberData]
  //   // ) {
  //   //   tableData = createTableData(
  //   //     windowObj[props.page].mainDataTable[serialNumberData]
  //   //   );

  //   //   // console.log(
  //   //   //   "table data",
  //   //   //   window[props.page].mainDataTable[serialNumberData]
  //   //   // );
  //   // }

  //   windowObj = getCommonWindowObj();
  //   hasLabNotebookSubmitted = windowObj.hasLabNotebookSubmitted
  //     ? windowObj.hasLabNotebookSubmitted
  //     : false;
  // }

  /* A react hook that is called when the component is mounted and when the zoomIndex changes. */
  // useEffect(() => {
  //   let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
  //     zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
  //   if (zoomIndex === 1) {
  //     zoomContent = { fontSize: 0.95, lineHeight: 1.3 };
  //     zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
  //   } else if (zoomIndex === 2) {
  //     zoomContent = { fontSize: 1.05, lineHeight: 1.4 };
  //     zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
  //   } else {
  //     zoomContent = { fontSize: 1.15, lineHeight: 1.5 };
  //     zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
  //   }
  //   if (!props.showLightBox) {
  //     labNoteBookZoomLineheight(
  //       document.querySelectorAll("#data-table-head"),
  //       zoomHeader
  //     );
  //     labNoteBookZoomLineheight(
  //       document.querySelectorAll(".plain-text-comp-heading"),
  //       zoomHeader
  //     );
  //     labNoteBookZoomLineheight(
  //       document.querySelectorAll(".data-table-component"),
  //       zoomContent
  //     );
  //   }
  // }, [zoomIndex]);

  /* Checking if the title is a string or an array. If it is a string, it will push the title to the
titleComponent array. If it is an array, it will loop through the array and push each title to the
titleComponent array. */

  const onClickHandler = (e) => {
    // e.preventDefault();
    // console.log("click happened", props.pageData);
    // console.log(dataTableTitleRef.current);
    props.updateShowLightBoxBool(true);
    props.updateLightBoxData({
      type: "DataTable",
      refs: dataTableTitleRef,
      pageData: props.pageData,
    });
  };

  const onKeyDownHandler = (e) => {
    if (e.keyCode == 13 || e.keyCode == 32) {
      props.updateShowLightBoxBool(true);
      props.updateLightBoxData({
        type: "DataTable",
        refs: dataTableTitleRef,
        pageData: props.pageData,
      });
    }
  };

  if (props.pageData.title) {
    if (typeof props.pageData.title === "string") {
      if (props.pageData.allowClick === true) {
        titleComponent.push(
          <button
            className='data-table-title data-table-title-button'
            onClick={
              props.pageData.allowClick === true && !props.showLightBox
                ? onClickHandler
                : {}
            }
            disabled={props.showLightBox}
            role='button'
            ref={dataTableTitleRef}
            tabIndex={props.pageData.allowClick === true ? "0" : "-1"}
            title={props.pageData.hoverText ? props.pageData.hoverText : ""}
            style={{
              textDecoration:
                props.pageData.allowClick === true && !props.showLightBox
                  ? "underline"
                  : "",
              cursor:
                props.pageData.allowClick === true && !props.showLightBox
                  ? "pointer"
                  : "auto",
            }}
          >
            {Parser(props.pageData.title)}
          </button>
        );
      } else {
        titleComponent.push(
          <div
            className='data-table-title'
            onClick={
              props.pageData.allowClick === true && !props.showLightBox
                ? onClickHandler
                : {}
            }
            role='button'
            tabIndex={props.pageData.allowClick === true ? "0" : "-1"}
            title={props.pageData.hoverText ? props.pageData.hoverText : ""}
            style={{
              textDecoration:
                props.pageData.allowClick === true && !props.showLightBox
                  ? "underline"
                  : "",
              cursor:
                props.pageData.allowClick === true && !props.showLightBox
                  ? "pointer"
                  : "auto",
            }}
          >
            {Parser(props.pageData.title)}
          </div>
        );
      }
    } else {
      props.pageData.title.forEach((title, index) => {
        if (props.pageData.allowClick === true) {
          titleComponent.push(
            <button
              key={`${index}_key_${serialNumberData}`}
              // style={index === 0 ? {} : { marginTop: "10px" }}
              className={`data-table-title data-table-title-button data-table-title-${index}`}
              onClick={props.pageData.allowClick === true ? onClickHandler : {}}
              tabIndex={props.pageData.allowClick === true ? "0" : "-1"}
              disabled={props.showLightBox}
              role='button'
              style={{
                textDecoration:
                  props.pageData.allowClick === true && !props.showLightBox
                    ? "underline"
                    : "",
                cursor:
                  props.pageData.allowClick === true && !props.showLightBox
                    ? "pointer"
                    : "auto",
                marginTop: index === 0 ? "" : "5px",
              }}
            >
              {Parser(title)}
            </button>
          );
        } else {
          titleComponent.push(
            <div
              key={`${index}_key_${serialNumberData}`}
              // style={index === 0 ? {} : { marginTop: "10px" }}
              className={`data-table-title  data-table-title-${index}`}
              onClick={props.pageData.allowClick === true ? onClickHandler : {}}
              tabIndex={props.pageData.allowClick === true ? "0" : "-1"}
              disabled={props.showLightBox}
              role='button'
              style={{
                textDecoration:
                  props.pageData.allowClick === true && !props.showLightBox
                    ? "underline"
                    : "",
                cursor:
                  props.pageData.allowClick === true && !props.showLightBox
                    ? "pointer"
                    : "auto",
                marginTop: index === 0 ? "" : "10px",
              }}
            >
              {Parser(title)}
            </div>
          );
        }
      });
    }
  }

  // tableData.forEach((item) => {
  //   item.forEach((item2) => {
  //     // console.log("item", item2.text);
  //   });
  // });

  const getComponent = (rowid, colid, col) => {
    // if (col.type === "text") {
    //   return Parser(col.text);
    // } else {
    //   return (
    //     <div
    //       style={{
    //         backgroundColor: props.pageData.tableData[rowid][colid].color
    //           ? props.pageData.tableData[rowid][colid].color
    //           : "#ffffff",
    //         margin: "3px",
    //       }}
    //     >
    //       <Input
    //         key={`r_${rowid}c_${colid}_key_${serialNumberData}`}
    //         id={`sr_${serialNumberData}r_${rowid}c_${colid}`}
    //         sr={serialNumberData}
    //         dtype={col.type}
    //         className='inputBoxes table-columns'
    //         inputType={col.editorType ? col.editorType : "editorLite"}
    //         type={col.editorType}
    //         alignText={col.align}
    //         maxLength={maxLength(props.pageData, rowid, colid)}
    //         defaultValue={col.text}
    //         disabled={hasLabNotebookSubmitted}
    //         tabIndex={hasLabNotebookSubmitted ? "-1" : "0"}
    //         sco={props.sco}
    //         page={props.page}
    //       />
    //     </div>
    //   );
    // }

    switch (col.type) {
      case "text":
        return Parser(col.text);

      case "Image":
        // console.log("here image", props.pageData.tableData[rowid][colid], col);
        return (
          <div className='image-in-table-wrapper'>
            <img
              draggable={false}
              className='image-in-table'
              title={`${props.pageData.tableData[rowid][colid].hoverText
                ? props.pageData.tableData[rowid][colid].hoverText
                : ""}`}
              src={imagePath(props.pageData.tableData[rowid][colid].src)}
              style={{
                width: props.pageData.tableData[rowid][colid].width
                  ? props.pageData.tableData[rowid][colid].width
                  : "auto",
                height: props.pageData.tableData[rowid][colid].height
                  ? props.pageData.tableData[rowid][colid].height
                  : "auto",
              }}
            ></img>
          </div>
        );
      default:
        return (
          <div
            style={{
              backgroundColor: props.pageData.tableData[rowid][colid].color
                ? props.pageData.tableData[rowid][colid].color
                : "#ffffff",
              margin: "3px",
              height: props.pageData.tableData[rowid][colid].rowHeight
                ? props.pageData.tableData[rowid][colid].rowHeight
                : "auto",
            }}
          >
            <Input
              key={`r_${rowid}c_${colid}_key_${serialNumberData}`}
              id={`sr_${serialNumberData}r_${rowid}c_${colid}`}
              sr={serialNumberData}
              dtype={col.type}
              className='inputBoxes table-columns'
              inputType={col.editorType ? col.editorType : "editorLite"}
              type={col.editorType}
              alignText={col.align}
              maxLength={maxLength(props.pageData, rowid, colid)}
              defaultValue={col.text}
              disabled={hasLabNotebookSubmitted}
              tabIndex={hasLabNotebookSubmitted ? "-1" : "0"}
              sco={props.sco}
              page={props.page}
            />
          </div>
        );
    }
  };

  const maxLength = (pageData, rowid, colid) => {
    if (props.pageData.tableData[rowid][colid].maxLength) {
      return props.pageData.tableData[rowid][colid].maxLength;
    } else if (
      pageData.header &&
      pageData.header[colid] &&
      typeof pageData.header[colid] !== "string" &&
      pageData.header[colid].maxLength
    ) {
      return pageData.header[colid].maxLength;
    }
    // console.log("max length data ", pageData.header[colid], rowid, colid);
    return pageData.maxLength;
  };
  // console.log("max length", typeof props.pageData.header[0] === "");
  return (
    <Col
      // ref= {dataTableRef}
      key={`${serialNumberData}`}
      className='data-table-container customScrollbar'
      style={
        props.pageData.style
          ? {
            ...props.pageData.style, width: props.pageData.tableWidth ? props.pageData.tableWidth : "100%",
            maxWidth: props.pageData.tableMaxWidth
              ? props.pageData.tableMaxWidth
              : "100%",
          }
          : {
            width: props.pageData.tableWidth ? props.pageData.tableWidth : "100%",
            maxWidth: props.pageData.tableMaxWidth
              ? props.pageData.tableMaxWidth
              : "100%",
          }
      }
    >
      <div
        className={
          !props.pageData.title
            ? "data-table-text-comp-heading-hidden bodyHeading"
            : "data-table-text-comp-heading bodyHeading"
        }
        id='data-table-head'
        style={{ textAlign: "left", display: "flex", flexDirection: "column" }}
      >
        {titleComponent}
      </div>
      <div
        className={"tablebody-container"}
        ref={dataTableRef}
        style={
          props.pageData.headerHidden
            ? { marginTop: "-16px" }
            : { marginTop: "5px" }
        }
      // onClick={props.pageData.allowClick === true ? onClickHandler : {}}
      // style={{
      //   cursor: props.pageData.allowClick === true ? "pointer" : "auto",
      // }}
      >
        <Table className='data-table-component' bordered>
          <thead
            className={
              props.pageData.headerHidden
                ? "data-table-header-background-hidden"
                : "data-table-header-background"
            }
            style={props.pageData.headerHidden ? { height: "32px" } : {}}
          >
            <tr
              key={"header" + serialNumberData}
              style={props.pageData.headerHidden ? { height: "32px" } : {}}
            >
              {props.pageData.header &&
                props.pageData.header.map((item, id) => {
                  // console.log("items", item);
                  if (typeof item === "string") {
                    return (
                      <th
                        key={"header_" + id + Math.random() + serialNumberData}
                        style={{
                          borderWidth: "3px 2px 0px 2px",
                          borderBottom: "solid 2px black",
                          width: item.colWidth ? item.colWidth : "auto",
                          color: "#fff",
                          background: "#6b6b6b",
                        }}
                        className={`${props.pageData.headerHidden
                            ? "data-table-header-background-hidden"
                            : item.borderRight
                              ? "thickLine"
                              : ""
                          }`}
                        // title={props.pageData.allowClick === true ? item : ""}
                        aria-label={`Header ${id + 1},`}
                        aria-hidden={props.pageData.headerHidden ? props.pageData.headerHidden : false}
                        tabIndex='-1'
                      >
                        {Parser(item)}
                      </th>
                    );
                  } else {
                    return (
                      <th
                        key={"header_" + id + Math.random() + serialNumberData}
                        colSpan={item.colspan ? item.colspan : 1}
                        style={{
                          borderWidth: "3px 2px 0px 2px",
                          borderBottom: "solid 2px black",
                          width: item.colWidth ? item.colWidth : "auto",
                          color: "#fff",
                          background: "#6b6b6b",
                        }}
                        className={`${props.pageData.headerHidden
                            ? "data-table-header-background-hidden"
                            : item.borderRight
                              ? "thickLine"
                              : ""
                          }`}
                        // title={
                        //   props.pageData.allowClick === true
                        //     ? item.hoverText
                        //       ? item.hoverText
                        //       : ""
                        //     : ""
                        // }
                        aria-label={`Header ${id + 1}, ${item.colspan
                          ? "Column span " + item.colspan + ','
                          : ""}`}
                        aria-hidden={props.pageData.headerHidden ? props.pageData.headerHidden : false}
                        tabIndex='-1'
                      >
                        {Parser(item.text)}
                      </th>
                    );
                  }
                })}
            </tr>
          </thead>
          <tbody
            style={{
              lineHeight: props.pageData.tableHeight
                ? props.pageData.tableHeight
                : "auto",
              backgroundColor: "rgb(255, 255, 255)",
            }}
            className={
              props.pageData.headerHidden ? "data-table-body-hidden" : ""
            }
          >
            {tableData.map((row, rowid) => (
              <tr
                key={"data_" + rowid + serialNumberData}
                className={`rows-data row_data_${serialNumberData}`}

              >
                {row.map((col, colid) => {
                  // console.log("item data", col.colspan ? col : "");
                  return (
                    <td
                      colSpan={
                        props.pageData.tableData[rowid][colid].colspan
                          ? props.pageData.tableData[rowid][colid].colspan
                          : 1
                      }
                      rowSpan={
                        props.pageData.tableData[rowid][colid].rowspan
                          ? props.pageData.tableData[rowid][colid].rowspan
                          : 1
                      }
                      key={`col_${rowid}_${colid}_${serialNumberData}`}
                      className={
                        (col.type === "text"
                          ? "data-table-col-background table-columns"
                          : "data-table-inputboxes",
                          col.borderRight ? "thickLine" : "")
                      }
                      // aria-label={
                      //   `row ${rowid + 1}, coloumn ${colid + 1}, ${
                      //     props.pageData.tableData[rowid][colid].colspan
                      //     ? "Column span " + props.pageData.tableData[rowid][colid].colspan + ","
                      //     : ""
                      //   }${
                      //     props.pageData.tableData[rowid][colid].rowspan
                      //     ? "Row span " + props.pageData.tableData[rowid][colid].rowspan + ","
                      //     : "" 
                      //   }${props.pageData.tableData[rowid][colid].hoverText
                      //     ? props.pageData.tableData[rowid][colid].hoverText
                      //     : ""}`
                      // }
                      aria-hidden={false}
                      tabIndex='-1'
                      style={
                        col.type === "text"
                          ? {
                            backgroundColor: props.pageData.tableData[rowid][
                              colid
                            ].color
                              ? props.pageData.tableData[rowid][colid].color
                              : "#e6e6e6 ",
                            color: props.pageData.tableData[rowid][
                              colid
                            ].textColor
                              ? props.pageData.tableData[rowid][colid].textColor
                              : "Black",
                            fontFamily: props.pageData.tableData[rowid][colid]
                              .fontFamily
                              ? props.pageData.tableData[rowid][colid]
                                .fontFamily
                              : "",
                            textAlign: props.pageData.tableData[rowid][colid]
                              .align
                              ? props.pageData.tableData[rowid][colid].align
                              : "left",

                            height: props.pageData.tableData[rowid][colid]
                              .rowHeight
                              ? props.pageData.tableData[rowid][colid]
                                .rowHeight
                              : "auto",
                            width: col.width ? col.width : "auto",
                            borderBottom: col.borderBottom
                              ? "solid black " + col.borderBottom
                              : "auto",
                            verticalAlign: props.pageData.tableData[rowid][colid]
                              .verticalAlign
                              ? props.pageData.tableData[rowid][colid].verticalAlign
                              : "middle",
                            padding: props.pageData.tableData[rowid][colid]
                              .verticalAlign
                              ? "8px"
                              : "",
                            // border: "2px solid red",
                          }
                          : {
                            backgroundColor:
                              col.type === "Image"
                                ? props.pageData.tableData[rowid][colid].color
                                  ? props.pageData.tableData[rowid][colid]
                                    .color
                                  : "rgb(255 255 255 / 0%)"
                                : "rgb(255 255 255 / 0%)",
                            textAlign: props.pageData.tableData[rowid][colid]
                              .align
                              ? props.pageData.tableData[rowid][colid].align
                              : "left",
                            borderWidth: "2px 2px",
                            height: props.pageData.cellHeight
                              ? props.pageData.cellHeight
                              : "auto",
                            width: col.width ? col.width : "auto",
                            borderBottom: col.borderBottom
                              ? col.borderBottom
                              : "auto",
                            borderRight: col.borderRight
                              ? "solid black 3px !important"
                              : "auto",
                            padding: "0px",
                          }
                      }
                      data-type={col.type ? col.type : "auto"}
                      id={`sr_${serialNumberData}r_${rowid}c_${colid}`}
                    >
                      {/* {(col.type === "text")  (
                        Parser(col.text)
                      )  (
                        <div
                          style={{
                            backgroundColor: props.pageData.tableData[rowid][
                              colid
                            ].color
                              ? props.pageData.tableData[rowid][colid].color
                              : "#ffffff",
                            margin: "3px",
                          }}
                        >
                          <Input
                            key={`r_${rowid}c_${colid}_key_${serialNumberData}`}
                            id={`sr_${serialNumberData}r_${rowid}c_${colid}`}
                            sr={serialNumberData}
                            dtype={col.type}
                            className='inputBoxes table-columns'
                            inputType={
                              col.editorType ? col.editorType : "editorLite"
                            }
                            type={col.editorType}
                            alignText={col.align}
                            maxLength={maxLength(props.pageData, rowid, colid)}
                            defaultValue={col.text}
                            disabled={hasLabNotebookSubmitted}
                            tabIndex={hasLabNotebookSubmitted ? "-1" : "0"}
                            sco={props.sco}
                            page={props.page}
                          />
                        </div>
                      )} */}
                      <div className="image-in-table-label">{
                        `row ${rowid + 1}, coloumn ${colid + 1}, ${props.pageData.tableData[rowid][colid].colspan
                          ? "Column span " + props.pageData.tableData[rowid][colid].colspan + ","
                          : ""
                        }${props.pageData.tableData[rowid][colid].rowspan
                          ? "Row span " + props.pageData.tableData[rowid][colid].rowspan + ","
                          : ""
                        }`
                      }</div>
                      <span
                      // aria-hidden={props.pageData.tableData[rowid][colid].hoverText ? true : false}
                      >{getComponent(rowid, colid, col)}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Col>
  );
};

const mapStateToProps = (state) => {
  return {
    fillInBlank: state.fillInBlank,
    showLightBox: state.showLightBox,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(DataTable)
);
