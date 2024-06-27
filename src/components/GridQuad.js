import "./GridQuad.css";
import { imagePath } from "../helper/Helper";
import { useRef } from "react";
import { useState, useEffect } from "react";

const GridQuad = (props) => {
  const getCord = (item) => {
    return item.match(/(\d+)/g);
  };

  let [stateChecked, setStateChecked] = useState('');


  const GridButton = (props) => {
    const imgRef = useRef();
    const btnRef = useRef();
    useEffect(() => {
      if (props.isChecked === true) {
        imgRef.current.src = imagePath(props.icons.checked);
        btnRef.current.classList.add("checked");
        btnRef.current.setAttribute("title", btnRef.current.getAttribute("title")+"checked,");
        // btnRef.current.setAttribute("aria-label", btnRef.current.getAttribute("aria-label")+"checked,");
        btnRef.current.setAttribute("alt", btnRef.current.getAttribute("alt")+"checked,");
      }
    }, []);

    const onBtnClick = (e) => {
      const cord = getCord(e.target.id);
      if (btnRef.current.classList.contains("checked")) {
        props.setGridArray(props.quadrant, props.row, props.col, false);
        imgRef.current.src = imagePath(props.icons.unChecked);
        btnRef.current.classList.remove("checked");
        btnRef.current.setAttribute("title", btnRef.current.getAttribute("title").replace("checked,",""));
        // btnRef.current.setAttribute("aria-label", btnRef.current.getAttribute("aria-label").replace("checked,",""));
        btnRef.current.setAttribute("alt", btnRef.current.getAttribute("alt").replace("checked,",""));
      } else {
        props.setGridArray(props.quadrant, props.row, props.col, true);
        imgRef.current.src = imagePath(props.icons.checked);
        btnRef.current.classList.add("checked");
        btnRef.current.setAttribute("title", btnRef.current.getAttribute("title")+"checked,");
        // btnRef.current.setAttribute("aria-label", btnRef.current.getAttribute("aria-label")+"checked,");
        btnRef.current.setAttribute("alt", btnRef.current.getAttribute("alt")+"checked,");
      }
    };

    const mouseOver = (e) => {
      if (!btnRef.current.classList.contains("checked"))
        imgRef.current.src = imagePath(props.icons.hover);
    };

    const mouseOut = (e) => {
      if (!btnRef.current.classList.contains("checked"))
        imgRef.current.src = imagePath(props.icons.unChecked);
    };

    return (
      <button
        id={`grid_btn_${props.quadrant}_${props.row}_${props.col}`}
        onClick={onBtnClick}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
        className='grid-button'
        tabIndex={1}
        ref={btnRef}
        // aria-label={`Quadrant ${props.quadrant + 1}, ROW ${props.row + 1}, Circle ${
        //   props.col + 1
        // },  ${''}`}
        title={`Quadrant ${props.quadrant + 1} ROW ${props.row + 1} Circle ${
          props.col + 1
        },  ${''}`}
        alt={`Quadrant ${props.quadrant + 1} ROW ${props.row + 1} Circle ${
          props.col + 1
        }, ${''}`}
      >
        <img
          className='grid-img'
          src={imagePath(props.icons.unChecked)}
          ref={imgRef}
        ></img>
      </button>
    );
  };

  return (
    <div className='grid-quad'>
      {props.gridArray.map((item, i) => {
        return (
          <div className='grid-row'>
            {item.map((item2, j) => {
              return (
                <div className='grid-button-wrapper'>
                  <GridButton
                    icons={props.icons}
                    quadrant={props.quadrant}
                    row={i}
                    col={j}
                    isChecked={item2}
                    setGridArray={props.setGridArray}
                  ></GridButton>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GridQuad;
