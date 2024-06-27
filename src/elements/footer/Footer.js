import React from "react";
import ReactDOM from "react-dom";
import "./Footer.css";
import BackButton from "../../components/BackButton";
import PageCounter from "../../components/PageCounter";
import NextButton from "../../components/NextButton";
import { connect, useSelector } from "react-redux";
import { BrowserDetect, imagePath } from "../../helper/Helper";

const Footer = (props) => {
  const logoURL = imagePath(props.data && props.data.footerData.images.logo);
  const imageLoaderBool = useSelector((state) => state.imageLoaderBool);
  return (
    <footer
      className='footerHolder'
      tabIndex='-1'
      aria-hidden={props.showLightBox ? true : false}
    >
      <img
        draggable={false}
        src={logoURL}
        className='footer-page-logo'
        alt='Carolina Distance Learning logo'
      ></img>
      {BrowserDetect.isMobile() ? (
        <div />
      ) : (
        <div className='footer-page-title'>{props.data.courseTitle}</div>
      )}
      <div
        className={`nav-panel-holder ${
          imageLoaderBool ? "footer-disable" : ""
        }`}
      >
        <BackButton data={props.data} />
        <PageCounter data={props.data} />
        <NextButton data={props.data} />
      </div>
    </footer>
  );
};

const mapStateToProps = (state) => {
  return {
    showLightBox: state.showLightBox,
  };
};

export default connect(mapStateToProps, null)(Footer);
