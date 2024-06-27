import { connect } from "react-redux";
import {
  getCommonGridArray,
  imagePath,
  setCommonGridArray,
} from "../helper/Helper";
import "./Grid.css";
import GridQuad from "./GridQuad";
import { withScorm } from "react-scorm-provider-v2";
const Grid = (props) => {
  const serialNumber = props.pageData.sr ? props.pageData.sr : 0;
  // const page = props.page ? props.page : 0;
  let gridArray = [];
  for (let i = 0; i < 4; i++) {
    gridArray[i] = [];
    for (let j = 0; j < 5; j++) {
      gridArray[i][j] = [];
      for (let k = 0; k < 5; k++) {
        gridArray[i][j][k] = {};
        gridArray[i][j][k] = false;
      }
    }
  }

  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    console.log("scorm object recived :", scromData, props.page);
    if (
      scromData[props.page] &&
      scromData[props.page].gridDataArray &&
      scromData[props.page].gridDataArray[serialNumber]
    ) {
      console.log(
        "scorm data from cloud:",
        scromData[props.page].gridDataArray[serialNumber]
      );
      gridArray = scromData[props.page].gridDataArray[serialNumber];
      setCommonGridArray(props.page, serialNumber, gridArray);
      // setCommonGridArray(page, serialNumber, gridArray);
    }
  } else if (
    getCommonGridArray() &&
    getCommonGridArray()[props.page] &&
    getCommonGridArray()[props.page][serialNumber] &&
    getCommonGridArray()[props.page][serialNumber][0]
  )
    gridArray = getCommonGridArray()[props.page][serialNumber];

  const setGridArray = (quad, row, col, value) => {
    gridArray[quad][row][col] = value;
    setCommonGridArray(props.page, serialNumber, gridArray);
  };

  return (
    <div className='grid-activity' id={`grid_${props.page}_${serialNumber}`}>
      <div className='grid-row-1 grid-row-holder'>
        <GridQuad
          icons={props.pageData.icons}
          quadrant={0}
          gridArray={gridArray[0]}
          setGridArray={setGridArray}
        />
        <GridQuad
          icons={props.pageData.icons}
          quadrant={1}
          gridArray={gridArray[1]}
          setGridArray={setGridArray}
        />
      </div>
      <div className='grid-row-2 grid-row-holder'>
        <GridQuad
          icons={props.pageData.icons}
          quadrant={2}
          gridArray={gridArray[2]}
          setGridArray={setGridArray}
        />
        <GridQuad
          icons={props.pageData.icons}
          quadrant={3}
          gridArray={gridArray[3]}
          setGridArray={setGridArray}
        />
      </div>
      {/* <img
        className='grid-separator'
        src={imagePath(props.pageData.icons.separator)}
      ></img> */}
    </div>
  );
};

export default withScorm()(Grid);
