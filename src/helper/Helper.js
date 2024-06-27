/** @format */

let bool = true;
let scrollPage = 0;
const objKCData = {};
const commonWindowObj = {};
let imgRefCount = 0;
let imgLoadedCount = 0;
let commonGridObj = [];
let currentLabNotebookPage = 0;
let scoRefVar = null;
let isLabNoteBook = false;

const imagePath = (path) => {
  return `./images/${path}`;
};

const setScoRef = (ref) => {
  scoRefVar = ref;
};

const setIsLabNotebook = (val) => {
  isLabNoteBook = val;
};

const getIsLabNotebook = () => {
  return isLabNoteBook;
};
const setCurrentLabNotebookPage = (val) => {
  currentLabNotebookPage = val;
};

const getCurrentLabNotebookPage = () => {
  return currentLabNotebookPage;
};

document.addEventListener("onWindowClose", () => {
  console.log("on window close triggered----------->", currentLabNotebookPage);
  if (isLabNoteBook)
    storeLabNotebookPagesDataToScorm(scoRefVar, false, currentLabNotebookPage);
});

const isLMSLive = (lms) => {
  return lms && lms.apiConnected;
};

let tabScroll = false;
/**
 * It takes a path and a callback function as arguments, fetches the data from the path, and then
 * passes the data to the callback function.
 * @param path - the path to the file you want to fetch
 * @param cb - callback function
 */
const filePath = (path, cb) => {
  fetch(`./data/${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      cb(data);
    });
};

/**
 * If the completion status of the SCO is not "completed", then check if the visitedArray contains a 0,
 * 1, or 3. If it does, then set the completion status to "completed"
 * @param scoRef - This is the reference to the SCO.
 * @param visitedArray - This is an array of integers that represent the status of each slide.
 */
const checkForCompletion = (scoRef, visitedArray) => {
  if (isLMSLive(scoRef)) {
    const completionStatus = scoRef.completionStatus;

    console.log("completionStatus :::: ", completionStatus);
    if (completionStatus !== "completed") {
      bool =
        visitedArray.toString().indexOf(0) !== -1 ||
        visitedArray.toString().indexOf(1) !== -1 ||
        visitedArray.toString().indexOf(3) !== -1
          ? false
          : true;
      if (bool) {
        if (isLMSLive(scoRef)) {
          scoRef.setStatus("completed").then(() => {
            bool = false;
          });
        }
      }
    }
  }
};
/**
 * If the browser supports the Event constructor, use it to dispatch a resize event, otherwise use the
 * old method.
 * @returns null
 */
const triggerResize = () => {
  if (typeof Event === "function") {
    // modern browsers
    window.dispatchEvent(new Event("resize"));
  } else {
    // for IE and other old browsers
    // causes deprecation warning on modern browsers
    var evt = window.document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
  }
  return null;
};

/**
 * It sets the suspend data, score, min, max, success_status and completion status of the SCO
 * @param scoRef - This is the reference to the SCO.
 * @param status - This is the status of the assessment. It can be either "passed" or "failed".
 * @param [score=0] - The score the user got on the assessment.
 */

const updateAssessmetStatus = (scoRef, status, score = 0) => {
  console.log("Score :: ", score);
  if (isLMSLive(scoRef)) {
    scoRef.setSuspendData("assessmentStatus", status).then((data) => {
      scoRef
        .setScore({
          value: score * 100,
          min: score,
          max: 100,
          status: score === 1 ? "passed" : "failed",
        })
        .then(() => {
          console.log("score submitted !");
        });
      // scoRef.set("cmi.core.score.raw", score * 100).then(() => {
      //   scoRef.set("cmi.core.score.scaled", score).then(() => {
      //     scoRef.set("cmi.core.score.min", 100).then(() => {
      //       scoRef.set("cmi.core.score.max", 100).then(() => {
      //         scoRef
      //           .set("cmi.success_status", score === 1 ? "passed" : "failed")
      //           .then(() => {
      //             scoRef.setStatus("completed").then(() => {
      //               console.log("completionStatus :::: completed");
      //             });
      //           });
      //       });
      //     });
      //   });
      // });
    });
  }
};

const callScoreEveryPage = (scoRef, score = 0) => {
    if (isLMSLive(scoRef)) {
      scoRef.getScore().then((data) => {
        scoRef
          .setScore({
            value: data * 100,
            min: data,
            max: 100,
            status: score === 1 ? "passed" : "failed",
          })
          .then(() => {
            console.log("score submitted every page!");
          });
      });
    }
}
/**
 * "The function takes in 5 parameters, and then uses the first parameter to call a function that sets
 * the value of the second parameter, and then uses the first parameter to call a function that sets
 * the value of the third parameter, and then uses the first parameter to call a function that sets the
 * value of the fourth parameter, and then uses the first parameter to call a function that sets the
 * value of the fifth parameter, and then uses the first parameter to call a function that sets the
 * value of the sixth parameter."
 *
 * I'm not sure if this is the best way to do this, but it works
 * @param scoRef - This is the SCORM object that is returned from the SCORM API.
 * @param currentSection - The current section the user is on.
 * @param currentScene - The current scene the user is on
 * @param currentSubScene - The current sub-scene the user is on.
 * @param visitedArray - an array of strings that represent the visited scenes
 */
const updateScormData = (
  scoRef,
  currentSection,
  currentScene,
  currentSubScene,
  visitedArray
) => {
  // console.log(scoRef);
  const obj = {
    currentScene: currentScene,
    currentSection: currentSection,
    currentSubScene: currentSubScene,
    visitedArray: visitedArray,
  };
  if (isLMSLive(scoRef)) {
    console.log("lllllllll -->", scoRef);
    scoRef.setSuspendData("scormObj", obj);
  }
  //  else {
  //   localStorage.setItem("scormObj", JSON.stringify(obj));
  // }
  // scoRef.setSuspendData("currentScene", currentScene).then((data) => {
  //   scoRef.setSuspendData("currentSection", currentSection).then((data) => {
  //     scoRef.setSuspendData("currentSubScene", currentSubScene).then((data) => {
  //       scoRef.setSuspendData("visitedArray", visitedArray).then((data) => {
  //         // for SCORM 2004
  //         // calculateTime(scoRef);
  //         // for SCORM 1.2
  //         computeTime(scoRef);
  //       });
  //     });
  //   });
  // });
};

/**
 * It takes an array of image file names, creates an object, and assigns each image file name to a key
 * in the object.
 *
 * The key is the image file name without the file extension.
 *
 * The value is a new Image object.
 *
 * The Image object's src property is set to the image file name.
 *
 * The function returns the object.
 * @param arr - an array of image names
 */
const preloadImages = (arr) => {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    let pointer = arr[i].split(".")[0];
    obj[pointer] = new Image();
    obj[pointer].src = `./images/${arr[i]}`;
  }
};

/* A JavaScript code that detects the device type and orientation. */
const BrowserDetect = {
  platformAndroid() {
    return !!navigator.userAgent.match(/Android/i);
  },
  platformBlackBerry() {
    return !!navigator.userAgent.match(/BlackBerry/i);
  },
  platformIOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
      ? true
      : navigator.maxTouchPoints > 0 &&
          typeof window.orientation !== "undefined";
  },
  platformWindows() {
    return !!navigator.userAgent.match(/IEMobile/i);
  },
  isIPhone() {
    return navigator.userAgent.match(/iPhone|iPod/i)
      ? true
      : navigator.maxTouchPoints > 0 &&
          typeof window.orientation !== "undefined";
  },
  isIpad() {
    return navigator.userAgent.match(/iPad/i)
      ? true
      : navigator.maxTouchPoints > 0 &&
          typeof window.orientation !== "undefined";
  },
  isMobile() {
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.search("android") > -1 && userAgent.search("mobile") > -1)
      return true;
    else if (
      userAgent.search("android") > -1 &&
      !(userAgent.search("mobile") > -1)
    )
      return false;
    else
      return /iphone|ipod|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      );
  },
  isTablet() {
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.search("android") > -1 && !(userAgent.search("mobile") > -1))
      return true;
    else if (BrowserDetect.isIpad()) return true;
    else
      return /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(
        userAgent.toLowerCase()
      );
  },
  isDevice() {
    return (
      BrowserDetect.platformAndroid() ||
      BrowserDetect.platformBlackBerry() ||
      BrowserDetect.platformIOS() ||
      BrowserDetect.platformWindows()
    );
  },
  ie9() {
    return !!navigator.userAgent.match(/MSIE 9.0/i);
  },
  ie10() {
    return !!navigator.userAgent.match(/MSIE 10.0/i);
  },
  ie() {
    return (
      navigator.appName === "Microsoft Internet Explorer" ||
      !!(
        navigator.userAgent.match(/Trident/) ||
        navigator.userAgent.match(/rv:11/)
      ) ||
      navigator.userAgent.indexOf("MSIE") > 0 ||
      !!navigator.userAgent.match(/Edge\/\d./i) ||
      !!navigator.userAgent.match(/MSIE 9.0/i) ||
      !!navigator.userAgent.match(/MSIE 10.0/i)
    );
  },
  getOrientation() {
    let returnObj = {
      type: "D", // values - M - Mobile / T - tablet / D - Desktop / Othe - not yet recognised as device or desktop
      orientation: undefined, // undfined for Destop / L - landscape / P - Portrait
    };
    if (BrowserDetect.isDevice()) {
      returnObj.orientation = window.orientation === 0 ? "P" : "L";
      returnObj.type = BrowserDetect.isMobile()
        ? "M"
        : BrowserDetect.isTablet()
        ? "T"
        : "Other";
    }
    return returnObj;
  },
};

const triggerCourseCompleted = (scoRef) => {
  if (isLMSLive(scoRef)) {
    scoRef.setStatus("completed").then(() => {
      console.log("triggerCourseCompleted :::: completed");
    });
  }
};

//===============  SCORM 2004 Time Calculator ===============

const convertTotalSeconds = (ts) => {
  let sec = ts % 60;
  let hour, min;

  ts -= sec;
  let tmp = ts % 3600; //# of seconds in the total # of minutes
  ts -= tmp; //# of seconds in the total # of hours

  // convert seconds to conform to CMITimespan type (e.g. SS.00)
  sec = Math.round(sec * 100) / 100;

  let strSec = sec.toString();
  let strWholeSec = strSec;
  let strFractionSec = "";

  if (strSec.indexOf(".") !== -1) {
    strWholeSec = strSec.substring(0, strSec.indexOf("."));
    strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
  }

  if (strWholeSec.length < 2) {
    strWholeSec = "0" + strWholeSec;
  }
  strSec = strWholeSec;

  if (strFractionSec.length) {
    strSec = strSec + "." + strFractionSec;
  }

  if (ts % 3600 !== 0) hour = 0;
  else hour = ts / 3600;
  if (tmp % 60 !== 0) min = 0;
  else min = tmp / 60;

  if (hour.toString().length < 2) hour = "0" + hour;
  if (min.toString().length < 2) min = "0" + min;

  let rtnVal = hour + ":" + min + ":" + strSec;

  return rtnVal;
};

function computeTime(scoRef) {
  let startDate = window.oldDate;
  let formattedTime;
  if (startDate !== 0) {
    let currentDate = new Date().getTime();
    let elapsedSeconds = (currentDate - startDate) / 1000;
    formattedTime = convertTotalSeconds(elapsedSeconds);
  } else {
    formattedTime = "00:00:00.0";
  }
  if (isLMSLive(scoRef)) {
    scoRef.set("cmi.core.session_time", formattedTime).then(() => {
      triggerCourseCompleted(scoRef);
    });
  }
}

//============================================================
//===============  SCORM 2004 Time Calculator ===============

const calculateTime = (scoRef) => {
  const apiConnected = scoRef.apiConnected;
  let prevLMSTime = apiConnected
    ? SCORM2004_GetPreviouslyAccumulatedTime(scoRef.get("cmi.total_time"))
    : 0;
  // console.log("prevLMSTime :: ", prevLMSTime);
  const currentDate = new Date().getTime() + prevLMSTime;
  const elapsedSeconds = (currentDate - window.oldDate) / 1000;
  const formattedTime = ConvertMilliSecondsIntoSCORM2004Time(elapsedSeconds);
  return scoRef.apiConnected
    ? scoRef.set("cmi.session_time", formattedTime).then(() => {
        triggerCourseCompleted(scoRef);
      })
    : "";
};

/**
 * ConvertMilliSecondsIntoSCORM2004Time(intTotalMilliseconds)
 * @param intTotalMilliseconds - The total number of milliseconds you want to convert.
 * @returns A string that represents the time in SCORM 2004 format.
 */
const ConvertMilliSecondsIntoSCORM2004Time = (intTotalMilliseconds) => {
  let ScormTime = "";

  let HundredthsOfASecond; //decrementing counter - work at the hundreths of a second level because that is all the precision that is required

  let Seconds; // 100 hundreths of a seconds
  let Minutes; // 60 seconds
  let Hours; // 60 minutes
  let Days; // 24 hours
  let Months; // assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
  let Years; // assumed to be 12 "average" months

  let HUNDREDTHS_PER_SECOND = 100;
  let HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
  let HUNDREDTHS_PER_HOUR = HUNDREDTHS_PER_MINUTE * 60;
  let HUNDREDTHS_PER_DAY = HUNDREDTHS_PER_HOUR * 24;
  let HUNDREDTHS_PER_MONTH = HUNDREDTHS_PER_DAY * ((365 * 4 + 1) / 48);
  let HUNDREDTHS_PER_YEAR = HUNDREDTHS_PER_MONTH * 12;

  HundredthsOfASecond = Math.floor(intTotalMilliseconds / 10);

  Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
  HundredthsOfASecond -= Years * HUNDREDTHS_PER_YEAR;

  Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
  HundredthsOfASecond -= Months * HUNDREDTHS_PER_MONTH;

  Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
  HundredthsOfASecond -= Days * HUNDREDTHS_PER_DAY;

  Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
  HundredthsOfASecond -= Hours * HUNDREDTHS_PER_HOUR;

  Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
  HundredthsOfASecond -= Minutes * HUNDREDTHS_PER_MINUTE;

  Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
  HundredthsOfASecond -= Seconds * HUNDREDTHS_PER_SECOND;

  if (Years > 0) {
    ScormTime += Years + "Y";
  }
  if (Months > 0) {
    ScormTime += Months + "M";
  }
  if (Days > 0) {
    ScormTime += Days + "D";
  }

  //check to see if we have any time before adding the "T"
  if (HundredthsOfASecond + Seconds + Minutes + Hours > 0) {
    ScormTime += "T";
    if (Hours > 0) {
      ScormTime += Hours + "H";
    }
    if (Minutes > 0) {
      ScormTime += Minutes + "M";
    }
    if (HundredthsOfASecond + Seconds > 0) {
      ScormTime += Seconds;
      if (HundredthsOfASecond > 0) {
        ScormTime += "." + HundredthsOfASecond;
      }
      ScormTime += "S";
    }
  }
  if (ScormTime === "") {
    ScormTime = "0S";
  }
  ScormTime = "P" + ScormTime;
  console.log("Returning-" + ScormTime);
  return ScormTime;
};

const SCORM2004_GetPreviouslyAccumulatedTime = (time) => {
  let strIso8601Time;
  let intMilliseconds;

  strIso8601Time = time; //SCORM2004_CallGetValue("cmi.total_time");

  if (!IsValidIso8601TimeSpan(strIso8601Time)) {
    console.log("ERROR - Invalid Iso8601Time");
    return null;
  }

  intMilliseconds = ConvertScorm2004TimeToMS(strIso8601Time);

  return intMilliseconds;
};

/**
 * It takes a string in the format of "P[nY][nM][nD][T[nH][nM][n[.n]S]]" and returns the number of
 * milliseconds that string represents
 * @param strIso8601Time - The time in ISO 8601 format.
 * @returns The number of milliseconds that the SCORM 2004 time represents.
 */
const ConvertScorm2004TimeToMS = (strIso8601Time) => {
  // console.log("In ConvertScorm2004TimeToMS, strIso8601Time=" + strIso8601Time);

  let intTotalMs = 0;

  let strNumberBuilder;
  let strCurrentCharacter;
  let blnInTimeSection;

  let Seconds = 0; // 100 hundreths of a seconds
  let Minutes = 0; // 60 seconds
  let Hours = 0; // 60 minutes
  let Days = 0; // 24 hours
  let Months = 0; // assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
  let Years = 0; // assumed to be 12 "average" months

  let MILLISECONDS_PER_SECOND = 1000;
  let MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * 60;
  let MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;
  let MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;
  let MILLISECONDS_PER_MONTH = MILLISECONDS_PER_DAY * ((365 * 4 + 1) / 48);
  let MILLISECONDS_PER_YEAR = MILLISECONDS_PER_MONTH * 12;

  strIso8601Time = strIso8601Time.toString();

  strNumberBuilder = "";
  strCurrentCharacter = "";
  blnInTimeSection = false;

  //start at 1 to get past the "P"
  for (let i = 1; i < strIso8601Time.length; i++) {
    strCurrentCharacter = strIso8601Time.charAt(i);

    if (IsIso8601SectionDelimiter(strCurrentCharacter)) {
      switch (strCurrentCharacter.toUpperCase()) {
        case "Y":
          Years = parseInt(strNumberBuilder, 10);
          break;

        case "M":
          if (blnInTimeSection) {
            Minutes = parseInt(strNumberBuilder, 10);
          } else {
            Months = parseInt(strNumberBuilder, 10);
          }
          break;

        case "D":
          Days = parseInt(strNumberBuilder, 10);
          break;

        case "H":
          Hours = parseInt(strNumberBuilder, 10);
          break;

        case "S":
          Seconds = parseFloat(strNumberBuilder);
          break;

        case "T":
          blnInTimeSection = true;
          break;
        default:
          break;
      }

      strNumberBuilder = "";
    } else {
      strNumberBuilder += "" + strCurrentCharacter; //use "" to keep the number as string concats instead of numeric additions
    }
  }

  console.log(
    "Years=" +
      Years +
      "\n" +
      "Months=" +
      Months +
      "\n" +
      "Days=" +
      Days +
      "\n" +
      "Hours=" +
      Hours +
      "\n" +
      "Minutes=" +
      Minutes +
      "\n" +
      "Seconds=" +
      Seconds +
      "\n"
  );

  intTotalMs =
    Years * MILLISECONDS_PER_YEAR +
    Months * MILLISECONDS_PER_MONTH +
    Days * MILLISECONDS_PER_DAY +
    Hours * MILLISECONDS_PER_HOUR +
    Minutes * MILLISECONDS_PER_MINUTE +
    Seconds * MILLISECONDS_PER_SECOND;

  //necessary because in JavaScript, some values (such as 2.01) will have a lot of decimal
  //places when multiplied by a larger number. For instance, 2.01 turns into 2009.999999999999997.
  intTotalMs = Math.round(intTotalMs);

  // console.log("returning-" + intTotalMs);

  return intTotalMs;
};

const IsIso8601SectionDelimiter = (str) => {
  if (str.search(/[PYMDTHS]/) >= 0) {
    return true;
  } else {
    return false;
  }
};

const IsValidIso8601TimeSpan = (strValue) => {
  // console.log("In IsValidIso8601TimeSpan strValue=" + strValue);

  let regValid = /^P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+(.\d\d?)?S)?)?$/;

  if (strValue.search(regValid) > -1) {
    console.log("Returning True");
    return true;
  } else {
    console.log("Returning False");
    return false;
  }
};
/**
 * While the current index is not zero, set the random index to a random number between 0 and the
 * current index, then decrement the current index and swap the current index with the random index.
 * @param array - The array to shuffle.
 * @returns The array is being returned.
 */
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

// get current scroll value

const setScroll = (value) => {
  console.log("scroll value recieved ", value);
  scrollPage = value;
};

const getScroll = () => {
  return scrollPage;
};

/**
 * It stores the data from the lab notebook pages to the SCORM API
 * @param scoRef - This is the reference to the SCORM API.
 * @param [hasLabNotebookSubmitted=false] - This is a boolean value that is set to true when the user
 * submits the lab notebook.
 * @param [page=0] - The page number of the lab notebook.
 */

const getId = function (classlist) {
  classlist.forEach((item, index) => {
    if (item.substring(0, 10) === "textEditor") {
      console.log("found", item);
      return index;
    }
  });
};
const storeLabNotebookPagesDataToScorm = (
  scoRef,
  hasLabNotebookSubmitted = false,
  page = 0
) => {
  console.log("storing lab data");
  let textareaData = [],
    imageData = [],
    fillInBlank = [],
    tableData = {},
    dataTable = [],
    mainDataTable = {},
    mainImageData = {},
    mainImageDataSrc = {},
    gridDataArray = [];
  if (commonGridObj[`page_${page}`])
    gridDataArray = commonGridObj[`page_${page}`];
  if (document.querySelectorAll(".text-area")) {
    document.querySelectorAll(".text-area").forEach((textArea) => {
      textareaData.push(textArea.value);
      // console.log("here inside helper", textArea.value);
    });
  }

  let windowObj = getCommonWindowObj();

  // tableData = windowObj.editorData;
  console.log("found window obj", windowObj, windowObj.editorData);
  if (windowObj.editorData) {
    // console.log("found window obj", windowObj.editorData);
    // windowObj.editorData.forEach((item, key) => {
    //   console.log("editor value---------", item, key);
    // });

    // Object.entries(windowObj.editorData).forEach((entry) => {
    //   const [key, value] = entry;
    //   console.log("key values from array", windowObj.editorData, key, value);
    //   tableData[key] = value;
    //   // Object.assign({}, tableData, { key: value });
    //   // tableData.push(entry);
    // });

    // // tableData = { ...windowObj.editorData };
    // console.log(
    //   "table data----->",

    //   tableData
    // );
    for (let key in windowObj.editorData) {
      console.log("editor value---------", windowObj.editorData[key], key);
      if (windowObj.editorData[key] && windowObj.editorData[key] !== "")
        tableData[key] = windowObj.editorData[key];
    }
  }

  const textEditor = document.querySelectorAll(".text-editor");
  // if (textEditor) {
  //   textEditor.forEach((item, index) => {
  //     // console.log("item", item, window.editorData);
  //     // let id = getId(item.classList);
  //     let windowObj = getCommonWindowObj();
  //     item.classList.forEach((classlist, index) => {
  //       if (classlist.substring(0, 10) === "textEditor") {
  //         if (
  //           windowObj.editorData &&
  //           windowObj.editorData[classlist]
  //           //   !window.editorData[classlist] === "" &&
  //           //   !window.editorData[classlist] === "<p></p>"
  //         ) {
  //           console.log("found", classlist, windowObj.editorData[classlist]);
  //           tableData[classlist] = windowObj.editorData[classlist];
  //         }
  //       }
  //     });
  //     // window.editorData[id]
  //     // console.log("added data", id, window.editorData, window.editorData[id]);
  //   });

  //   // console.log("saved data", window.editorData);
  // }

  if (document.querySelectorAll(".fill-in-blank")) {
    document.querySelectorAll(".fill-in-blank").forEach((textArea) => {
      fillInBlank.push(textArea.value);
    });
  }

  // if (document.querySelector(".upload-files-container")) {
  //   document.querySelectorAll(".upload-files-container").forEach((imgArea, i) => {
  //     imageData[i] = imgArea.querySelector(".imageData") ? imgArea.querySelector(".imageData").src : "";
  //     // console.log(imageData);
  //   });
  // }

  /* Getting the image data from the HTML and storing it in an array. */

  // if (document.querySelector(".upload-files-container")) {
  //   document
  //     .querySelectorAll(".upload-files-container")
  //     .forEach((imgArea, i) => {
  //       const imageDiv = imgArea.querySelector(`.imageData_${i}`);
  //       // mainImageData[i] = imageDiv
  //       //   ? imageDiv.getAttribute("fileId")
  //       //     ? imageDiv.getAttribute("fileId")
  //       //     : ""
  //       //   : "";

  //       // console.log(
  //       //   "image parameters",
  //       //   imageDiv,
  //       //   imageDiv.getAttribute("fileId")
  //       // );
  //       if (
  //         imageDiv &&
  //         imageDiv.getAttribute("fileId") &&
  //         imageDiv.getAttribute("fileId") !== -1
  //       ) {
  //         mainImageData[i] = imageDiv.getAttribute("fileId");
  //       }
  //       if (
  //         imageDiv &&
  //         imageDiv.getAttribute("fileId") &&
  //         imageDiv.getAttribute("fileId") === -1
  //       ) {
  //         mainImageData[i] = null;
  //       }
  //       // console.log("file id extracted", imageDiv);
  //     });
  // }
  if (windowObj.uploadImgData) {
    console.log("upload called", windowObj.uploadImgData);
    for (let key in windowObj.uploadImgData) {
      console.log("editor value---------", windowObj.uploadImgData[key], key);
      if (windowObj.uploadImgData[key] && windowObj.uploadImgData[key] !== -1)
        mainImageData[key] = windowObj.uploadImgData[key];
      else if (
        windowObj.uploadImgData &&
        windowObj.uploadImgData[key] &&
        windowObj.uploadImgData[key] === -1
      ) {
        mainImageData[key] = null;
      }
    }
    console.log(
      "upload image helper:",
      document.querySelector(".upload-files-container"),
      mainImageData
    );
  }
  if (document.querySelector(".upload-files-container")) {
    document
      .querySelectorAll(".upload-files-container")
      .forEach((imgArea, i) => {
        const imageDiv = imgArea.querySelector(`.imageData_${i}`);
        mainImageDataSrc[i] = imageDiv
          ? imageDiv.src
            ? imageDiv.src
            : ""
          : "";
        // console.log("file id extracted 2", imageDiv);
      });
  }

  /* Creating an array of arrays of objects for multiple dataTable. */
  // if (document.querySelectorAll(".data-table-container")) {
  //   document.querySelectorAll(".data-table-container").forEach((element, i) => {
  //     const dataTable = [];
  //     element.querySelectorAll(`.row_data_${i}`).forEach((row, rowId) => {
  //       let rows = [];
  //       row.childNodes.forEach((element, elementId) => {
  //         console.log("max length found", rowId, elementId);
  //         let type = element.getAttribute("data-type");
  //         if (type === "text" || type === "input") {
  //           rows.push({
  //             id: element.id,
  //             type,
  //             rowspan: element.getAttribute("rowspan")
  //               ? element.getAttribute("rowspan")
  //               : 1,
  //             colspan: element.getAttribute("colspan")
  //               ? element.getAttribute("colspan")
  //               : 1,
  //             maxLength: element.getAttribute("maxLength")
  //               ? element.getAttribute("maxLength")
  //               : {},
  //             borderBottom: element.style.borderBottom,
  //             width: element.style.width,
  //             borderRight: element.classList.contains("thickLine"),
  //             text:
  //               type === "text"
  //                 ? element.textContent
  //                 : element.childNodes[0].value,
  //           });
  //         } else if (type === "Image") {
  //           const source = element
  //             .querySelector(".image-in-table")
  //             .getAttribute("src");
  //           const imgDiv = element.querySelector(".image-in-table");
  //           console.log(
  //             "image",
  //             element.style.backgroundColor,
  //             imgDiv.offsetHeight
  //           );
  //           rows.push({
  //             id: element.id,
  //             type,
  //             colspan: element.getAttribute("colspan")
  //               ? element.getAttribute("colspan")
  //               : 1,
  //             color: element.style.backgroundColor,
  //             src: source.slice(9, source.length),
  //             height: imgDiv.offsetHeight,
  //             width: imgDiv.offsetWidth,
  //           });
  //         }
  //       });
  //       dataTable.push(rows);
  //     });
  //     mainDataTable[i] = dataTable;
  //   });
  // }

  const windowScromData = {
    mainImageData, // file id
    mainImageDataSrc, // src
    tableData, // this field contains data for every input data recived from New editor
    textareaData,
    imageData,
    fillInBlank,
    gridDataArray,
  };

  const ScromData = {
    mainImageData, // file id
    // src
    tableData, // this field contains data for every input data recived from New editor
    textareaData,
    imageData,
    fillInBlank,
    gridDataArray,
  };

  console.log("scorm data obj:", windowScromData);
  windowObj = getCommonWindowObj();
  windowObj[`page_${page}`] = windowScromData;
  setCommonWindowObj(windowObj);
  if (scoRef && scoRef.apiConnected && !hasLabNotebookSubmitted) {
    // windowScromData.mainImageDataSrc = {};
    scoRef.setSuspendData(`page_${page}`, ScromData).then((data) => {
      // window[`page_${page}`] = windowScromData;
      // windowObj[`page_${page}`] = windowScromData;
      // setCommonWindowObj(windowObj);
    });

    // console.log("data load completed");
    // if (tableData.length > 0) {
    //   scoRef.setSuspendData(`page_${page}`, tableData).then((data) => {
    //     window[`page_${page}`] = tableData;
    //     scoRef.setStatus("completed").then(() => {
    //       console.log("completionStatus :::: completed");
    //     });
    //   });
    // }
    // else if (textareaData) {
    //   scoRef.setSuspendData(`page_${page}`, textareaData).then((data) => {
    //     window[`page_${page}`] = textareaData;
    //     scoRef.setStatus("completed").then(() => {
    //       console.log("completionStatus :::: completed");
    //     });
    //   });
    // } else if (imageData) {
    //   scoRef.setSuspendData(`page_${page}`, imageData).then((data) => {
    //     window[`page_${page}`] = imageData;
    //     scoRef.setStatus("completed").then(() => {
    //       console.log("completionStatus :::: completed");
    //     });
    //   });
    // }
  } else {
    // if (tableData.length > 0) window[`page_${page}`] = tableData;
    // else if (textareaData) window[`page_${page}`] = textareaData;
    // else if (imageData) window[`page_${page}`] = imageData;

    // window[`page_${page}`] = windowScromData;

    console.log("data storeed helper......", `page_${page}`);
    // console.log("window[`page_${page}`]:", window[`page_${page}`]);
  }
};

/**
 * It takes in an index, a type, and a percent and returns a string that is a class name.
 * @param index - the index of the element in the array
 * @param type - left, right, center, bodyTitle
 * @param [percent=50] - The percentage of the screen the element will take up.
 * @returns zoomClass
 */
const getZoomClassList = (index, type, percent = "50") => {
  let zoomClass;
  switch (type) {
    case "left":
      zoomClass = "zoomLevelLeft";
      break;
    case "right":
      zoomClass = "zoomLevelRight";
      break;
    case "center":
      zoomClass = "zoomLevelCenter";
      break;
    case "bodyTitle":
      zoomClass = "zoomTitle";
      break;
    default:
      break;
  }
  zoomClass = zoomClass + index + " ";

  switch (percent) {
    case "50":
      zoomClass += "zoomWidth50Level";
      break;
    case "25":
      zoomClass += "zoomWidth25Level";
      break;
    case "75":
      zoomClass += "zoomWidth75Level";
      break;
    case "100":
      zoomClass += "zoomWidth100Level";
      break;
    default:
      zoomClass += "zoomWidth50Level";
      break;
  }
  zoomClass = zoomClass + index;

  return zoomClass;
};

const labNoteBookZoomLineheight = (element, value) => {
  if (typeof element === "object") {
    element.forEach((ele) => {
      ele.style.fontSize = `${value.fontSize}em`;
      ele.style.lineHeight = `${value.lineHeight}em`;
    });
  } else {
    element.style.fontSize = `${value.fontSize}em`;
    element.style.lineHeight = `${value.lineHeight}em`;
  }
};

const getFlagDND = (srNo) => {
  commonWindowObj.initFlagDND = commonWindowObj.initFlagDND
    ? commonWindowObj.initFlagDND
    : [];
  // console.log("inbside the get flag", srNo, window.initFlagDND[srNo]);
  commonWindowObj.initFlagDND[srNo] = commonWindowObj.initFlagDND[srNo]
    ? commonWindowObj.initFlagDND[srNo]
    : 0;

  return commonWindowObj.initFlagDND[srNo];
};

const setFlagDND = (srNo, flag) => {
  commonWindowObj.initFlagDND = commonWindowObj.initFlagDND
    ? commonWindowObj.initFlagDND
    : [];
  if (srNo !== -1) {
    commonWindowObj.initFlagDND[srNo] = flag;
  } else {
    commonWindowObj.initFlagDND.forEach((item, index) => {
      commonWindowObj.initFlagDND[index] = 0;
    });
  }
};

const setMCSSFlagAll = () => {
  if (commonWindowObj.MCSSShuffleArray) {
    commonWindowObj.MCSSShuffleArray.forEach((item, index) => {
      if (commonWindowObj.MCSSShuffleArray[index])
        commonWindowObj.MCSSShuffleArray[index] = 0;
    });
  }
};

const getKCDataObj = () => {
  return objKCData;
};

const setKCDataObj = (key = 0, val) => {
  objKCData[key] = val;
};

const getCommonWindowObj = () => {
  if (commonWindowObj) return commonWindowObj;
  // else if (sessionStorage.getItem(commonWindowObj)) {
  //   return JSON.parse(sessionStorage.getItem(commonWindowObj))
  // } else {
  //   return commonWindowObj;
  // }
};

const setCommonWindowObj = (val, key = 0) => {
  // console.log("window object recieved:", val, "window local Obj:", window);
  // console.log(
  //   "knowledgeCheckUserSelection",
  //   val.knowledgeCheckUserSelection,
  //   window.knowledgeCheckUserSelection
  // );
  // console.log(
  //   "knowledgeCheckCorrectStatus",
  //   val.knowledgeCheckCorrectStatus,
  //   window.knowledgeCheckCorrectStatus
  // );
  // console.log(
  //   "knowledgeCheckUserAttempt",
  //   val.knowledgeCheckUserAttempt,
  //   window.knowledgeCheckUserAttempt
  // );
  // console.log(
  //   "knowledgeCheckQuestionStatus",
  //   val.knowledgeCheckQuestionStatus,
  //   window.knowledgeCheckQuestionStatus
  // );
  commonWindowObj[key] = val;
  // console.log(commonWindowObj)
  // if (commonWindowObj)
  //   sessionStorage.setItem("commonWindowObj", JSON.stringify({ commonWindowObj }))
};

const setImgRefCount = (count) => {
  imgRefCount = count;
  const printBtn = document.querySelector(".print-button");
  if (printBtn && !printBtn.classList.contains("disable-print")) {
    printBtn.classList.add("disable-print");
  }
};

const getImgRefCount = () => {
  return imgRefCount;
};

const setImgLoadedCount = (count) => {
  imgLoadedCount = count;
  if (imgLoadedCount === imgRefCount) {
    const printBtn = document.querySelector(".print-button");
    if (printBtn && printBtn.classList.contains("disable-print")) {
      printBtn.classList.remove("disable-print");
    }
  }
};

const getImgLoadedCount = () => {
  return imgLoadedCount;
};

const setCommonGridArray = (page, sr, val) => {
  const pageNum = +page.match(/(\d+)/g)[0];
  console.log("page:", pageNum);
  if (!commonGridObj[page]) commonGridObj[page] = [];
  commonGridObj[page][sr] = val;
};

const getCommonGridArray = () => commonGridObj;

const setTabScroll = (value) => {
  tabScroll = value;
};

const getTabScroll = () => {
  return tabScroll;
};
//===========================================================

/* Exporting the functions from the file. */
export {
  shuffle,
  imagePath,
  filePath,
  BrowserDetect,
  getFlagDND,
  setMCSSFlagAll,
  setFlagDND,
  getScroll,
  setCommonWindowObj,
  getCommonWindowObj,
  setScroll,
  triggerResize,
  updateScormData,
  checkForCompletion,
  updateAssessmetStatus,
  callScoreEveryPage,
  preloadImages,
  ConvertMilliSecondsIntoSCORM2004Time,
  SCORM2004_GetPreviouslyAccumulatedTime,
  storeLabNotebookPagesDataToScorm,
  getZoomClassList,
  labNoteBookZoomLineheight,
  getKCDataObj,
  setKCDataObj,
  getImgLoadedCount,
  setImgRefCount,
  getImgRefCount,
  setImgLoadedCount,
  getCommonGridArray,
  setCommonGridArray,
  setTabScroll,
  getTabScroll,
  setCurrentLabNotebookPage,
  getCurrentLabNotebookPage,
  setScoRef,
  getIsLabNotebook,
  setIsLabNotebook,
};
