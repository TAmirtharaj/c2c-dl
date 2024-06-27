import React from "react";
import "./PopUp.css";
const PopUp = (props) => {

return (
    <div className="popUpWrapper">
        <div className="popUpContentBg"><div className="popUpContent">{props.text}</div></div>
        <div className="arrow-down"></div>
    </div>
);

};

export default PopUp