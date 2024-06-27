/** @format */

import React from "react";
import Parser from "html-react-parser";
import "./List.css";
import { imagePath } from "../helper/Helper";
import { returnComponent } from "../createComponent/CreateComponent";

const List = (props) => {
  // document.querySelector(`.${props.pageData.title}`).style.textAlign = "center";
  /*Align the title to center if it is in lab notebook*/
  // console.log(props);
  const isInLab = props.pageData.alignTitle === "center" ? true : false;
  return (
    <div
      className={
        props.pageData.containerType === "rightContainer"
          ? "list-comp-wrapper-right"
          : "list-comp-wrapper-left"
      }
    >
      {props.pageData.title && (
        <div
          role="heading" aria-level="1" className={`list-comp-heading bodyHeading ${
            isInLab ? "list-comp-heading-lab" : ""
          } ${props.pageData.title}`}
        >
          {Parser(props.pageData.title)}
        </div>
      )}
      <div
        className={`${
          props.classList ? props.classList : ""
        } list-comp-group-list-item`}
      >
        {props.pageData.listType === "ordered" ? (
          <ol
            className="list-comp-ordered-list"
            style={
              props.pageData.hideTextNumber
                ? { listStyleType: "none", ...props.pageData.style }
                : { ...props.pageData.style }
            }
            start={props.pageData.start ? props.pageData.start : "1"}
          >
            {props.pageData.text.map((item, index) => {
              return (
                <li className="list-comp-list-item bodyPara" key={index}>
                  {Parser(item)}
                  <ol
                    style={
                      props.pageData.hideOrderedTextNumber
                        ? { listStyleType: "none" }
                        : {}
                    }
                    start={
                      props.pageData.orderedStart
                        ? props.pageData.orderedStart
                        : "1"
                    }
                    type={
                      props.pageData.orderedType
                        ? props.pageData.orderedType
                        : "a"
                    }
                    className="list-comp-unorder-list"
                  >
                    {props.pageData.nestedOrderList &&
                      props.pageData.nestedOrderList.map((item1, index1) => {
                        return (
                          <li className="list-comp-list-item" key={index1}>
                            {Parser(item1)}
                          </li>
                        );
                      })}
                  </ol>
                </li>
              );
            })}
          </ol>
        ) : (
          <ul
            className="list-comp-unorder-list"
            style={props.pageData.style ? props.pageData.style : {}}
          >
            {props.pageData.text.map((item, index) => {
              // console.log("at type", typeof item);
              return typeof item === "string" ? (
                <li className="list-comp-list-item bodyPara" key={index}>
                  {Parser(item)}
                </li>
              ) : (
                <li className="list-comp-list-item bodyPara" key={index}>
                  {returnComponent(item)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {props.pageData.image && (
        <div className="list-comp-image">
          <img
            draggable={false}
            src={imagePath(props.pageData.image)}
            style={{ width: "100%", marginBottom: "20px" }}
            alt={`image, ${props.pageData.image.split("/")[1]}`}
          />
        </div>
      )}
    </div>
  );
};

export default List;
