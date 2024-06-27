import React from "react";
import { returnComponent } from "../../createComponent/CreateComponent";
import "./Steps.css";

const SubSteps = (props) => {
  const Components = [];
  let classList = "";
  props.content.forEach((data) => {
    if (data.type === "Plain") {
      classList = "step-comp-plainText";
    }
    Components.push(returnComponent(data, { classList }));
  });

  return (
    <div className='step-comp-child-step-content row'>
      <div className='col-md-2'>
        <div className='step-comp-step-circle'>
          <div>{String.fromCharCode(props.stepCount)}</div>
        </div>
      </div>
      <div className='col'>
        <div className='step-comp-step-content'>{Components}</div>
      </div>
    </div>
  );
};

export default SubSteps;
