import React from "react";
import "./RealWorldConnection.css";
import { returnComponent } from "../../createComponent/CreateComponent";
import { connect } from "react-redux";
import { useLayoutEffect } from "react";
const RealWorldConnection = (props) => {
  const Components = [];
  props.templateData.pageData.forEach((data) => {
    Components.push(returnComponent(data));
  });

  useLayoutEffect(() => {
    console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });
  return (
    <div className='container-padding real-world-connection-comp-container'>
      {Components}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealWorldConnection);
