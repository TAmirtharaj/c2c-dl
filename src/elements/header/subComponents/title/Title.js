import React from "react";
import "./Title.css";
import { imagePath } from "../../../../helper/Helper";
import { BrowserDetect } from "../../../../helper/Helper";

import { connect } from "react-redux";

const Title = (props) => {
  const separatorURL = imagePath(
    props.data && props.data.headerData.images.separatorImage
  );

  const isTileSubTitleSame = props.data.pages[props.currentSection].title === props.data.pages[props.currentSection].pages[props.currentScene].title
  //console.log(props)
  return (
    <nav className="Title-container" aria-label="breadcrumbs">
      {BrowserDetect.isMobile() ? (
        props.showMenuBool ? (
          <div className="subTitle floatLeft">
            {
              props.data.pages[props.currentSection].pages[props.currentScene]
                .title
            }
          </div>
        ) : (
          false
        )
      ) : (
        <div>
          <div className={isTileSubTitleSame ? "mainTitle floatLeft boldTitle" : "mainTitle floatLeft" }>
            {props.data.pages[props.currentSection].title}
          </div>
          {!isTileSubTitleSame ? (
            <React.Fragment>
              <img draggable={false} src={separatorURL} className="separator floatLeft"></img>
              <div className="subTitle floatLeft">
                {
                  props.data.pages[props.currentSection].pages[
                    props.currentScene
                  ].title
                }
              </div>
            </React.Fragment>
          ) : (
            false
          )}
        </div>
      )}
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    currentSection: state.currentSection,
    currentScene: state.currentScene,
    currentSubScene: state.currentSubScene,
    showMenuBool: state.showMenuBool,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSection: (data) =>
      dispatch({ type: "UPDATE_SECTION", payload: data }),
    updateScene: (data) => dispatch({ type: "UPDATE_SCENE", payload: data }),
    updateSubScene: (data) =>
      dispatch({ type: "UPDATE_SUB_SCENE", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Title);
