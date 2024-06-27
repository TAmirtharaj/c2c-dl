/** @format */

import "./Activity.css";
import { useState } from "react";
import { Col, Row, Tab, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Activity = (props) => {
  const activityIconLight = props.pageData.activityIconLight;
  const activityIconDark = props.pageData.activityIconDark;
  const lockedActivity = props.pageData.lockedActivity;

  const [activeStatus, setActiveStatus] = useState(false);
  const [activeClass, setActiveClass] = useState(false);

  function selectedHandler(event) {
    setActiveClass(event);
    setActiveStatus(true);
  }

  return (
    <Col className="activity-container" md="6" sm="12">
      <Tab.Container onSelect={selectedHandler}>
        <Row className={`right-aligned-tabs-holder ${activeStatus ? "activeContainer" : "inActiveContainer"}`}>
          <Col sm={3} className="w-auto">
            {props.pageData.activityData.map((activity, index) => {
              return (
                <Nav variant="pills" className="flex-column">
                  <Nav.Item className={activeClass === "activity_" + index ? "activeItem" : "inActiveItem"} id={"activity_" + index} key={"item_" + index}>
                    <Nav.Link eventKey={"activity_" + index} key={"activity_" + index} disabled={lockedActivity}>
                      <img draggable={false} src={activeClass === "activity_" + index ? activityIconDark : activityIconLight} />
                      <span className="activity-icon-bagde" key={"badge_" + index}>
                        {index + 1}
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              );
            })}
          </Col>
          <Col sm={9} className="tab-content-container">
            {props.pageData.activityData.map((activity, index) => {
              return (
                <Tab.Content>
                  <Tab.Pane eventKey={"activity_" + index}>{activity.description}</Tab.Pane>
                </Tab.Content>
              );
            })}
          </Col>
        </Row>
      </Tab.Container>
    </Col>
  );
};

export default Activity;
