import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Parser from "html-react-parser";
import "./InfoPopUp.css";
import { imagePath } from "../helper/Helper";

const InfoPopUp = (props) => {
  let classList = `infoPopUpWrapper ${props.type}-popUp`;
  // console.log(props.data[props.type], props.data,props.type)
  let content = props.data[props.type];
  return (
    <React.Fragment>
      <div className="popUpWrapperArrow" />
      <div className={classList}>
        <div className="infoPopUpBackground">
          <div className="infoPopUpContent">
            {Parser(content.text)}
            {content.hasOwnProperty("src") && (
              <span>
                <img draggable={false} src={imagePath(content.src)} />
              </span>
            )}
          </div>
        </div>
        <div className="backgroundArrow" />
      </div>
    </React.Fragment>
  );
};

export default InfoPopUp;
