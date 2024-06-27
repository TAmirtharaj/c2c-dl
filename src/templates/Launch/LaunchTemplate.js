/** @format */

import React, { useEffect, useLayoutEffect } from "react";
import "./LaunchTemplate.css";
import { imagePath } from "../../helper/Helper";
import { connect } from "react-redux";

const LaunchTemplate = (props) => {
  const logoURL = imagePath(
    props.templateData && props.templateData.pageData.images.logo
  );

  useEffect(() => {
    // fetchImages().then((data) => {
    //   console.log(data);
    //   setImages(data);
    // });
  }, []);

  //
  document.title = props.templateData && props.templateData.pageData.titleName2;
  useLayoutEffect(() => {
    // console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });

  let seqArray = [0, 1, 2, 3];
  if (props.templateData.pageData.titleSeq) {
    seqArray = props.templateData.pageData.titleSeq;
  }
  let ElementArray = [];
  seqArray.forEach((element, index) => {
    switch (element) {
      case 0:
        ElementArray.push(
          <div className='launch-page-inst0'>
            {props.templateData.pageData.images.logo && (
              <img
                draggable={false}
                src={logoURL}
                className='launch-page-logo'
                alt={`${props.templateData.pageData.titleName0} logo`}
              ></img>
            )}
            <div role='heading' aria-level='1'>
              {props.templateData && props.templateData.pageData.titleName0}
            </div>
          </div>
        );
        break;

      case 1:
        ElementArray.push(
          <div role='heading' aria-level='2' className='launch-page-inst1'>
            {props.templateData && props.templateData.pageData.titleName1}
          </div>
        );
        break;
      case 2:
        ElementArray.push(
          <div role='heading' aria-level={props.templateData && props.templateData.pageData.titleName1?'3':'2'} className='launch-page-inst2'>
            {props.templateData && props.templateData.pageData.titleName2}
          </div>
        );
        break;
      case 3:
        ElementArray.push(
          <div className='launch-page-inst3'>
            {props.templateData && props.templateData.pageData.titleName3}
          </div>
        );
        break;
    }
  });

  return (
    <div>
      <div className='launch-content-holder'>{ElementArray}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateHideNavigationBool: (data) =>
      dispatch({ type: "UPDATE_HIDE_NAVIGATION_BOOL", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LaunchTemplate);
