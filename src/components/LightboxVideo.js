/** @format */

import { useState, useEffect } from "react";
import "./LightboxVideo.css";

const LightboxVideo = (props) => {
  return <iframe title="Video" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen="" src={props.url} className="videoIframe"></iframe>;
};

export default LightboxVideo;
