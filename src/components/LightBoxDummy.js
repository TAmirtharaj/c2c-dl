import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./LightBox.css";

const LightBox = forwardRef((props, ref) => {
  const [imageToShow, setImageToShow] = useState("");
  const [lightboxDisplay, setLightBoxDisplay] = useState(false);

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    // function to show a specific image in the lightbox, amd make lightbox visible
    showImage(image) {
      setImageToShow(image);
      setLightBoxDisplay(true);
    },
  }));

  //hide lightbox
  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

  return (
    <React.Fragment>
      {lightboxDisplay ? (
        <div className="lightbox" onClick={hideLightBox}>
          <img
            draggable={false}
            className="lightbox-img"
            src={imageToShow}
            alt=""
            width={props.handleWidthHeight.width}
            height={props.handleWidthHeight.height}
          />
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
});

export default LightBox;
