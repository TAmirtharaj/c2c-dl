import React, { useLayoutEffect } from "react";
import "./Completion.css";
import { returnComponent } from "../../createComponent/CreateComponent";
import { useDispatch, connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import CustomButton from "../../components/CustomButton";
import {
  getZoomClassList,
  BrowserDetect,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../../helper/Helper";

const Completion = (props) => {
  let hasLabNotebookSubmitted;
  let centerZoomClass = "teamplate-full-container ";
  let leftZoomClass = "teamplate-left-container ";
  let rightZoomClass = "teamplate-right-container ";
  let windowObj = getCommonWindowObj();
  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    //const scromData = getSuspendData();
    const hasLabNotebookSubmittedFlag = scromData["hasLabNotebookSubmitted"];
    hasLabNotebookSubmitted = hasLabNotebookSubmittedFlag
      ? hasLabNotebookSubmittedFlag
      : false;
  } else {
    hasLabNotebookSubmitted = windowObj.hasLabNotebookSubmitted
      ? windowObj.hasLabNotebookSubmitted
      : false;
  }
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch({
      type: "UPDATE_LIGHT_BOX_DATA",
      payload: {
        type: "CompletionBox",
        info: props.templateData.pageData[0].confirmationMessage,
        labNoteBookFlag:
          props.labNoteBookFlag === false ? props.labNoteBookFlag : true,
      },
    });
    dispatch({
      type: "UPDATE_SHOW_LIGHT_BOX_BOOL",
      payload: true,
    });
    windowObj = getCommonWindowObj();
    windowObj.userName = windowObj.userName ? windowObj.userName : "Demo User";
    setCommonWindowObj(windowObj);
  };

  const Components = [];
  const Components1 = [];
  const Components2 = [];

  props.templateData.pageData.forEach((data) => {
    if (data.containerType === "fullContainer") {
      Components.push(returnComponent(data));
    } else if (data.containerType === "rightContainer") {
      Components2.push(returnComponent(data));
    } else {
      Components1.push(
        returnComponent(data, {
          onClick,
        })
      );
    }
  });

  if (!BrowserDetect.isMobile()) {
    centerZoomClass += getZoomClassList(props.zoomIndex, "center", "100");
    rightZoomClass += getZoomClassList(props.zoomIndex, "right");
    leftZoomClass += getZoomClassList(props.zoomIndex, "left");
  }

  useLayoutEffect(() => {
    console.log("template loaded successfully-------!!");
    props.updateHideNavigationBool(false);
  });

  return (
    <div className='container-padding completion-comp-container'>
      {Components.length !== 0 && (
        <div className={centerZoomClass}>{Components}</div>
      )}
      {Components1.length !== 0 && (
        <div className={leftZoomClass}>
          {Components1}

          {/* ↓ adding false here cause we are removing submit button  */}
          {false && !hasLabNotebookSubmitted && (
            <CustomButton
              title={props.labNoteBookFlag ? "Submit" : "Finish"}
              className='complete-submit-button'
              onClick={onClick}
            />
          )}
        </div>
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

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(Completion)
);
