import React from "react";
import "./LabNotebook.css";
import { returnComponent } from "../../createComponent/CreateComponent";
import { Row } from "react-bootstrap";

const LabNotebook = (props) => {
  const Components = [];
  props.templateData.pageData.forEach((data) => {
    Components.push(returnComponent(data));
  });

  return (
    <Row className="container-padding lab-notebook-comp-container h-auto">
      {Components}
    </Row>
  );
};

export default LabNotebook;
