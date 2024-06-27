/** @format */

import React, { useState, useEffect } from "react";
import Parser from "html-react-parser";
import "./MCSSForm.css";
import CustomButton from "./CustomButton";
import {
  getCommonWindowObj,
  imagePath,
  setCommonWindowObj,
} from "../helper/Helper";
import "./KC.css";
import { connect } from "react-redux";
import Feedback from "./Feedback";
import { shuffleArray } from "../shuffleArray/shuffleArray";
import { getZoomClassList, BrowserDetect } from "../helper/Helper";
import Image from "../components/ImageWithHeading";
import DataTable from "./DataTable";

const KC = (props) => {
  // console.log(props, "KCCCCCCCCCCC", !(window.knowledgeCheckUserSelection[props.kcRef][props.isChallengeQuestion] === -1));
  const trace = (str) => {
    // console.log(str)
  };

  let windowObj = getCommonWindowObj();
  windowObj = getCommonWindowObj();
  if (props.pageData.shuffleOption === false) {
    windowObj.knowledgeCheckShuffleStatus[props.kcRef][
      props.isChallengeQuestion
    ] = true;
    props.updateShuffleStatus();
  }
  let [hintClicked, setHintClicked] = useState(false);
  const [formData, setFormData] = useState({
    ans: undefined,
    isLoad: true,
    isAnsSubmit: false,
    isSubmitEnabled: false,
    isAttempted: windowObj.knowledgeCheckQuestionStatus[props.kcRef][
      props.isChallengeQuestion
    ]
      ? !(
          windowObj.knowledgeCheckQuestionStatus[props.kcRef][
            props.isChallengeQuestion
          ] === -1
        )
      : false,
    isMouseHover: false,
    correctStatus: windowObj.knowledgeCheckQuestionStatus[props.kcRef][
      props.isChallengeQuestion
    ]
      ? windowObj.knowledgeCheckQuestionStatus[props.kcRef][
          props.isChallengeQuestion
        ]
      : false,
    attempt: windowObj.knowledgeCheckUserAttempt
      ? windowObj.knowledgeCheckUserAttempt[props.kcRef][
          props.isChallengeQuestion
        ]
      : 0,
    isChallengeQuestion: props.isChallengeQuestion
      ? props.isChallengeQuestion
      : 0,
  });

  useEffect(() => {
    // console.log("useEffect...............................");

    let windowObj = getCommonWindowObj();
    console.log("window obj data", windowObj.isChallengeQuestion);
    if (
      windowObj.isChallengeQuestion &&
      windowObj.isChallengeQuestion[props.kcRef]
    ) {
      console.log("hint was clicked");
      props.onChallengeQuestion();
    }
    if (props.isChallengeQuestion) {
      setHintClicked(false);
    } else {
      setHintClicked(windowObj.knowledgeCheckHintClicked[props.kcRef]);
    }
    if (
      windowObj.knowledgeCheckCorrectStatus[props.kcRef][
        props.isChallengeQuestion
      ] !== "NA"
    ) {
      windowObj = getCommonWindowObj();
      setFormData((prev) => {
        return {
          ...prev,
          isAttempted: true,
          isAnsSubmit: true,
          isSubmitEnabled: false,
          ans: windowObj.knowledgeCheckUserSelection[props.kcRef][
            props.isChallengeQuestion
          ]
            ? windowObj.knowledgeCheckUserSelection[props.kcRef][
                props.isChallengeQuestion
              ]
            : -1,
          correctStatus: windowObj.knowledgeCheckQuestionStatus[props.kcRef][
            props.isChallengeQuestion
          ]
            ? windowObj.knowledgeCheckQuestionStatus[props.kcRef][
                props.isChallengeQuestion
              ]
            : false,
          attempt: windowObj.knowledgeCheckUserAttempt
            ? windowObj.knowledgeCheckUserAttempt[props.kcRef][
                props.isChallengeQuestion
              ]
            : 0,
          isChallengeQuestion: props.isChallengeQuestion
            ? props.isChallengeQuestion
            : 0,
        };
      });
      unCheckAllOptions();
      windowObj = getCommonWindowObj();
      if (
        windowObj.knowledgeCheckUserSelection[props.kcRef][
          props.isChallengeQuestion
        ] !== -1
      ) {
        const index = props.pageData.options
          .map((opt) => opt.id)
          .indexOf(
            windowObj.knowledgeCheckUserSelection[props.kcRef][
              props.isChallengeQuestion
            ]
          );
        props.pageData.options[index].img =
          props.pageData.radioButtonStates.checked;
        if (
          windowObj.knowledgeCheckUserAttempt[props.kcRef][
            props.isChallengeQuestion
          ] > 0
        ) {
          props.pageData.options[index].img = props.pageData.options[index]
            .correct
            ? props.pageData.radioButtonStates.correct
            : props.pageData.radioButtonStates.incorrect;
        }
        if (
          windowObj.knowledgeCheckUserAttempt[props.kcRef][
            props.isChallengeQuestion
          ] === 2 &&
          !windowObj.knowledgeCheckCorrectStatus[props.kcRef][
            props.isChallengeQuestion
          ]
        ) {
          const index1 = props.pageData.options
            .map((opt) => opt.correct)
            .indexOf(true);

          props.pageData.options[index1].img =
            props.pageData.radioButtonStates.correct;
        }
      }
      if (
        props.isChallengeQuestion &&
        windowObj.knowledgeCheckUserAttempt[props.kcRef][
          props.isChallengeQuestion
        ] === 1 &&
        !windowObj.knowledgeCheckCorrectStatus[props.kcRef][
          props.isChallengeQuestion
        ]
      ) {
        props.updateHintClicked(true);
      }
    } else {
      windowObj = getCommonWindowObj();
      if (
        windowObj.knowledgeCheckShuffleStatus &&
        windowObj.knowledgeCheckShuffleStatus[props.kcRef] &&
        !windowObj.knowledgeCheckShuffleStatus[props.kcRef][
          props.isChallengeQuestion
        ]
      ) {
        props.pageData.options = shuffleArray(props.pageData.options);

        windowObj = getCommonWindowObj();
        windowObj.knowledgeCheckShuffleStatus[props.kcRef][
          props.isChallengeQuestion
        ] = true;
        setCommonWindowObj(windowObj);
        props.updateShuffleStatus();
      }

      windowObj = getCommonWindowObj();
      setFormData((prev) => {
        return {
          ...prev,
          ans: windowObj.knowledgeCheckUserSelection[props.kcRef][
            props.isChallengeQuestion
          ]
            ? windowObj.knowledgeCheckUserSelection[props.kcRef][
                props.isChallengeQuestion
              ]
            : -1,
          isAnsSubmit: false,
          isSubmitEnabled: false,
          isAttempted: windowObj.knowledgeCheckQuestionStatus[props.kcRef][
            props.isChallengeQuestion
          ]
            ? !(
                windowObj.knowledgeCheckQuestionStatus[props.kcRef][
                  props.isChallengeQuestion
                ] === -1
              )
            : false,
          correctStatus: windowObj.knowledgeCheckQuestionStatus[props.kcRef][
            props.isChallengeQuestion
          ]
            ? windowObj.knowledgeCheckQuestionStatus[props.kcRef][
                props.isChallengeQuestion
              ]
            : false,
          attempt: windowObj.knowledgeCheckUserAttempt
            ? windowObj.knowledgeCheckUserAttempt[props.kcRef][
                props.isChallengeQuestion
              ]
            : 0,
          isChallengeQuestion: props.isChallengeQuestion
            ? props.isChallengeQuestion
            : 0,
        };
      });
      props.updateHintClicked(false);
      // if (window.kcData && window.kcData[props.kcRef]) {
      //   setFormData(window.kcData[props.kcRef]);
      // }

      props.pageData.options.map((opt, index) => {
        props.pageData.options[index].img =
          props.pageData.radioButtonStates.unChecked;
        props.pageData.options[index].ariaLabel = `${(props.pageData.options[index].text ? props.pageData.options[index].text:"") + (props.pageData.options[index].optionImg ? props.pageData.options[index].optionImg.altText ? props.pageData.options[index].optionImg.altText: "": "")}, Unselected,`
      });
    }

  }, []);

  useEffect(() => {
    // console.log(
    //   "use effect kc",
    //   formData.isSubmitEnabled,
    //   window.kcData ? window.kcData[props.kcRef] : ""
    // );
    // window.kcData = window.kcData ? window.kcData : [];
    // window.kcData[props.kcRef] = window.kcData[props.kcRef]
    //   ? window.kcData[props.kcRef]
    //   : {};
    // window.kcData[props.kcRef] = formData;
  }, [formData]);

  let classList = "mcss-comp-wrapper-left ";

  let rightZoomClass = "mcss-comp-wrapper-right ";

  if (!BrowserDetect.isMobile()) {
    rightZoomClass += getZoomClassList(props.zoomIndex, "right");
    classList += getZoomClassList(props.zoomIndex, "left");
  }

  const onClickHandler = (selectedRadio) => {
    // console.log(selectedRadio)
    unCheckAllOptions();

    trace("onClickHandler");
    setFormData((prev) => {
      return {
        ...prev,
        isAnsSubmit: false,
        ans: selectedRadio.id,
        isSubmitEnable: true,
        isMouseHover: false,
      };
    });
    // console.log("onClickHandler", formData.isSubmitEnabled);
    //
    if (selectedRadio.id !== -1) {
      // console.log("iffffff");
      const index = props.pageData.options
        .map((opt) => opt.id)
        .indexOf(selectedRadio.id);
      props.pageData.options[index].img =
        props.pageData.radioButtonStates.checked;
      props.pageData.options[index].ariaLabel = `${(props.pageData.options[index].text ? props.pageData.options[index].text:"") + (props.pageData.options[index].optionImg ? props.pageData.options[index].optionImg.altText ? props.pageData.options[index].optionImg.altText: "": "")}, Selected,`
    }
    // window.kcData = window.kcData ? window.kcData : [];
    // window.kcData[props.kcRef] = window.kcData[props.kcRef]
    //   ? window.kcData[props.kcRef]
    //   : {};
    // window.kcData[props.kcRef] = formData;
  };

  const unCheckAllOptions = () => {
    trace("unCheckAllOptions");
    props.pageData.options.forEach((option) => {
      option.img = props.pageData.radioButtonStates.unChecked;
      option.ariaLabel = `${(option.text ? option.text:"") + (option.optionImg ? option.optionImg.altText ? option.optionImg.altText: "": "")}, Unselected,`;
    });
  };

  const onMouseOverHandler = (selectedRadio) => {
    trace("onMouseOverHandler");
    setFormData((prev) => {
      return { ...prev, isMouseHover: true };
    });

    unCheckAllOptions();

    if (formData.ans !== -1) {
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

    // console.log(props.pageData.options[index2].img);
    // console.log(props.pageData.radioButtonStates.hover);

    props.pageData.options[index2].img = props.pageData.radioButtonStates.hover;
  };

  const onMouseOutHandler = () => {
    trace("onMouseOutHandler");
    setFormData((prev) => {
      return { ...prev, isMouseHover: false };
    });

    unCheckAllOptions();

    if (formData.ans !== -1) {
      const index1 = props.pageData.options
        .map((opt) => opt.id)
        .indexOf(formData.ans);
      props.pageData.options[index1].img =
        props.pageData.radioButtonStates.checked;
      props.pageData.options[index1].ariaLabel = `${(props.pageData.options[index1].text ? props.pageData.options[index1].text:"") + (props.pageData.options[index1].optionImg ? props.pageData.options[index1].optionImg.altText ? props.pageData.options[index1].optionImg.altText: "": "")}, Selected,`
    }
  };

  const onFormSubmit = (event) => {
    trace("onFormSubmit");
    event.preventDefault();

    let windowObj = getCommonWindowObj();
    windowObj.knowledgeCheckUserSelection[props.kcRef][
      formData.isChallengeQuestion
    ] = formData.ans;
    setCommonWindowObj(windowObj);

    const result = props.pageData.options.some((option) => {
      // console.log(option.id , formData.ans, option.correct)
      return option.correct && option.id === formData.ans;
    });
    //  console.log(result)

    setFormData((prev) => {
      return {
        ...prev,
        attempt: formData.attempt + 1,
        correctStatus: result,
        isAttempted: true,
        isAnsSubmit: true,
        isSubmitEnable: false,
      };
    });

    trace(formData.attempt);
    if (result || formData.attempt >= 1) {
      trace("if");

      let windowObj = getCommonWindowObj();
      windowObj.knowledgeCheckQuestionStatus[props.kcRef][
        formData.isChallengeQuestion
      ] = 1;
      setCommonWindowObj(windowObj);
    } else {
      trace("else");

      let windowObj = getCommonWindowObj();
      windowObj.knowledgeCheckQuestionStatus[props.kcRef][
        formData.isChallengeQuestion
      ] = 0;
      setCommonWindowObj(windowObj);
    }

    windowObj = getCommonWindowObj();
    windowObj.knowledgeCheckUserAttempt[props.kcRef][
      formData.isChallengeQuestion
    ] = formData.attempt + 1;
    windowObj.knowledgeCheckCorrectStatus[props.kcRef][
      formData.isChallengeQuestion
    ] = result;
    setCommonWindowObj(windowObj);

    props.onUpdateResult(result, formData.attempt + 1);
    const index1 = props.pageData.options
      .map((opt) => opt.id)
      .indexOf(formData.ans);
    props.pageData.options[index1].img = result
      ? props.pageData.radioButtonStates.correct
      : props.pageData.radioButtonStates.incorrect;
    // if(res)
    if (formData.attempt === 1 && !result) {
      const index = props.pageData.options
        .map((opt) => opt.correct)
        .indexOf(true);

      props.pageData.options[index].img =
        props.pageData.radioButtonStates.correct;
    }
    if (formData.isChallengeQuestion && formData.attempt === 0 && !result) {
      props.updateHintClicked(true);
    }
  };

  const onTryAgain = (event) => {
    trace("onChallengeQuestion");
    props.onChallengeQuestion();
    unCheckAllOptions();

    const windowObj = getCommonWindowObj();

    windowObj.knowledgeCheckCorrectStatus[props.kcRef][
      formData.isChallengeQuestion
    ] = "NA";
    windowObj.knowledgeCheckUserSelection[props.kcRef][
      props.isChallengeQuestion
    ] = -1;
    if (!windowObj.isChallengeQuestion) windowObj.isChallengeQuestion = [];
    windowObj.isChallengeQuestion[props.kcRef] = 1;
    // windowObj.knowledgeCheckUserAttempt[props.kcRef][1] = 1;

    console.log("is challenge ques", windowObj.isChallengeQuestion);
    setCommonWindowObj(windowObj);

    setFormData((prev) => {
      return { ...prev, isAttempted: false, isAnsSubmit: false, ans: -1 };
    });
  };
  const onReset = (event) => {
    trace("onReset");
    unCheckAllOptions();

    const windowObj = getCommonWindowObj();

    windowObj.knowledgeCheckCorrectStatus[props.kcRef][
      formData.isChallengeQuestion
    ] = "NA";
    windowObj.knowledgeCheckUserSelection[props.kcRef][
      props.isChallengeQuestion
    ] = -1;
    setCommonWindowObj(windowObj);

    setFormData((prev) => {
      return { ...prev, isAttempted: false, isAnsSubmit: false, ans: -1 };
    });
  };
  const onHint = (event) => {
    // console.log('onHint')
    setHintClicked(true);

    let windowObj = getCommonWindowObj();
    windowObj.knowledgeCheckHintClicked[props.kcRef] = true;
    setCommonWindowObj(windowObj);

    props.updateHintClicked(true);
    props.onHint();
  };
  const onChallengeQuestion = (event) => {
    trace("onChallengeQuestion");
    props.onChallengeQuestion();
  };


  const returnTickOrWrong = (id, bool = false) => {
    trace("returnTickOrWrong");
    // console.log(id)
    let correctIncorrectImg, correctIncorrectAriaLabel;
    for (let i = 0; i < props.pageData.options.length; i++) {
      if (bool) {
        if (props.pageData.options[i].correct) {
          correctIncorrectImg = props.pageData.options[i].correct
            ? imagePath("core/tickSymbol.svg")
            : imagePath("core/wrongSymbol.svg");
          correctIncorrectAriaLabel = `Right Answer,`;
          break;
        }
      } else {
        if (formData.ans === props.pageData.options[i].id) {
          correctIncorrectImg = props.pageData.options[i].correct
            ? imagePath("core/tickSymbol.svg")
            : imagePath("core/wrongSymbol.svg");
          correctIncorrectAriaLabel = props.pageData.options[i].correct
            ? `Right Answer,`
            : `Wrong Answer,`;
          break;
        }
      }
    }

    return (
      <>
        <img
          aria-Hidden={true}
          draggable={false}
          // alt='Image1'
          // aria-label={correctIncorrectAriaLabel}
          src={correctIncorrectImg}
          className='correct-incorrect-tick-img'
        />
        {
          <span 
            className='answer-label'
            aria-hidden={false}
            tabIndex='-1'
          >
          {correctIncorrectAriaLabel}
        </span>}
      </>
    );
  };

  // console.log(hintClicked)
  return (
    <div>
      <div className={classList}>
        {props.pageData.question && (
          <div className='mcss-comp-heading bodyMediumSubHeading'>
            {Parser(props.pageData.question)}
          </div>
        )}
        <div 
          className={`${
            formData.isAttempted ? "radio-btn-set-2" : "radio-btn-set-1"
          }`}
          style={{display:'table'}}
          disabled={true}
          tabIndex={'-1'}
        >
          <div>
            {props.pageData.options.map((option, index) => {
              // console.log(option, index, 'return', formData.ans)
              return (
                <div key={`option_${index}`}
                  style={{display:'table-row'}}
                >
                  <div
                    aria-hidden={false}
                    style={{display:'table-cell'}}
                    className='align-top'>
                    {formData.isAttempted &&
                      (formData.attempt === 1
                        ? option.id === formData.ans &&
                          returnTickOrWrong(option.id)
                        : option.id === formData.ans
                        ? returnTickOrWrong(option.id)
                        : option.correct
                        ? returnTickOrWrong(option.id, true)
                        : "")}
                  </div>
                  <div className='align-top'
                    style={{display:'table-cell'}}
                  >
                    <CustomButton
                      type='icon'
                      url={imagePath(option.img)}
                      className={`radio-btn-comp ${
                        formData.isAttempted ? "radio-btn-comp-disable" : ""
                      }`}
                      onMouseOut={onMouseOutHandler}
                      onMouseOver={onMouseOverHandler.bind(this, option)}
                      onClick={onClickHandler.bind(this, option)}
                      aria-hidden={false}
                      ariaLabel={option.ariaLabel}
                      // ariaLabel={(option.text ? option.text:"") + (option.optionImg ? option.optionImg.altText ? option.optionImg.altText: "": "")}
                      tabIndex={formData.isAttempted ? "-1" : "0"}
                      disabled={formData.isAttempted ? true : false}
                    />
                  </div>
                  <div>
                    <div 
                      tabIndex='-1'
                      disabled={formData.isAttempted ? true : false}
                    >
                    </div>
                    {option.text && (
                      <label
                        className={`mcss-form-comp-radio-label bodyNormalSubHeading ${
                          formData.isAttempted
                            ? "mcss-form-comp-radio-label-disable"
                            : ""
                        }`}
                        htmlFor={option.text}
                        onMouseOut={onMouseOutHandler}
                        onMouseOver={onMouseOverHandler.bind(this, option)}
                        onClick={onClickHandler.bind(this, option)}
                        disabled={formData.isAttempted ? true : false}
                        aria-hidden={true}
                      >
                        {Parser(option.text)}
                      </label>
                    )}
                    {option.optionImg && (
                      <img
                        draggable={false}
                        className={`option-image`}
                        src={imagePath(option.optionImg.src)}
                        aria-hidden={true}
                        title={
                          option.optionImg.altText
                            ? option.optionImg.altText
                            : ""
                        }
                        alt={
                          option.optionImg.altText
                            ? option.optionImg.altText
                            : ""
                        }
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
            btnTitle='Submit selected answer'
            onClick={onFormSubmit}
            aria-label={"Submit"}
            ariaHidden={false}
            tabIndex={formData.isSubmitEnable ? 0 : -1}
            disabled={formData.isSubmitEnable ? false : true}
          />
          {!formData.isChallengeQuestion &&
            formData.isAttempted &&
            !formData.correctStatus &&
            formData.attempt === 1 &&
            hintClicked && (
              <CustomButton
                className='mcss-form-comp-button bodyButtonLabel tryAgainButton'
                id='TryAgain'
                title='Try Again'
                onClick={onTryAgain}
                aria-label={"TryAgain"}
              />
            )}
          {formData.isAttempted &&
            !formData.correctStatus &&
            formData.attempt === 1 &&
            !hintClicked && (
              <CustomButton
                className='mcss-form-comp-button bodyButtonLabel resetButton'
                id='Reset'
                title='Reset'
                onClick={onReset}
                aria-label={"Reset"}
                btnTitle='Reset answer choices'
              />
            )}
          {formData.isAttempted &&
            !formData.correctStatus &&
            formData.attempt === 1 && (
              <CustomButton
                className='mcss-form-comp-button bodyButtonLabel'
                id='Hint'
                btnTitle='Show the assessment hint'
                title='Hint'
                onClick={onHint}
                aria-label={"Hint"}
              />
            )}
        </div>
        {/* <MCSSForm
          pageData={props.pageData}
          currentQue={props.currentQue}
          totalQues={props.totalQues}
          onLoadNextQue={props.onLoadNextQue}
          onUpdateResult={props.onUpdateResult}
          onFormSubmit={formSubmitHandler}
        /> */}
      </div>
      <div className={rightZoomClass}>
        {props.pageData.imageData && (
          <div>
            <Image pageData={props.pageData.imageData} />
            <div style={{ margin: "5px" }}>
              {Parser(
                props.pageData.imageData.textAfter
                  ? props.pageData.imageData.textAfter
                  : ""
              )}
            </div>
          </div>
        )}
        {props.pageData.dataTable && (
          <div>
            <DataTable
              pageData={props.pageData.dataTable}
              isAssessment={false}
            />
            <div style={{ margin: "5px" }}>
              {Parser(
                props.pageData.dataTable.textAfter
                  ? props.pageData.dataTable.textAfter
                  : ""
              )}
            </div>
          </div>
        )}
        {props.pageData.feedbackData &&
          getCommonWindowObj().knowledgeCheckUserSelection[props.kcRef][
            formData.isChallengeQuestion
          ] !== -1 &&
          formData.isAnsSubmit &&
          (getCommonWindowObj().knowledgeCheckUserAttempt[props.kcRef][
            formData.isChallengeQuestion
          ] === 2 ||
            formData.correctStatus) && (
            <Feedback pageData={props.pageData.feedbackData} />
          )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zoomIndex: state.zoomIndex,
    hintClicked: state.hintClicked,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateHintClicked: (data) =>
      dispatch({
        type: "UPDATE_HINT_CLICKED",
        payload: data,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KC);
