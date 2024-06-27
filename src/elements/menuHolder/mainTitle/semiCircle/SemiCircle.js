import React from "react";
import "./SemiCircle.css";

const SemiCircle = (props) => {
    const getClassName = (_status) => {
        let tempClassName = "innerFillCircle ";
        switch(_status) {
            case 'NA':
                break;
            case 'visited':
                tempClassName += "halfFill"
                break;
            case 'completed':
                tempClassName += "fullFill"
                break;
            case 'failed':
                tempClassName += "failFill"
                break;
            case 'passed':
                tempClassName += "fullFill"
                break;
            default:
                break;
        }
        return tempClassName
    }

    return(
        <div className="outerCircleWrapper">
            <div className="outerCircle">
                <div className={getClassName(props.status)}></div>
            </div>
        </div>
    );
}



export default SemiCircle;