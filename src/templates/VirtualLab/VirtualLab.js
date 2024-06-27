import React, { useLayoutEffect } from "react";
import "./VirtualLab.css";
import { triggerResize } from "../../helper/Helper";
import { connect } from "react-redux";
const VirtualLab = (props) => {
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
    <div className='container-padding key-comp-container'
    style={{paddingTop:"9px", paddingBottom:"2px"}}>
      <iframe
        style={{ width: "100%", height: "100%" }}
        title='labHolder'
        src={props.templateData.activityPath}
      />
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
export default connect(mapStateToProps, mapDispatchToProps)(VirtualLab);
