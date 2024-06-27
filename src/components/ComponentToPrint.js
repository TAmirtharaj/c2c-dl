/** @format */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./ComponentToPrint.css";
import Parser from "html-react-parser";
import { returnComponent } from "../createComponent/CreateComponent";
import { logoForPrint } from "../config";
import { getCommonWindowObj } from "../helper/Helper";
import { values } from "draft-js/lib/DefaultDraftBlockRenderMap";

const ComponentToPrint = React.forwardRef((props, ref) => {
  const courseData = useSelector((state) => state.courseData);
  const logoWaterMark = logoForPrint;
  const zoomIndex = useSelector((state) => state.zoomIndex);
  console.log("zoom index------------", zoomIndex);
  let windowObj = getCommonWindowObj();
  let printEnd;
  const userName = windowObj["userName"] ? windowObj["userName"] : "";
  // useEffect(() => {
  //   const temps = document.querySelectorAll(".tablebody-container");
  //   temps.forEach((temp) => {
  //     console.log(temp);
  //     if (temp) {
  //       temp.style.fontSize = "0.7em";
  //       console.log(temp);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   const printBtn = document.querySelector(".print-button");
  //   console.log(
  //     "component successfully laoded------",
  //     printBtn.classList.contains("disable-print")
  //   );
  //   if (printBtn && printBtn.classList.contains("disable-print")) {
  //     printBtn.classList.remove("disable-print");
  //   }
  // }, []);
  const Components = [];
  const addWaterMark = (pageCounter, i) => {
    Components.push(
      `<img draggable={false} className="logo-watermark" alt=${logoWaterMark} src=${logoWaterMark} key={image_${pageCounter}_${i}} />`
    );
    Components.push(
      `<div className="copyright-content" key={copyright_${pageCounter}_${i}}><span>${Parser(
        courseData.labNotebookData.printLayoutData.copyright
      )}</span></div>`
    );
    Components.push(
      `<div className="title-bottom-left" key={title_${pageCounter}_${i}}>${Parser(
        courseData.courseTitle
      )}</div>`
    );
    // Components.push(
    //   `<div className="name-top-right" key={name_${pageCounter}_${i}}>${Parser(
    //     userName
    //   )}</div>`
    // );
    // Components.push(
    //   `<div className="page-break" key={page_${pageCounter}_${i}} />`
    // );
  };

  const addUserName = () => {
    Components.push(
      <div
        style={{
          color: "black",
          display: "flex",
          justifyContent: "flex-end",
          fontSize: "0.9em",
          width: "100%",
          fontFamily: "Montserrat-Bold",
        }}
      >
        {userName}
      </div>
    );
  };
  let pageCounter = 0;
  courseData.labNotebookData.pages.forEach((page, i) => {
    // console.log(page, i);
    let count = 0;
    page.pageData.forEach((comp, index) => {
      if (count < 2 && courseData.labNotebookData.pages.length > i + 1) {
        addUserName();
      }
      if (comp.type === "Notes") {
        addUserName();
      }

      if (comp.type !== "Print") {
        if (comp.type === "Questions") {
          Components.push(
            returnComponent(
              { ...comp, id: `${page.textAreaId}` },
              { page: `page_${pageCounter}` }
            )
          );
        } else if (comp.type === "Notes") {
          let notesData = windowObj[page];
          console.log(page);
          Components.push(
            `<div className="notes-card">
              <div className="card-header">Notes</div>
              <div
                className="notes-body"
                style="text-align: left; height: auto; min-height: 28px">
                <span
                  id="notes-area"
                  className="text-area notes-text-area print-font-size"
                  style="font-family: 'HelveticaNeueLTStd55Roman'; padding: 3px; display: block;"
                >
                  
                </span>
              </div>
            </div>`
          );
        } else if (comp.type === "Wrapper") {
          Components.push(
            returnComponent(
              { ...comp, id: `${page.textAreaId}` },
              { page: `page_${pageCounter}`, index }
            )
          );
          // const temp = document.querySelector(".tablebody-container");
          // // console.log(temp);
          // if (temp) {
          //   temp.style.fontSize = "0.7em";
          //   console.log(temp);
          // }
          count++;
        } else {
          if (comp.id !== "Box_Note") {
            Components.push(
              returnComponent(comp, { page: `page_${pageCounter}` })
            );
          }
          // console.log(comp.pageData.type);

          count++;
        }

        if (count < 2 && comp.type !== "Notes" && comp.id !== "Box_Note") {
          Components.push(
            `<div className="page-break" id={${comp.type}_${count}} key={page_${pageCounter}_${i}_${index}} />`
          );
          // pageCounter++;

          count = 0;
        } else if (count < 2 && comp.type === "Notes") {
          printEnd = i;
          console.log(`{page_${pageCounter}_${i}_${index}}`);
        }
      }
    });

    addWaterMark(pageCounter, i);

    pageCounter++;
  });

  return (
    <div
      aria-hidden="true"
      className={`print-container zoomIndex_${zoomIndex}`}
      style={{ margin: "0", padding: "0" }}
      ref={ref}
    >
      <div className="page-1">
        <div className="title-container">
          <label className="title-label">
            {Parser(courseData.courseTitle)}
          </label>
        </div>
        <div className="user-container">
          <label className="user-name-label">
            {Parser(courseData.labNotebookData.printLayoutData.userLabel)}
          </label>
          <label className="user-name-value">{Parser(userName)}</label>
        </div>
        <div className="date-time-info">
          <label className="date-time-label">
            {Parser(courseData.labNotebookData.printLayoutData.dateTimeLabel)}
          </label>
          <label className="date-time-value">
            {Parser(
              new Intl.DateTimeFormat(
                courseData.labNotebookData.printLayoutData.dateTimeLocale,
                {
                  dateStyle: "full",
                  timeStyle: "long",
                }
              ).format(new Date())
            )}
          </label>
        </div>
        {/* <img draggable={false} className="logo-watermark" alt={logoWaterMark} src={logoWaterMark} /> */}
        <div className="page-break" key="user-info" />
      </div>
      {Components.map((content, i) =>
        typeof content === "string" ? (
          Parser(content)
        ) : (
          <div key={`content_${i}`}>{content}</div>
        )
      )}
    </div>
  );
});

export default ComponentToPrint;
