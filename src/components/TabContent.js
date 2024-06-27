import React from 'react';
import './TabContent.css';
import { returnComponent } from '../createComponent/CreateComponent';

const TabContent = (props) => {
  // console.log("------------------ TabContent --------------------");

  const Components = [];
  props.pageData.forEach((data) => {
    Components.push(returnComponent(data));
  });

  return <div className="tab-content-comp-container col">{Components}</div>;
};

export default TabContent;
