import React, { useEffect, useState } from "react";

const FontPreloader = (props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  }, []);

  return visible ? (
    <div id="fontPreloader" style={{ position: "absolute", opacity: 0 }}>
      <div style={{ "fontFamily": "Montserrat-Regular" }}>font1</div>
      <div style={{ "fontFamily": "Montserrat-Medium" }}>font1</div>
      <div style={{ "fontFamily": "Montserrat-SemiBold" }}>font2</div>
      <div style={{ "fontFamily": "Montserrat-Bold" }}>font3</div>
      <div style={{ "fontFamily": "HelveticaNeueLTStdMd45" }}>font4</div>
      <div style={{ "fontFamily": "HelveticaNeueLTStd55Roman" }}>font5</div>
      <div style={{ "fontFamily": "HelveticaNeueLTStdMd65" }}>font6</div>
      <div style={{ "fontFamily": "HelveticaNeueLTStdBd75" }}>font7</div>
    </div>
  ) : (
    <div />
  );
};

export default FontPreloader;
