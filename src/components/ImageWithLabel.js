import { React, useRef , useEffect } from "react";
import Parser from "html-react-parser";
import { imagePath, BrowserDetect } from "../helper/Helper";
import "./ImageWithLabel.css";
import { connect } from "react-redux";
import { Card } from "react-bootstrap";

const ImageWithLabel = (props) => {
  let i=0;
  const image = imagePath(props.pageData.image);
  const altText = props.pageData.altText
    ? props.pageData.altText
    : props.pageData.label.replace(/<\/?[^>]+(>|$)/g, "");
  const isDevice = BrowserDetect.isMobile();
  //console.log(isDevice, "----------- isMobile -----------");
  let imageWithLabelRef = useRef(null);
  useEffect(() => {
    // windowObj = getCommonWindowObj();
    console.log('rendered------------>');
  }, []);
  
  const onClickHandler = () => {
    //  props.updateShowLightBoxBool(image);
    // const imlDiv = document.querySelector(`.${classList}`).firstChild.firstChild
    const imlDiv = document.getElementById(`${i?i:0}`).firstChild
    props.updateShowLightBoxBool(true);
    console.log(imlDiv);
    // console.log(classList);
    // console.log(document.getElementById(i));
    props.updateLightBoxData({
      type: "Image",
      altText: altText,
      // refs: imageWithLabelRef,
      refs: imlDiv,
      // refs: document.getElementById(i),
      url: image,
      maxWidth: props.pageData.maxWidth ? props.pageData.maxWidth : {},
    });
  };
  const onKeyDownHandler = (e) => {
    if(e.keyCode == 13 || e.keyCode == 32){
      //  props.updateShowLightBoxBool(image);
      // const imlDiv = document.querySelector(`.${classList}`).firstChild.firstChild
      const imlDiv = document.getElementById(`${i?i:0}`).firstChild
      props.updateShowLightBoxBool(true);
      console.log(imlDiv);
      // console.log(classList);
      // console.log(document.getElementById(i));
      props.updateLightBoxData({
        type: "Image",
        altText: altText,
        // refs: imageWithLabelRef,
        refs: imlDiv,
        // refs: document.getElementById(i),
        url: image,
        maxWidth: props.pageData.maxWidth ? props.pageData.maxWidth : {},
      });
    }
  }
  const classList = isDevice
    ? "img-with-label-comp-wrapper-for-mobile"
    : "img-with-label-comp-wrapper";

  return (
    <div 
    // tabindex="0"
    className={classList} 
    // ref={imageWithLabelRef}
    >
      <Card id={`${i}`} className="border-0">
        <Card.Img
          title={altText}
          draggable={false}
          className="img-with-label-comp-img"
          src={image}
          alt={`image, ${altText}`}
          tabIndex='0'
          onClick={onClickHandler}
          onKeyDown={onKeyDownHandler}
          ref={el => imageWithLabelRef = el}
        >
          {/* <img draggable={false} src={image} alt="img" onClick={onClickHandler} /> */}
        </Card.Img>

        <div className="img-with-label-text bodyPara">
          {Parser(props.pageData.label)}
        </div>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageWithLabel);
