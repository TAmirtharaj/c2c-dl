/** @format */

import React, { useEffect, useState } from "react";
import Parser from "html-react-parser";
import "./Tabs.css";

import {
  BrowserDetect,
  getCommonWindowObj,
  setCommonWindowObj,
  getTabScroll,
  setScroll,
  setTabScroll,
} from "../helper/Helper";
import { Accordion } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomButton from "./CustomButton";

const Tabs = (props) => {
  const screenId = props.pageData.sr ? props.pageData.sr : 0;
  // console.log("here one", window.storeClickedTabsOfMaterialSc);
  const [hoveFlag, setHoverFlag] = useState(-1);
  const isMobileDevice = BrowserDetect.isMobile();
  const selectedTab = useSelector((state) => state.materialScreenSelectedTab);
  // console.log(isMobileDevice, "----------- isMobileDevice -----------");
  const previouslySelectedTab = isMobileDevice
    ? []
    : [props.materialScreenSelectedTab];

  const [storeClickedTabs, setStoreClickedTabs] = useState(
    previouslySelectedTab
  );

  // window.storeClickedTabsOfMaterialSc[screenId].push(...storeClickedTabs);

  let windowObj = getCommonWindowObj();
  windowObj.storeClickedTabsOfMaterialSc[screenId].push(...storeClickedTabs);
  setCommonWindowObj(windowObj);

  useEffect(() => {
    const scrollValue = getTabScroll();
    const tabContainer = document.querySelector(".tab-content");
    // console.log("scroll value recieved", getTabScroll(), tabContainer);

    setTimeout(() => {
      if (tabContainer && scrollValue !== 0) {
        tabContainer.scrollTop = scrollValue;
      }
    }, 10);
  });

  const storeTabDataToScorm = () => {
    if (props.sco.apiConnected) {
      props.sco.setSuspendData(
        `tabVisitedArray_${screenId}`,
        windowObj.storeClickedTabsOfMaterialSc[screenId]
      );
    }
  };

  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    const suspendData = scromData
      ? scromData[`tabVisitedArray_${screenId}`]
      : [];
    console.log("tabs data scorm-------->:", scromData);
    if (suspendData) {
      // window.storeClickedTabsOfMaterialSc[screenId] = suspendData;

      windowObj = getCommonWindowObj();
      windowObj.storeClickedTabsOfMaterialSc[screenId] = suspendData;
      setCommonWindowObj(windowObj);
      console.log("tabs data -------->:", suspendData);
      // setStoreClickedTabs(windowObj.storeClickedTabsOfMaterialSc[screenId])
    }
  }

  const onClickTabItem = (tab, index) => {
    console.log("index on click", index);
    props.updateMaterialScreenSelectedTab(tab);

    windowObj = getCommonWindowObj();
    windowObj.storeClickedTabsOfMaterialSc[screenId].push(tab);
    setCommonWindowObj(windowObj);

    storeTabDataToScorm();

    setStoreClickedTabs((prevTabs) => {
      return [...prevTabs, tab];
    });

    // window.storeClickedTabsOfMaterialSc[screenId].push(...storeClickedTabs);

    setShowToolTip(false);
  };

  // useEffect(() => {
  //   return () => {
  //     props.updateMaterialScreenSelectedTab(0);
  //   };
  // }, []);

  useEffect(() => {
    // console.log("stored click tabs updated:", storeClickedTabs);
  }, [storeClickedTabs]);

  const [orientation, setOrientation] = useState(
    BrowserDetect.getOrientation().orientation
  );

  const allTabsClicked =
    [...new Set(getCommonWindowObj().storeClickedTabsOfMaterialSc[screenId])]
      .length === props.children.length;

  //update visited array for each tab
  const clickedArray = new Set(
    getCommonWindowObj().storeClickedTabsOfMaterialSc[screenId]
  );
  clickedArray.forEach((item) => {
    props.visitedArray[props.currentSection][props.currentScene][item] = 2;
  });

  if (allTabsClicked) {
    props.updateNextClicked(false);
  }

  useEffect(() => {
    const toolTip = document.querySelector(".toolTipTitle");
    const toolTipContainer = document.querySelector(".tab-container");
    if (toolTip && toolTipContainer) {
      if (
        toolTip.getBoundingClientRect().right >=
        toolTipContainer.getBoundingClientRect().right
      ) {
        toolTip.style.right = "0";
      }
    }
  });
  useEffect(() => {
    props.updateNextClicked(true);
    if (allTabsClicked) {
      props.updateNextClicked(false);
    }
    if (document.querySelector(".wrapper-container")) {
      document
        .querySelector(".wrapper-container")
        .classList.add("wrapper-container-tab");
    }
    const resizeListener = () => {
      // change width from the state object
      windowObj = getCommonWindowObj();
      const orientation =
        windowObj.innerWidth > windowObj.innerHeight ? "L" : "P";
      // console.log(orientation, "-- resizeListener --");
      setOrientation(orientation);
    };
    // set resize listener

    window.addEventListener("resize", resizeListener);
    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const detectTab = BrowserDetect.getOrientation();
  const classList1 =
    detectTab.type === "T"
      ? orientation === "P"
        ? "tabPortrait-tab-comp-list-item-width"
        : "tabLandscape-tab-comp-list-item-width"
      : "tab-comp-list-item-width";

  const classList2 =
    detectTab.type === "T"
      ? orientation === "P"
        ? "tabPortrait-tab-comp-tab-content "
        : "tabLandscape-tab-comp-tab-content"
      : "tab-comp-tab-content";

  // console.log(allTabsClicked, storeClickedTabs, "---allTabsClicked--");

  windowObj = getCommonWindowObj();
  windowObj.toolTipFlag = new Array(props.pageData.tabs.length).fill(false);
  setCommonWindowObj(windowObj);
  const [showTooltip, setShowToolTip] = useState(windowObj.toolTipFlag);

  let toolTipFlag = new Array(3).fill(false);
  const mouseOver = (index) => {
    calcScroll();
    toolTipFlag.fill(false);
    toolTipFlag[index] = true;
    setShowToolTip(toolTipFlag);
    setHoverFlag(index);
  };

  const mouseOut = () => {
    toolTipFlag.fill(false);
    setShowToolTip(toolTipFlag);
    setHoverFlag(-1);
  };
  const touchStart = (index) => {
    // console.log("touchStart?");
    toolTipFlag.fill(false);
    toolTipFlag[index] = true;
    setShowToolTip(toolTipFlag);
  };
  const touchEnd = () => {
    toolTipFlag.fill(false);
    setShowToolTip(toolTipFlag);
  };

  const calcScroll = () => {
    const tabContainer = document.querySelector(".tab-content");
    if (tabContainer) {
      if (tabContainer.scrollTop) {
        setTabScroll(tabContainer.scrollTop);
      }
    }
  };
  const tabContainerClick = (e) => [calcScroll()];

  const header = document.querySelector(".bgHeaderBand");
  if (header) {
    header.addEventListener("click", () => {
      calcScroll();
    });
  }
  const zoomButton1 = document.querySelector("#circle_2");
  if (zoomButton1) {
    zoomButton1.addEventListener("click", () => {
      calcScroll();
    });
  }

  const zoomButton2 = document.querySelector("#circle_3");
  if (zoomButton2) {
    zoomButton2.addEventListener("click", () => {
      calcScroll();
    });
  }

  // console.log("props children:", props.children);

  const onClickMobile = (tab) => {
    windowObj = getCommonWindowObj();
    windowObj.storeClickedTabsOfMaterialSc[screenId].push(tab);
    setCommonWindowObj(windowObj);

    storeTabDataToScorm();
    props.updateMaterialScreenSelectedTab(tab);

    if (props.materialScreenSelectedTab === tab)
      props.updateMaterialScreenSelectedTab(-1);
  };

  // console.log("last selected tab:", selectedTab);
  return isMobileDevice ? (
    // <Accordion className='tab-comp-wrapper'>
    <Accordion
      defaultActiveKey={selectedTab !== -1 ? selectedTab : null}
      className='tab-comp-wrapper'
    >
      {props.children.map((child, index) => {
        const { label } = child.props;
        return (
          <Accordion.Item eventKey={index} className='accordionItem'>
            <Accordion.Header
              // onClick={onClickTabItem.bind(this, index)}
              onClick={onClickMobile.bind(this, index)}
              key={label}
              tabIndex='0'
              aria-label={label}
              aria-hidden='false'
            >
              {Parser(label)}
            </Accordion.Header>

            <Accordion.Body className='accordionItemBody'>
              {child.props.children}
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  ) : (
    <div className='tab-container'>
      <nav>
        <div className='nav nav-tabs tab-comp-list' id='nav-tab' role='tablist'>
          {props.children.map((child, index) => {
            const { label } = child.props;
            return (
              // <CustomButton
              //   className={`nav-item tab-comp-list-item ${classList1} bodyMediumSubHeading${
              //     props.materialScreenSelectedTab === index
              //       ? " tab-comp-list-active"
              //       : ""
              //   }`}
              //   onClick={onClickTabItem.bind(this, index)}
              //   key={label}
              //   id={Parser(label)}
              //   title={Parser(label)}
              //   tabIndex="0"
              //   ariaLabel={label}
              //   ariaHidden="false"
              // />
              <div
                className='tab-button-wrapper'
                style={{
                  width: `calc((100% - ${
                    2 * (props.children.length - 1)
                  }px) / ${props.children.length})`,
                }}                  onMouseOut={mouseOut}                  onTouchEnd={touchEnd}


              >
                <button
                  type='button'
                  className={`nav-item tab-comp-list-item ${classList1} bodyMediumSubHeading${
                    props.materialScreenSelectedTab === index
                      ? " tab-comp-list-active"
                      : ""
                  }`}
                  disabled={
                    props.materialScreenSelectedTab === index ? true : false
                  }
                  onClick={onClickTabItem.bind(this, index)}
                  key={label}
                  id={Parser(label)}
                  tabIndex='0'
                  aria-label={label}
                  aria-hidden='false'
                  onMouseOver={mouseOver.bind(this, index)}
                  onTouchStart={touchStart.bind(this, index)}
                  // style={{
                  //   width: `calc((100% - ${
                  //     2 * (props.children.length - 1)
                  //   }px) / ${props.children.length})`,
                  // }}
                >
                  {Parser(label)}
                  {showTooltip[index] && !BrowserDetect.isDevice() && (
                    <div className='tooltip-holder'>
                      <span className='toolTipTitle bodyMediumSubHeading'>
                        {Parser(label)}
                      </span>
                      <span className='toolTip bodyMediumSubHeading'>
                        {/* {Parser(label)} */}
                      </span>
                    </div>
                  )}
                </button>
                <div
                  className='tab-button-white-patch'
                  style={{
                    display:
                      props.materialScreenSelectedTab === index ||
                      hoveFlag === index
                        ? ""
                        : "none",
                    width: `calc((100% - ${
                      8 *
                        (props.children.length !== 1
                          ? props.children.length - 1
                          : props.children.length + 1) +
                      2
                    }px) / ${props.children.length})`,
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </nav>
      <div
        className={`tab-content ${classList2} customScrollbar`}
        id='nav-tabContent'
        onScroll={() => {
          calcScroll();
        }}
        onClick={tabContainerClick}
      >
        {props.children.map((child, contentIndex) => {
          if (contentIndex !== props.materialScreenSelectedTab)
            return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
  // }
};

const mapStateToProps = (state) => {
  return {
    materialScreenSelectedTab: state.materialScreenSelectedTab,
    currentSection: state.currentSection,
    currentScene: state.currentScene,
    visitedArray: state.visitedArray,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMaterialScreenSelectedTab: (data) =>
      dispatch({ type: "UPDATE_MATERIAL_SCREEN_SELECTED_TAB", payload: data }),

    updateNextClicked: (data) =>
      dispatch({
        type: "UPDATE_NEXT_DISABLE_BOOL",
        payload: data,
      }),
  };
};

export default withScorm()(connect(mapStateToProps, mapDispatchToProps)(Tabs));
