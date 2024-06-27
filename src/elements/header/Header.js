/** @format */

import React from "react";
// import ReactDOM from "react-dom";
import "./Header.css";

import Menu from "./subComponents/menu/Menu";
import Title from "./subComponents/title/Title";
import Exit from "./subComponents/exit/Exit";
import Resources from "./subComponents/resources/Resources";
import Help from "./subComponents/help/Help";
import ContentZoom from "./subComponents/ContentZoom/ContentZoom";
import LabNoteBook from "./subComponents/labNoteBook/LabNoteBook";
// import MenuHolder from "../menuHolder/MenuHolder";
import { BrowserDetect } from "../../helper/Helper";

import { connect, useSelector } from "react-redux";
import Glossary from "./subComponents/glossary/Glossary";

const Header = (props) => {
  const imageLoaderBool = useSelector((state) => state.imageLoaderBool);
  return (
    <div
      id="save-placeholder"
      className="headerHolder"
      tabIndex="-1"
      aria-hidden={props.showLightBox ? true : false}
    >
      <header
        className={`bgHeaderBand ${imageLoaderBool ? "header-disable" : ""}`}
      >
        <Menu data={props.data} />
        {BrowserDetect.isMobile() ? (
          props.showMenuBool ? (
            <Title data={props.data} />
          ) : (
            <div className="rightHeaderButtons">
              <LabNoteBook visible={props.data.labNoteBookFlag} />
              <div className="labNoteBookSeperator" />
              {/* <Help data={props.data} /> */}
              <Glossary data={props.data} visible={props.data.glossaryFlag} />
              <Resources data={props.data} visible={props.data.resourcesFlag} />
              {/*<Exit data={props.data}/>**/}
            </div>
          )
        ) : (
          <React.Fragment>
            <Title data={props.data} />

            <div className="rightHeaderButtons">
              <LabNoteBook visible={props.data.labNoteBookFlag} />
              {props.data.labNoteBookFlag !== false ? (
                <div className="labNoteBookSeperator" />
              ) : (
                <></>
              )}
              <ContentZoom data={props.data}></ContentZoom>
              {/* <Help data={props.data} /> */}
              <Glossary data={props.data} visible={props.data.glossaryFlag} />
              <Resources data={props.data} visible={props.data.resourcesFlag} />
              <div className="space-end"></div>
              {/*<Exit data={props.data}/>**/}
            </div>
          </React.Fragment>
        )}
      </header>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    showMenuBool: state.showMenuBool,
    showLightBox: state.showLightBox,
  };
};

export default connect(mapStateToProps, null)(Header);
