/** @format */

import LabNotebookPagesData from "./LabNotebookPagesData";
import LabNotebookNavigation from "./LabNotebookNavigation";
import React from "react";
import LightboxCompletionOrImage from "./LightboxCompletionOrImage";
import LightboxKnowledgeCheckFeedback from "./LightboxKnowledgeCheckFeedback";
import LightboxVideo from "./LightboxVideo";
import UserInformation from "./UserInformation";
import ResourceNavigation from "./ResourceNavigation";
import DataTable from "./DataTable";
// import ResourcePageData from "./ResourcePageData";

const LightBoxContent = (props) => {
  switch (props.type) {
    case "LabNoteBook":
      return (
        <React.Fragment>
          <LabNotebookPagesData />
          <LabNotebookNavigation />
        </React.Fragment>
      );
      break;
    case "UserInformation":
      return <UserInformation />;
      break;
    case "Image":
      return (
        <LightboxCompletionOrImage
          maxWidth={props.maxWidth}
          scrollImg={props.scrollImg}
          type={props.type}
          url={props.data.url}
          refs={props.data.refs}
          altText={props.altText ? props.altText : ""}
          onClose={props.onClose}
        />
      );
      break;
    case "KnowledgeCheckFeedback":
      return (
        <LightboxKnowledgeCheckFeedback
          type={props.type}
          data={props.data.data}
          onClose={props.onClose}
        />
      );
      break;
    case "CompletionBox":
      return (
        <LightboxCompletionOrImage
          type={props.type}
          altText={props.altText ? props.altText : "Completion Image"}
          labNoteBookFlag={props.data.labNoteBookFlag}
          url={props.data}
          onClose={props.onClose}
        />
      );
      break;
    case "Video":
      return (
        <LightboxVideo
          type={props.type}
          refs={props.data.refs}
          url={props.data.url}
          onClose={props.onClose}
        />
      );
      break;
    case "ResourceImage":
      return (
        <React.Fragment>
          <LightboxCompletionOrImage
            maxWidth={props.maxWidth}
            scrollImg={props.scrollImg}
            altText={props.altText ? props.altText : props.content}
            type={props.type}
            url={props.data.url}
            onClose={props.onClose}
          />
          <ResourceNavigation />
        </React.Fragment>
      );
      break;
    case "ResourceVideo":
      // console.log(props.data.url, "inside resource");
      return (
        <React.Fragment>
          <LightboxVideo
            type={props.type}
            refs={props.data.refs}
            url={props.data.url}
            onClose={props.onClose}
          />
          <ResourceNavigation />
        </React.Fragment>
      );
      break;
    case "DataTable":
      console.log(props, "inside resource");
      return (
        <React.Fragment>
          <div
            className="customScrollbar lightbox-content-row"
            style={{
              overflow: "auto",
              height: "80%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DataTable
              // type={props.type}
              // props={props.data.props}
              // index={props.data.props.index}
              pageData={props.data.pageData}
              refs={props.data.refs}
              // url={props.data.url}
              // onClose={props.onClose}
            />
          </div>
          {props.data.pageData.isResource && <ResourceNavigation />}
        </React.Fragment>
      );
      break;
    default:
      break;
  }
};

export default LightBoxContent;
