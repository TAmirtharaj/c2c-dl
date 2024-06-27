import { Row } from "react-bootstrap";
import CompletionActionButtons from "./CompletionActionButtons";
import "./LightboxCompletionOrImage.css";

const LightboxCompletionOrImage = (props) => {
  const altText = props.altText ? props.altText : "";
  return typeof props.url === "object" ? (
    <Row className="lightbox-content-completion">
      <div className="completion-information-msg">{props.url.info}</div>
      <CompletionActionButtons
        labNoteBookFlag={props.labNoteBookFlag}
        onClose={props.onClose}
      />
    </Row>
  ) : (
    <Row className="lightbox-content-row customScrollbar" tabIndex='0'>
      {props.scrollImg ? (
        <div>
          <img draggable={false} 
            className="lightbox-img"
            src={props.url}
            title={altText}
            alt={`image, ${altText.replace(/<\/?[^>]+(>|$)/g, "")}`}
            style={{ width: props.maxWidth ? props.maxWidth : "none" }}
            height="100%"
          />
        </div>
      ) : (
        <img draggable={false} 
          className="lightbox-img"
          src={props.url}
          title={altText}
          alt={`image, ${altText.replaceAll(/<\/?[^>]+(>|$)/g, "")}`}
          style={{ width: props.maxWidth ? props.maxWidth : "none" }}
          height="100%"
        />
      )}
    </Row>
  );
};

export default LightboxCompletionOrImage;
