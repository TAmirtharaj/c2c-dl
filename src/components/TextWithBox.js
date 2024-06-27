import React from "react";
import Parser from "html-react-parser";
import "./TextWithBox.css";

const TextWithBox = (props) => {
  return (
    <div
      className={`box-text-comp-wrapper ${
        props.classList ? props.classList : ""
      }`}
    >
      {props.pageData.title && (
        <div className="box-text-comp-heading bodyHeading">
          {Parser(props.pageData.title)}
        </div>
      )}

      {props.pageData.subTitle && (
        <div className="box-text-comp-subHeading bodyPara">
          {Parser(props.pageData.subTitle)}
        </div>
      )}

      <div
        className="box-text-comp-rounded-box bodyRoundedBox"
        style={
          props.pageData.id && props.pageData.id == "Box_Note"
            ? { marginBottom: "-5px", marginTop: "23px" }
            : {}
        }
      >
        <div className="box-text-comp-text-para bodyPara">
          {Parser(props.pageData.text)}
        </div>
      </div>
    </div>
  );
};

export default TextWithBox;
