import "./Input.css";
import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";

const Input = (props) => {
  // const inputField = props.inputType === "input" ? "input" : "textarea";
  const inputField = props.inputType ? props.inputType : "input";
  // console.log("at beginning ", props);
  let toolBarFlag = false;
  const textAreaChangehandler = (e) => {
    if (e.target.value.length) {
      const length = e.target.value.length;
      setCurrentChars(length);
    } else setCurrentChars(0);
  };
  useEffect(() => {
    // console.log("useEffect called");

    if (inputField === "editorLite") {
      setEditorStyle();
      const editorEle = document.getElementById(props.id);

      if (editorEle) {
        editorEle.style.position = "relative";
        if (editorEle.querySelector(".toolbar-class")) {
          editorEle.querySelector(".toolbar-class").style.position = "absolute";
          editorEle.querySelector(".toolbar-class").style.top = "-32px";
          editorEle.querySelector(".toolbar-class").style.zIndex = "10";
          editorEle.querySelector(".toolbar-class").style.width = "120px";
        }
        editorEle.addEventListener("click", clickHanlder);
        // document.addEventListener("click", documentCLickHanlder);
      }
    }
  });
  const [currentChars, setCurrentChars] = useState(
    props.defaultValue
      ? props.defaultValue.replace(/(\r\n|\n|\r)/gm, "").length
      : 0
  );

  const clickHanlder = () => {
    console.log("im clickrd", document.querySelectorAll(".toolbar-class"));
    const editor = document
      .getElementById(props.id)
      .querySelector(".toolbar-class");

    document.querySelectorAll(".toolbar-class").forEach((item) => {
      if (!item.closest(".question-body")) item.style.visibility = "hidden";
    });

    if (editor && editor.style.visibility !== "visible") {
      // console.log(document.getElementsByClassName(".data-table-inputboxes"));
      toolBarFlag = !toolBarFlag;
      editor.style.visibility = toolBarFlag ? "visible" : "hidden";
      editor.style.visibility = "visible";
    } else {
      if (editor && !editor.closest(".question-body"))
        editor.style.visibility = "hidden";
    }
  };

  const setEditorStyle = () => {
    // console.log(document.getElementById(props.id));

    const editor = document.getElementById(props.id)
      ? document.getElementById(props.id).querySelector(".toolbar-class")
      : null;

    if (editor !== null) {
      if (!editor.closest(".question-body")) editor.style.visibility = "hidden";
    }
  };

  // document.getElementById(props.id).addEventListener("click",clickHanlder)
  if (inputField === "input") {
    console.log("input");
    return (
      <input
        id={props.id}
        key={props.id}
        type='text'
        defaultValue={props.defaultValue}
        maxLength={props.maxLength}
        className={`${props.className} input-component`}
        disabled={props.disabled}
        data-type={props.dtype}
        onChange={props.onChange}
        tabIndex={props.tabIndex}
      ></input>
    );
  } else if (inputField === "editor") {
    return (
      <TextEditor
        sco={props.sco}
        id={props.id}
        page={props.page}
        placeholder={props.placeholder}
        tabIndex={props.tabIndex}
        maxLength={props.maxLength}
        alignText={props.alignText}
        enableImages={false}
        charCount={true}
        disabled={props.disabled}
        className={`${props.className ? props.className : ""} `}
      ></TextEditor>
    );
  } else if (inputField === "editorLite") {
    return (
      <TextEditor
        id={props.id}
        page={props.page}
        sco={props.sco}
        alignText={props.alignText}
        inputFieldType={inputField}
        placeholder={props.placeholder}
        tabIndex={props.tabIndex}
        className={`${props.className ? props.className : ""} editorLite `}
        maxLength={props.maxLength}
        enableImages={true}
        disabled={props.disabled}
        charCount={false}
        defaultImgHeight={
          props.defaultImgHeight ? props.defaultImgHeight : "auto"
        }
        defaultImgWidth={props.defaultImgWidth ? props.defaultImgWidth : "auto"}
        // onClick={clickHanlder}
      ></TextEditor>
    );
  } else {
    return (
      <div className='text-area-with-character-count'>
        <textarea
          id={props.id}
          className={`${props.className} textarea-component customScroll`}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          onChange={textAreaChangehandler}
          tabIndex={props.tabIndex}
        ></textarea>
        <span
          className={`character-count ${props.characterCountClass}`}
        >{`${currentChars} / ${props.maxLength}`}</span>
      </div>
    );
  }
};

export default Input;
