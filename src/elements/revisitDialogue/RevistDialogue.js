import React from "react";
import { withScorm } from "react-scorm-provider-v2";

import "./RevistDialogue.css";

import { getCommonWindowObj, imagePath } from "../../helper/Helper";

import CustomButton from "../../components/CustomButton";

const RevistDialogue = (props) => {
  const launchURL = imagePath(
    props.data && props.data.launchData.images.launchPage
  );
  const logoURL = imagePath(props.data && props.data.launchData.images.logo);

  const obj = {};

  const logoStyle = {
    position: "relative",
    marginLeft: "44px",
    width: "148px",
  };
  let dpr;
  if (window.devicePixelRatio !== undefined) {
    dpr = window.devicePixelRatio;
  } else {
    dpr = 1;
  }

  return (
    <div className='launchHolder'>
      <div
        className='bgLaunchHolder'
        style={Object.assign({}, { backgroundImage: `url(${launchURL})` })}
      >
        <div className='launch-content-holder'>
          <img
            draggable={false}
            src={logoURL}
            className='launch-page-logo'
            alt='logo'
          ></img>
          <div className='launch-page-inst1'>
            {props.data && props.data.launchData.titleName1}
          </div>
          <div className='launch-page-inst2'>
            {props.data && props.data.launchData.titleName2}
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "50px",
              float: "left",
            }}
          >
            {!getCommonWindowObj().courseRevisit ? (
              <CustomButton
                id='launch'
                title={props.data && props.data.launchData.buttonName}
                className='launch-button'
                onClick={props.clickHandler}
                type='launchButton'
              ></CustomButton>
            ) : (
              <div>
                <CustomButton
                  id='resume'
                  title={props.data && props.data.resumeData.buttonName}
                  className='launch-button'
                  onClick={props.clickHandler}
                  type='resumeButton'
                ></CustomButton>
                <CustomButton
                  id='restart'
                  title={props.data && props.data.restartData.buttonName}
                  className='launch-button'
                  onClick={props.clickHandler}
                  type='restartButton'
                ></CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withScorm()(RevistDialogue);
