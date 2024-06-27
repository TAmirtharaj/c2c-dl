import { Fragment } from "react";
import ReactDOM from "react-dom";
import "./MobileLandscapePopup.css";

const MobileLandscapeBackdrop = props => {
  return <div className="mobile-landscape-backdrop"/>;
};

const PopupModalOverlay = props => {
  return (
    <div className="mobile-landscape-modal">
      <div className="mobile-landscape-modal-content">{props.message}</div>
      <div className="mobile-landscape-modal-closebtn" onClick={props.onClose}>&times;</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const MobileLandscapePopup = props => {
  return (
    <Fragment>
      {ReactDOM.createPortal(<MobileLandscapeBackdrop/>, portalElement)}
      {ReactDOM.createPortal(<PopupModalOverlay onClose={props.onClose} message={props.message}>{props.children}</PopupModalOverlay>, portalElement)}
    </Fragment>
  );
};

export default MobileLandscapePopup;
