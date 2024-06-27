/** @format */

import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import "./MCSSForm.css";
import {
  imagePath,
  setScroll,
  getScroll,
  getCommonWindowObj,
  setCommonWindowObj,
} from "../helper/Helper";
import { withScorm } from "react-scorm-provider-v2";
import Parser from "html-react-parser";
import { labNoteBookZoomLineheight } from "../helper/Helper";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

const MCSSForm = (props) => {
  const [formData, setFormData] = useState({
    ans: undefined,
    isLoad: true,
    isAnsSubmit: false,
    isSubmitEnable: false,
  });
  const zoomIndex = useSelector((state) => state.zoomIndex);
  let windowObj = getCommonWindowObj();
  useEffect(() => {
    const scrollValue = getScroll();
    const bodyContainer = document.querySelector(".bodyContainer");
    if (bodyContainer && scrollValue !== 0) {
      console.log("scroll value ", getScroll());
      bodyContainer.scrollTop = scrollValue;
    } else {
      bodyContainer.scrollTop = 0;
      setScroll(0);
    }
  });

  // useEffect(() => {
  //   const bodyContainer = document.querySelector(".bodyContainer");
  //   bodyContainer.scrollTop = 0;
  // }, []);

  useEffect(() => {
    let zoomHeader = { fontSize: 1.1, lineHeight: 1.1 },
      zoomContent = { fontSize: 0.95, lineHeight: 1.5 },
      zoomButton = { fontSize: 1, lineHeight: 1.1 },
      zoomContent2 = { fontSize: 0.85, lineHeight: 1.25 };
    if (zoomIndex === 1) {
      zoomContent = { fontSize: 0.95, lineHeight: 1.5 };
      zoomHeader = { fontSize: 1.1, lineHeight: 1.1 };
      zoomContent2 = { fontSize: 0.85, lineHeight: 1.25 };
      zoomButton = { fontSize: 1, lineHeight: 1.1 };
    } else if (zoomIndex === 2) {
      zoomContent = { fontSize: 1.05, lineHeight: 1.6 };
      zoomHeader = { fontSize: 1.2, lineHeight: 1.2 };
      zoomContent2 = { fontSize: 0.95, lineHeight: 1.5 };
      zoomButton = { fontSize: 1.1, lineHeight: 1.2 };
    } else {
      zoomContent = { fontSize: 1.15, lineHeight: 1.7 };
      zoomHeader = { fontSize: 1.3, lineHeight: 1.3 };
      zoomContent2 = { fontSize: 1.05, lineHeight: 1.75 };
      zoomButton = { fontSize: 1.2, lineHeight: 1.3 };
    }

    labNoteBookZoomLineheight(
      document.querySelectorAll(".mcss-comp-heading"),
      zoomContent
    );

    labNoteBookZoomLineheight(
      document.querySelectorAll(".mcss-form-comp-radio-label"),
      zoomContent2
    );

    labNoteBookZoomLineheight(
      document.querySelectorAll(".mcss-form-comp-button"),
      zoomHeader
    );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".drop-text"),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".mcss-comp-heading "),
    //   zoomContent
    // );
    // labNoteBookZoomLineheight(
    //   document.querySelectorAll(".dropped"),
    //   zoomContent
    // );
  }, [zoomIndex]);

  const [attempt, setAttempt] = useState(0);
  // console.log(attempt, "attempt");
  let count = 0;

  const formSubmit = (event) => {
    event.preventDefault();
    setFormData((prev) => {
      return { ...prev, isAnsSubmit: true };
    });
    props.onFormSubmit(true);
    const result = props.pageData.options.some((option) => {
      return option.correct && option.id === formData.ans;
    });
    // window.assementObj.result = result;

    windowObj = getCommonWindowObj();
    windowObj.assementObj.result = result;
    setCommonWindowObj(windowObj);

    props.onUpdateResult(result);
    setFormData((prev) => {
      return { ...prev, isSubmitEnable: false };
    });
    if (props.pageData.purpose !== "Assessment") {
      if (props.pageData.kcRef !== undefined) {
        // window.knowledgeCheckUserSelection[props.pageData.kcRef] = formData.ans;

        windowObj = getCommonWindowObj();
        windowObj.knowledgeCheckUserSelection[props.pageData.kcRef] =
          formData.ans;
        setCommonWindowObj(windowObj);

        if (result || attempt >= 1) {
          if (props.sco.apiConnected) {
            props.sco
              .setSuspendData(
                "knowledgeCheckUserSelection",
                windowObj.knowledgeCheckUserSelection
              )
              .then((data) => {
                console.log(
                  "knowledgeCheckUserSelection updated successfully:",
                  windowObj.knowledgeCheckUserSelection
                );
                // window.knowledgeCheckUserSelection[props.pageData.kcRef] =
                //   formData.ans;

                windowObj = getCommonWindowObj();
                windowObj.knowledgeCheckUserSelection[props.pageData.kcRef] =
                  formData.ans;
                setCommonWindowObj(windowObj);
              });
          }
        } else {
          setAttempt(1);
        }
      }
    } else if (props.pageData.purpose === "Assessment") {
      props.pageData.options.map((opt) => delete opt.tickOrWrongSign);

      if (result) {
        const index1 = props.pageData.options
          .map((opt) => opt.id)
          .indexOf(formData.ans);
        props.pageData.options[index1].img =
          props.pageData.radioButtonStates.correct;
        props.pageData.options[index1].ariaLabel = `Right answer, ${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
        props.pageData.options[index1].tickOrWrongSign =
          props.pageData.radioButtonStates.tick;
      } else {
        const index1 = props.pageData.options
          .map((opt) => opt.id)
          .indexOf(formData.ans);
        props.pageData.options[index1].img =
          props.pageData.radioButtonStates.incorrect;
        props.pageData.options[index1].ariaLabel = `Wrong answer, ${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
        props.pageData.options[index1].tickOrWrongSign =
          props.pageData.radioButtonStates.wrong;
      }
    }

    // window.assementObj.submit = true;
    // window.assementObj.formData = formData;

    windowObj = getCommonWindowObj();
    windowObj.assementObj.submit = true;
    windowObj.assementObj.formData = formData;
    setCommonWindowObj(windowObj);
  };

  //  windowObj = getCommonWindowObj();
  if (
    windowObj.knowledgeCheckUserSelection[props.pageData.kcRef] !== -1 &&
    props.pageData.purpose !== "Assessment"
  ) {
    const result = props.pageData.options.some((option) => {
      return (
        option.correct &&
        option.id ===
          windowObj.knowledgeCheckUserSelection[props.pageData.kcRef]
      );
    });

    if (result) {
      const index1 = props.pageData.options
        .map((opt) => opt.id)
        .indexOf(windowObj.knowledgeCheckUserSelection[props.pageData.kcRef]);
      props.pageData.options[index1].img =
        props.pageData.radioButtonStates.correct;
      props.pageData.options[index1].ariaLabel = `Right answer, ${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
      props.pageData.options[index1].tickOrWrongSign =
        props.pageData.radioButtonStates.tick;
    } else {
      const index = props.pageData.options
        .map((opt) => opt.correct)
        .indexOf(true);

      props.pageData.options[index].img =
        props.pageData.radioButtonStates.correct;
      props.pageData.options[index].ariaLabel = `Right answer, ${(props.pageData.options[index].text ? props.pageData.options[index].text:"") + (props.pageData.options[index].optionImg ? props.pageData.options[index].optionImg.altText ? props.pageData.options[index].optionImg.altText: "": "")}, Selected,`
      props.pageData.options[index].tickOrWrongSign =
        props.pageData.radioButtonStates.tick;

      const index1 = props.pageData.options
        .map((opt) => opt.id)
        .indexOf(windowObj.knowledgeCheckUserSelection[props.pageData.kcRef]);
      props.pageData.options[index1].img =
        props.pageData.radioButtonStates.incorrect;
      props.pageData.options[index1].ariaLabel = `Wrong answer, ${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
      props.pageData.options[index1].tickOrWrongSign =
        props.pageData.radioButtonStates.wrong;
    }
  }

  if (
    ((props.pageData.purpose !== "Assessment" &&
      windowObj.knowledgeCheckUserSelection[props.pageData.kcRef] === -1) ||
      (props.pageData.purpose === "Assessment" && formData.isLoad)) &&
    formData.isLoad
  ) {
    setFormData((prev) => {
      return {
        ...prev,
        isLoad: false,
      };
    });
    props.pageData.options.forEach((option, index) => {
      option.img = props.pageData.radioButtonStates.unChecked;
      option.ariaLabel = `${(option.text ? option.text:"") + (option.optionImg ? option.optionImg.altText ? option.optionImg.altText: "": "")}, Unselected,`
    });
  }

  const onClickHandler = (selectedRadio) => {
    windowObj = getCommonWindowObj();
    if (
      windowObj.assementObj === null ||
      windowObj.assementObj === undefined ||
      (windowObj.assementObj && !windowObj.assementObj.submit)
    ) {
      let newSelectedRadio;
      if (
        windowObj.assementObj === null ||
        windowObj.assementObj === undefined
      ) {
        windowObj.assementObj = {};
        windowObj.assementObj.selectedRadio = selectedRadio;
        windowObj.assementObj.submit = false;
      }
      setFormData((prev) => {
        return {
          ...prev,
          isAnsSubmit: false,
          ans: newSelectedRadio.id,
          isSubmitEnable: true,
          isMouseHover: false,
        };
      });

      newSelectedRadio = selectedRadio;
      props.onFormSubmit(false);
      props.pageData.options.forEach((option) => {
        option.img = props.pageData.radioButtonStates.unChecked;
        option.ariaLabel = `${(option.text ? option.text:"") + (option.optionImg ? option.optionImg.altText ? option.optionImg.altText: "": "")}, Unselected,`
      });
      if (newSelectedRadio.id !== undefined) {
        const index = props.pageData.options
          .map((opt) => opt.id)
          .indexOf(newSelectedRadio.id);
        props.pageData.options[index].img =
          props.pageData.radioButtonStates.checked;
        props.pageData.options[index].ariaLabel = `${(props.pageData.options[index].text ? props.pageData.options[index].text:"") + (props.pageData.options[index].optionImg ? props.pageData.options[index].optionImg.altText ? props.pageData.options[index].optionImg.altText: "": "")}, Selected,`
        if (windowObj.assementObj) {
          // window.assementObj.selectedRadio = newSelectedRadio;

          windowObj = getCommonWindowObj();
          windowObj.assementObj.selectedRadio = newSelectedRadio;
          setCommonWindowObj(windowObj);
        }
      }
    }
  };

  const onMouseOverHandler = (selectedRadio) => {
    windowObj = getCommonWindowObj();
    if (
      windowObj.assementObj === null ||
      windowObj.assementObj === undefined ||
      (windowObj.assementObj && !windowObj.assementObj.submit)
    ) {
      setFormData((prev) => {
        return { ...prev, isMouseHover: true };
      });

      props.pageData.options.forEach((option) => {
        option.img = props.pageData.radioButtonStates.unChecked;
        option.ariaLabel = `${(option.text ? option.text:"") + (option.optionImg ? option.optionImg.altText ? option.optionImg.altText: "": "")}, Unselected,`
      });

      if (formData.ans !== undefined) {
        const index1 = props.pageData.options
          .map((opt) => opt.id)
          .indexOf(formData.ans);
        props.pageData.options[index1].img =
          props.pageData.radioButtonStates.checked;
        props.pageData.options[index1].ariaLabel = `${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
      }
      const index2 = props.pageData.options
        .map((opt) => opt.id)
        .indexOf(selectedRadio.id);

      props.pageData.options[index2].img =
        props.pageData.radioButtonStates.hover;
    }
  };

  const onMouseOutHandler = () => {
    windowObj = getCommonWindowObj();
    if (
      windowObj.assementObj === null ||
      windowObj.assementObj === undefined ||
      (windowObj.assementObj && !windowObj.assementObj.submit)
    ) {
      setFormData((prev) => {
        return { ...prev, isMouseHover: false };
      });
      props.pageData.options.forEach((option) => {
        option.img = props.pageData.radioButtonStates.unChecked;
        option.ariaLabel = `${(option.text ? option.text:"") + (option.optionImg ? option.optionImg.altText ? option.optionImg.altText: "": "")}, Unselected,`
      });
      if (formData.ans !== undefined) {
        const index1 = props.pageData.options
          .map((opt) => opt.id)
          .indexOf(formData.ans);
        props.pageData.options[index1].img =
          props.pageData.radioButtonStates.checked;
        props.pageData.options[index1].ariaLabel = `${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
      }
    }
  };

  const scrollHandle = () => {
    const scrollValue = 0;
    const bodyContainer = document.querySelector(".bodyContainer");
    if (bodyContainer) {
      bodyContainer.scrollTop = scrollValue;
    }
  };

  const onNextHandler = () => {
    const compContainer = document.querySelector(".assessment-comp-container");
    setScroll(0);
    const bodyContainer = document.querySelector(".bodyContainer");
    if (bodyContainer) {
      bodyContainer.scrollTop = 0;
    }

    let windowObj = getCommonWindowObj();
    if (compContainer) {
      compContainer.style.display = "none";
      setTimeout(scrollHandle, 10);
      compContainer.style.display = "";
    }
    windowObj.zoomState = false;
    if (windowObj.assessmentImageClick) {
      windowObj.assessmentImageClick = false;
    }
    setCommonWindowObj(windowObj);
    // window.assementObj = null;

    windowObj = getCommonWindowObj();
    windowObj.assementObj = null;
    setCommonWindowObj(windowObj);
    if (props.onLoadNextQue) props.onLoadNextQue();
  };

  const onTryAgain = () => {
    // setIsAnsSubmit(false);
    // props.onLoadNextQue();/
  };

  windowObj = getCommonWindowObj();
  let isAttempted =
    props.pageData.purpose !== "Assessment"
      ? windowObj.knowledgeCheckUserSelection[props.pageData.kcRef] !== -1
      : formData.isAnsSubmit;
  if (windowObj.assementObj) {
    isAttempted = windowObj.assementObj.submit;
  }
  useEffect(() => {
    windowObj = getCommonWindowObj();
    if (windowObj.assementObj) {
      if (!windowObj.assementObj.submit)
        onClickHandler(windowObj.assementObj.selectedRadio);
      else {
        setFormData((prev) => {
          return { ...prev, isSubmitEnable: false, isAnsSubmit: true };
        });
        if (windowObj.assementObj.result) {
          const index1 = props.pageData.options
            .map((opt) => opt.id)
            .indexOf(windowObj.assementObj.formData.ans);
          props.pageData.options[index1].img =
            props.pageData.radioButtonStates.correct;
          props.pageData.options[index1].ariaLabel = `Right answer, ${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
          props.pageData.options[index1].tickOrWrongSign =
            props.pageData.radioButtonStates.tick;
        } else {
          const index1 = props.pageData.options
            .map((opt) => opt.id)
            .indexOf(windowObj.assementObj.formData.ans);
          props.pageData.options[index1].img =
            props.pageData.radioButtonStates.incorrect;
          props.pageData.options[index1].ariaLabel = `Wrong answer, ${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
          props.pageData.options[index1].tickOrWrongSign =
            props.pageData.radioButtonStates.wrong;
        }
      }
    }
  }, []);

  return (
    <>
      <div
        className={`${isAttempted ? "radio-btn-set-2" : "radio-btn-set-1"}`}
      >
        <div style={{display:'table'}}>
          {props.pageData.options.map((option, index) => {
            return (
              <div
              style={{display:'table-row'}}
              key={`option_${index}`}>
                {isAttempted && (
                  <div 
                  style={{display:'table-cell'}}
                  className='align-top'>
                    {option.tickOrWrongSign && (
                      <img
                        draggable={false}
                        src={imagePath(option.tickOrWrongSign)}
                        className='correct-incorrect-tick-img'
                      />
                    )}
                  </div>
                )}
                <div
                style={{display:'table-cell'}}
                className='align-top'>
                  <CustomButton
                    type='icon'
                    url={imagePath(option.img)}
                    className={`radio-btn-comp ${
                      isAttempted ? "radio-btn-comp-disable" : ""
                    }`}
                    onMouseOut={onMouseOutHandler}
                    onMouseOver={onMouseOverHandler.bind(this, option)}
                    onClick={onClickHandler.bind(this, option)}
                    ariaLabel={option.ariaLabel}
                    ariaHidden={false}
                    tabIndex={isAttempted ? "-1" : "0"}
                  />
                </div>
                <div style={{display:'table-cell'}}>
                  {option.text && (
                    <label
                      className={`mcss-form-comp-radio-label bodyNormalSubHeading ${
                        isAttempted ? "mcss-form-comp-radio-label-disable" : ""
                      }`}
                      htmlFor={option.text}
                      onMouseOut={onMouseOutHandler}
                      onMouseOver={onMouseOverHandler.bind(this, option)}
                      aria-hidden='true'
                      onClick={onClickHandler.bind(this, option)}
                    >
                      {Parser(option.text)}
                    </label>
                  )}
                  {option.optionImg && (
                    <img
                      draggable={false}
                      className={`option-image`}
                      src={imagePath(option.optionImg.src)}
                      title={
                        option.optionImg.altText ? option.optionImg.altText : ""
                      }
                      alt={
                        option.optionImg.altText ? option.optionImg.altText : ""
                      }
                      aria-hidden='true'
                      style={{
                        width: option.optionImg.width
                          ? option.optionImg.width
                          : "auto",
                        height: option.optionImg.height
                          ? option.optionImg.height
                          : "auto",
                      }}
                    ></img>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <CustomButton
          className={`mcss-form-comp-button bodyButtonLabel ${
            formData.isSubmitEnable ? "" : "mcss-form-comp-button-disable"
          }`}
          id='submit'
          title='Submit'
          onClick={formSubmit}
          ariaLabel={"Submit"}
          btnTitle='Submit selected answer'
          ariaHidden={false}
          tabIndex={formData.isSubmitEnable ? "0" : "-1"}
          disabled={formData.isSubmitEnable ? false : true}
        />
        {props.pageData.purpose === "Assessment" && (
          <CustomButton
            className={`mcss-form-comp-button bodyButtonLabel ${
              formData.isAnsSubmit ? "" : "mcss-form-comp-button-disable"
            }`}
            id='Next'
            title='Next'
            onClick={onNextHandler}
            ariaLabel={"Next"}
            ariaHidden={false}
            tabIndex={formData.isAnsSubmit ? "0" : "-1"}
            disabled={formData.isAnsSubmit ? false : true}
          />
        )}
        {props.pageData.purpose === "KC" &&
          formData.isAnsSubmit &&
          attempt === 1 && (
            <CustomButton
              className={`mcss-form-comp-button bodyButtonLabel`}
              id='TryAgain'
              title='Try Again'
              onClick={onTryAgain}
              ariaLabel={"Try Again"}
              btnTitle='try again'
            />
          )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
  };
};
export default withScorm()(connect(mapStateToProps, null)(MCSSForm));
