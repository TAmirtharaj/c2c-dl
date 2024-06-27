import React, { useLayoutEffect } from "react";
import "./ExperimentalDesign.css";
import { connect } from "react-redux";
import { returnComponent } from "../../createComponent/CreateComponent";
import {
  triggerResize,
  getZoomClassList,
  BrowserDetect,
} from "../../helper/Helper";

const ExperimentalDesign = (props) => {
  const Components = [];
  const Components1 = [];
  const Components2 = [];

  let centerZoomClass = "teamplate-full-container ";
  let leftZoomClass = "teamplate-left-container ";
  let rightZoomClass = "teamplate-right-container ";

  props.templateData.pageData.forEach((data) => {
    if (data.containerType === "fullContainer") {
      Components.push(returnComponent(data));
    } else if (data.containerType === "rightContainer") {
      Components2.push(returnComponent(data));
    } else {
      Components1.push(returnComponent(data));
    }
  });

  if (!BrowserDetect.isMobile()) {
    centerZoomClass += getZoomClassList(props.zoomIndex, "center", "100");
    rightZoomClass += getZoomClassList(props.zoomIndex, "right");
    leftZoomClass += getZoomClassList(props.zoomIndex, "left");
  }

  useLayoutEffect(() => {
    function callResize() {
      setTimeout(() => {
        triggerResize();
      }, 100);
    }
    callResize();
  }, []);
  useLayoutEffect(() => {
    console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });

  return (
    <div className='container-padding experiment-design-comp-container'>
      {Components.length !== 0 && (
        <div className={centerZoomClass}>{Components}</div>
      )}
      {Components1.length !== 0 && (
        <div className={leftZoomClass}>{Components1}</div>
      )}
      {Components2.length !== 0 && (
        <div className={rightZoomClass}>{Components2}</div>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentalDesign);
// export default ExperimentalDesign;
