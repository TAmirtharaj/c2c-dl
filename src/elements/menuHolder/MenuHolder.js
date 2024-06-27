/** @format */

import React, { useState } from "react";
// import { Scrollbars } from 'react-custom-scrollbars';

import { withScorm } from "react-scorm-provider-v2";
import "./MenuHolder.css";
import MainTitle from "./mainTitle/MainTitle";
import {
  BrowserDetect,
  updateScormData,
  triggerResize,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../../helper/Helper";
import { connect } from "react-redux";

const MenuHolder = (props) => {
  const [subMenuBool, setSubMenuBool] = useState(false);
  const [subMenuId, setSubMenuId] = useState(0);
  const [subSubMenuBool, setSubSubMenuBool] = useState(false);
  const [subSubMenuId, setSubSubMenuId] = useState(0);
  // const [subSubSubMenuId, setSubSubSubMenuId] = useState(0);
  // if(props.showMenuBool) {
  //     setSubMenuBool(false);
  //     setSubSubMenuBool(false);
  // }
  const titleclickhandler = (id, type) => {
    let windowObj = getCommonWindowObj();
    setSubMenuBool(false);
    setSubSubMenuBool(false);
    switch (type) {
      case "mainTitle":
        setSubMenuId(id);
        setSubMenuBool(true);
        if (
          props.data[id].hasOwnProperty("pages") &&
          props.data[id].pages.length > 1
        ) {
          if (id === subMenuId) setSubMenuBool(!subMenuBool);
          else setSubMenuId(id);
        } else {
          updateScene(id, 0, 0);
        }
        break;
      case "subTitle":
        // console.log("here in side title", props.data[subMenuId].pages[id + 1]);
        if (
          props.data[subMenuId] &&
          props.data[subMenuId].pages[id + 1] &&
          props.data[subMenuId].pages[id + 1].title
        ) {
          windowObj.isNextPagePrelab =
            props.data[subMenuId].pages[id + 1].title ===
              "Pre-Lab Assessment" ||
            props.data[subMenuId].pages[id + 1].title === "Safety Assessment";

          setCommonWindowObj(windowObj);
        }
        setSubMenuBool(true);
        setSubSubMenuId(id);
        if (
          props.data[subMenuId].pages[id].hasOwnProperty("pages") &&
          props.data[subMenuId].pages[id].pages.length > 1
        ) {
          if (id === subSubMenuId) {
            setSubSubMenuBool(!subSubMenuBool);
          } else {
            setSubSubMenuBool(true);
          }
        } else {
          updateScene(subMenuId, id, 0);
        }
        break;
      case "subSubTitle":
        // setSubSubSubMenuId(id);
        updateScene(subMenuId, subSubMenuId, id);
        break;
      default:
        break;
    }
    triggerResize();
  };

  const updateScene = (sectionId, sceneId, subSceneId) => {
    // console.log("updateScene in MenuHolder", props.visitedArray);
    updateScormData(
      props.sco,
      sectionId,
      sceneId,
      subSceneId,
      props.visitedArray
    );
    props.updateSection(sectionId);
    props.updateScene(sceneId);
    props.updateSubScene(subSceneId);
    setSubMenuBool(false);
    setSubMenuId(0);
    setSubSubMenuBool(false);
    setSubSubMenuId(0);
    props.updateMenuBool(false);
    // setSubSubSubMenuId(0)
  };

  if (props.showLightBox && props.showMenuBool) {
    props.updateShowLightBoxBool(false);
  }

  return props.showMenuBool ? (
    <div className='menuHolder'>
      <div
        className='mainTitleHolder customScrollbar'
        style={
          BrowserDetect.isMobile()
            ? Object.assign({ height: `${props.height - 4}px` })
            : Object.assign({ height: `${props.height - 4}px` })
        }
      >
        {props.data.map((section, index) => {
          return section.isHidden ? (
            false
          ) : (
            <div
              className='sectionSceneWrapper'
              key={"section_" + index}
              id={"section_" + index}
            >
              <MainTitle
                data={section}
                id={index}
                currentPageBool={props.currentSection === index}
                clickedState={subMenuBool && subMenuId === index}
                type='mainTitle'
                clickHandler={titleclickhandler}
              />
              {subMenuBool && subMenuId === index ? (
                <div className='subMenuHolder'>
                  {props.data[subMenuId].pages.map((scene, sceneIndex) => {
                    return scene.isHidden ? (
                      false
                    ) : (
                      <div
                        className='sceneSubSceneWrapper'
                        key={"scene_" + sceneIndex}
                      >
                        <MainTitle
                          data={scene}
                          mainID={subMenuId}
                          id={sceneIndex}
                          currentPageBool={
                            props.currentSection === index &&
                            props.currentScene === sceneIndex
                          }
                          clickedState={
                            subMenuBool &&
                            subMenuId === index &&
                            subSubMenuBool &&
                            subSubMenuId === sceneIndex
                          }
                          type='subTitle'
                          clickHandler={titleclickhandler}
                        />
                        {subSubMenuBool && subSubMenuId === sceneIndex ? (
                          <div className='subSubMenuHolder'>
                            {props.data[subMenuId].pages[
                              subSubMenuId
                            ].pages.map((subScene, subSceneIndex) => {
                              return subScene.isHidden ? (
                                false
                              ) : (
                                <MainTitle
                                  data={subScene}
                                  mainID={subMenuId}
                                  subMenuID={subSubMenuId}
                                  id={subSceneIndex}
                                  key={"subScene_" + subSceneIndex}
                                  currentPageBool={
                                    props.currentSection === index &&
                                    props.currentScene === sceneIndex &&
                                    props.currentSubScene === subSceneIndex
                                  }
                                  type='subSubTitle'
                                  clickHandler={titleclickhandler}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          false
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                false
              )}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    false
  );
};

const mapStateToProps = (state) => {
  return {
    showMenuBool: state.showMenuBool,
    currentSection: state.currentSection,
    currentScene: state.currentScene,
    currentSubScene: state.currentSubScene,
    showLightBox: state.showLightBox,
    visitedArray: state.visitedArray,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMenuBool: (data) =>
      dispatch({ type: "UPDATE_MENU_BOOL", payload: data }),
    updateSection: (data) =>
      dispatch({ type: "UPDATE_SECTION", payload: data }),
    updateScene: (data) => dispatch({ type: "UPDATE_SCENE", payload: data }),
    updateSubScene: (data) =>
      dispatch({ type: "UPDATE_SUB_SCENE", payload: data }),
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(MenuHolder)
);
