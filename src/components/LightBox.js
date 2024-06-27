/** @format */

import React from "react";
import "./LightBox.css";
import { connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import "bootstrap/dist/css/bootstrap.min.css";
import LightBoxCloseBtn from "./LightBoxCloseBtn";
import LightBoxContent from "./LightBoxContent";
import { storeLabNotebookPagesDataToScorm } from "../helper/Helper";
import FocusLock from "react-focus-lock";

const LightBox = (props) => {
  const hasLabNotebookSubmitted = props.hasLabNotebookSubmitted;

  //hide lightbox
  const hideLightBox = (page = 0) => {
    console.log("light box close button called");
    setTimeout(() => {
      console.log(props.data.refs);
      if (props.data.type === "Image" || props.data.type === "Video" || props.data.type === "DataTable") {
        if (props.data.refs && props.data.refs.current && props.data.refs.current.focus) {
          //focus
          console.log(props.data.refs.current);
          props.data.refs.current.focus()
        } else {
          if (props.data.refs && props.data.refs.focus) {
            //focus
            console.log(props.data.refs);
            props.data.refs.focus()
          }
        }
      } else {
        if (props.data.refs && props.data.refs.focus) {
          //focus
          console.log(props.data.refs);
          props.data.refs.focus()
        }
      }
      // if(props.data.refs) {
      //   if(props.data.refs.current) {
      //     console.log(props.data.refs.current);
      //     props.data.refs.current.focus()
      //   } else {
      //     console.log(props.data.refs);
      //     props.data.refs.focus()
      //   }
      // }
    }, 100);
    props.updateShowLightBoxBool(false);
    props.updateLightBoxData(undefined);
    if (props.data.type === "LabNoteBook")
      storeLabNotebookPagesDataToScorm(
        props.sco,
        hasLabNotebookSubmitted,
        page
      );
  };
  return props.showLightBox ? (
    <FocusLock>
      <div className='lightbox-container'>
        <div className='lightbox-backdrop'></div>
        <div
          className={`${props?.data?.type === "CompletionBox"
            ? "completion-lightbox"
            : "lightbox"
            }`}
        >
          {
            props.data ?
              <LightBoxContent
                maxWidth={props.data.maxWidth}
                scrollImg={props.data.scrollImg}
                type={props.data.type}
                data={props.data}
                labNoteBookFlag={props.labNoteBookFlag}
                altText={props.data.altText ? props.data.altText : ""}
                onClose={hideLightBox}
              />
              : null}
          <LightBoxCloseBtn onClose={hideLightBox} />
        </div>
      </div>
    </FocusLock>
  ) : (
    ""
  );
};

const mapStateToProps = (state) => {
  return {
    showLightBox: state.showLightBox,
    hasLabNotebookSubmitted: state.hasLabNotebookSubmitted,
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

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(LightBox)
);
