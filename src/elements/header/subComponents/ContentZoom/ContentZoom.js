import "./ContentZoom.css";
import {
  imagePath,
  BrowserDetect,
  getCommonWindowObj,
} from "../../../../helper/Helper";
import { connect } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import { useState, useEffect } from "react";
import CustomButton from "../../../../components/CustomButton";

const ContentZoom = (props) => {
  const [btnClick, setBtnState] = useState(false);
  const fontSetter = imagePath(
    props.data && props.data.headerData.images.fontSetter
  );
  let windowObj = getCommonWindowObj();
  const hideMenu = () => {
    setBtnState(false);
  };
  document.addEventListener("click", hideMenu);
  const fontMinus = imagePath(
    props.data && props.data.headerData.images.fontMinus
  );
  const fontPlus = imagePath(
    props.data && props.data.headerData.images.fontPlus
  );
  useEffect(() => {
    if (btnClick) {
      const minusBtn = document.getElementById("circle_2");
      const plusBtn = document.getElementById("circle_3");
      if (props.zoomIndex === 1) {
        minusBtn.style.opacity = 0.5;
        minusBtn.style.pointerEvents = "none";
      } else {
        minusBtn.style.opacity = 1;
        minusBtn.style.pointerEvents = "all";
      }
      if (props.zoomIndex === 3) {
        plusBtn.style.opacity = 0.5;
        plusBtn.style.pointerEvents = "none";
      } else {
        plusBtn.style.opacity = 1;
        plusBtn.style.pointerEvents = "all";
      }
    }
    return () => {
      document.removeEventListener("click", hideMenu);
    };
  }, [btnClick, props.zoomIndex]);
  const clickHandler = (e) => {
    windowObj = getCommonWindowObj();
    e.stopPropagation();
    e.preventDefault();
    // console.log("=============================", e.target.id);
    switch (e.target.parentElement.id || e.target.id) {
      case "circle_1":
        btnClick ? setBtnState(false) : setBtnState(true);
        break;
      case "circle_2":
        windowObj.zoomState = true;
        if (props.zoomIndex === 1) {
        } else {
          props.updateZoomIndex(props.zoomIndex - 1);
        }
        break;
      case "circle_3":
        windowObj.zoomState = true;
        if (props.zoomIndex === 3) {
        } else {
          props.updateZoomIndex(props.zoomIndex + 1);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className='ContentZoomHolder'>
      <CustomButton
        className='zoom-button'
        id='circle_1'
        width='25px'
        height='25px'
        type='icon'
        url={fontSetter}
        onClick={clickHandler}
        btnTitle='Alter text size'
      ></CustomButton>
      {btnClick ? (
        <div
          style={{
            position: "absolute",
            zIndex: "111",
            top: "100%",
            width: "100px",
            height: "auto",
            left: "calc(50% - 50px)",
            textAlign: "center",
            right: "0px",
            margin: "auto",
            border: "solid 2px #0062b8",
            borderRadius: "7px",
            backgroundColor: "white",
            padding: "5px 10px",
          }}
        >
          <div
            style={{
              position: "absolute",
              margin: "auto",
              left: 0,
              right: 0,
              width: "0",
              height: "0",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid #0062b8",
              bottom: "100%",
            }}
          ></div>
          <CustomButton
            id='circle_2'
            disabled={props.zoomIndex === 1}
            type='icon'
            url={fontMinus}
            onClick={clickHandler}
            width='25px'
            height='25px'
            style={{ position: "relative", left: "0%", padding: "0 5px" }}
            btnTitle='decrease text size'
          ></CustomButton>
          <CustomButton
            id='circle_3'
            disabled={props.zoomIndex === 3}
            type='icon'
            width='25px'
            height='25px'
            url={fontPlus}
            onClick={clickHandler}
            btnTitle=' Increase text size'
            style={{ position: "relative", left: "0%", padding: "0 5px" }}
          ></CustomButton>
        </div>
      ) : (
        ""
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
    updateShowLightBoxBool: (data) =>
      dispatch({ type: "UPDATE_SHOW_LIGHT_BOX_BOOL", payload: data }),
    updateLightBoxData: (data) =>
      dispatch({ type: "UPDATE_LIGHT_BOX_DATA", payload: data }),
    updateMenuBool: (data) =>
      dispatch({ type: "UPDATE_MENU_BOOL", payload: data }),
    updateZoomIndex: (data) =>
      dispatch({ type: "UPDATE_ZOOM_INDEX", payload: data }),
  };
};
export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(ContentZoom)
);
