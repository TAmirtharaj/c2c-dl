import "./TextEditor.css";
import { useEffect, useState } from "react";
import Parser from "html-react-parser";
import { withScorm } from "react-scorm-provider-v2";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";
// import { imagePath } from "../helper/Helper";
import {
  convertToRaw,
  EditorState,
  Modifier,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { stateFromHTML } from "draft-js-import-html";
import { getCommonWindowObj, setCommonWindowObj } from "../helper/Helper";

const replaceArray = [
  "<p>",
  "&nbsp;",
  "</p>",
  "<sup>",
  "</sup>",
  "<sub>",
  "</sub>",
  "\n",
];
const TextEditor = (props) => {
  // console.log(Symbol);
  const [editorState, setEditorState] = useState("");
  const [currentChars, setCurrentChars] = useState(0);
  const [emojiButton, setEmojiButton] = useState(true);
  const screenId = `textEditor_${props.page}_${props.id}`;
  const [hideToolBar, setHideToolBar] = useState(true);
  // console.log("screen id inside the text editor is here", screenId);

  // const textEditor = document.querySelector(
  //   `.textEditor_${props.page}_${props.id}`
  // );
  // if (textEditor) {
  //   const editorBox = textEditor.querySelector(".public-DraftStyleDefault-ltr");
  //   if (editorBox) {
  //     console.log("editor box", editorBox);
  //     editorBox.style.textAlign = "center";
  //   }
  // }
  let tabledata = "";
  let windowObj = getCommonWindowObj();
  if (
    !windowObj[screenId] ||
    windowObj[screenId] === undefined ||
    (windowObj[screenId] &&
      Object.keys(windowObj[screenId]).length === 0 &&
      Object.getPrototypeOf(windowObj[screenId]) === Object.prototype)
  ) {
    windowObj[screenId] = {};
    setCommonWindowObj(windowObj);
  }

  if (props.sco.apiConnected) {
    const scromData = props.sco.suspendData;
    const suspendData = scromData[props.page];
    tabledata =
      suspendData && suspendData.tableData && suspendData.tableData[screenId]
        ? suspendData.tableData[screenId]
        : "";
    // console.log(" suspendData.tableData:", suspendData, screenId, tabledata);

    // if (!window.editorData) window.editorData = [];
    // if (!window.editorData[screenId]) window.editorData[screenId] = "";
    // window.editorData[screenId] = tabledata;

    let windowObj = getCommonWindowObj();
    if (windowObj.editorData && windowObj.editorData[screenId]) {
      tabledata = windowObj.editorData[screenId];
    } else {
      if (!windowObj.editorData) windowObj.editorData = [];
      if (!windowObj.editorData[screenId]) windowObj.editorData[screenId] = "";
      windowObj.editorData[screenId] = tabledata;
    }

    setCommonWindowObj(windowObj);
  } else {
    let windowObj = getCommonWindowObj();
    if (
      windowObj[props.page] &&
      windowObj[props.page].tableData &&
      windowObj[props.page].tableData[screenId]
    ) {
      // console.log(
      //   "window data data",
      //   screenId,
      //   window[props.page].tableData[screenId]
      // );
      // console.log("editor state ", window[screenId]);
      tabledata = windowObj[props.page].tableData[screenId]
        ? windowObj[props.page].tableData[screenId]
        : "";
    }
  }

  const RDWwrapper = document.querySelectorAll(".rdw-editor-main");
  if (RDWwrapper && props.inputFieldType !== "editorLite") {
    RDWwrapper.forEach((item) => {
      item.style.height = "42vh";
      item.style.overflow = "auto";
      // item.style.padding = "5px";
      item.style.overflowX = "hidden";
    });
  }

  const draftEditor = document.querySelector(".DraftEditor-root");
  if (draftEditor) {
    draftEditor.style.height = "auto";
  }
  useEffect(() => {
    const RDWwrapper = document.querySelectorAll(".rdw-editor-wrapper");
    if (RDWwrapper) {
      RDWwrapper.forEach((item) => {
        item.style.height = "98%";
        item.style.overflow = "hidden";
        item.setAttribute('aria-hidden','true')
      });
    }
    const draftEditor = document.querySelectorAll(".DraftEditor-root");
    if (draftEditor) {
      draftEditor.forEach((item) => {
        item.style.height = "auto";
      });
    }
    const publicDraftEditorcontent = document.querySelectorAll(".public-DraftEditor-content");
    if (publicDraftEditorcontent) {
      publicDraftEditorcontent.forEach((item) => {
        item.ariaLabel = "";
        item.removeAttribute('aria-Label')
      });
    }

    // setCurrentChars()

    const innerContent = tabledata
      .replaceAll("<p>", "")
      .replaceAll("&nbsp;", " ")
      .replaceAll("</p>", "")
      .replaceAll("<sup>", "")
      .replaceAll("</sup>", "")
      .replaceAll("<sub>", "")
      .replaceAll("</sub>", "")
      // .replaceAll("\n", "");
    // console.log("current char", currentChars, innerContent.length);
    setCurrentChars(innerContent.length);
    // const emojiWrapper = document.querySelector(".rdw-emoji-wrapper");
    // if (emojiWrapper) {
    //   if (!emojiButton) {
    //     emojiWrapper.classList.add("disable");
    //   } else if (emojiWrapper.classList.contains("disable")) {
    //     console.log("here");
    //     emojiWrapper.classList.add("disable");
    //   }
    // }
    const emojiWrapper = document
      .querySelector(`.textEditor_${props.page}_${props.id}`)
      .parentElement.querySelector(".rdw-emoji-wrapper");

    if (emojiWrapper) emojiWrapper.classList.remove("disable");

    // console.log(
    //   "here inside the text editor",
    //   emojiWrapper,
    //   innerContent.length,
    //   props.maxLength
    // );
    if (innerContent.length >= props.maxLength) {
      if (emojiWrapper) emojiWrapper.classList.add("disable");
    }

    if (tabledata !== "" && tabledata !== " ") {
      const blocksFromHtml = htmlToDraft(tabledata);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
    const editorText = document.querySelectorAll(".notranslate");
    if (editorText && props.inputFieldType === "editorLite") {
      editorText.forEach((item) => {
        // item.childNodes[0].style.display = "flex";
        // item.childNodes[0].style.paddingLeft = "12px";
        // item.childNodes[0].style.paddingRight = "10px";
        item.childNodes[0].style.alignItems = "flex-end";
        item.childNodes[0].style.wordBreak = "break-word";
      });
    }

    // setHideToolBar(false);
  }, []);

  const onChange = (e) => {
    const editorText = document.querySelectorAll(".notranslate");
    // if (editorText && props.inputFieldType === "editorLite") {
    //   editorText.forEach((item) => {
    //     item.childNodes[0].style.display = "flex";
    //     item.childNodes[0].style.alignItems = "flex-end";
    //     item.childNodes[0].style.wordBreak = "break-word";
    //   });
    // }

    const innerContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    )
      .replaceAll("<p>", "")
      .replaceAll("&nbsp;", " ")
      .replaceAll("</p>", "")
      .replaceAll("<sup>", "")
      .replaceAll("</sup>", "")
      .replaceAll("<sub>", "")
      .replaceAll("</sub>", "")
      .replaceAll("<br>", "")
      // .replaceAll("\n", "");
    // console.log("current char", currentChars, innerContent);
    setCurrentChars(innerContent.length-1);

    let emojiWrapper;
    if (document.querySelector(`.textEditor_${props.page}_${props.id}`))
      emojiWrapper = document
        .querySelector(`.textEditor_${props.page}_${props.id}`)
        .parentElement.querySelector(".rdw-emoji-wrapper");

    if (emojiWrapper) emojiWrapper.classList.remove("disable");

    // const imageBtn = document
    //   .querySelector(`.textEditor_${props.page}_${props.id}`)
    //   .parentElement.querySelector(".rdw-image-wrapper");

    if (innerContent.length >= props.maxLength)
      if (emojiWrapper) emojiWrapper.classList.add("disable");
    // if (!props.charCount) {
    //   if (innerContent.length > 1) {
    //     imageBtn.style.visibility = "hidden";
    //   } else {
    //     imageBtn.style.visibility = "hidden";
    //     // imageBtn.style.visibility = "inherit";
    //   }
    // }

    // if (!window.editorData) window.editorData = [];
    // if (!window.editorData[screenId]) window.editorData[screenId] = "";
    // window.editorData[screenId] = draftToHtml(
    //   convertToRaw(editorState.getCurrentContent())
    // );

    let windowObj = getCommonWindowObj();
    windowObj = getCommonWindowObj();
    if (!windowObj.editorData) windowObj.editorData = [];
    if (!windowObj.editorData[screenId]) windowObj.editorData[screenId] = "";
    windowObj.editorData[screenId] = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setCommonWindowObj(windowObj);

    windowObj = getCommonWindowObj();
    console.log("data recived from widnow obj:", windowObj.editorData);
    // windowObj[screenId] = editorState;
    windowObj[screenId] = editorState;
    setCommonWindowObj(windowObj);
    // if (innerContent.length >= props.maxLength) {
    //   return "handled";
    // }
  };

  function urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }

  async function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        resolve(reader.result);
      };
      var convertTofile = new File([file], "image");
      reader.readAsDataURL(convertTofile);
    });
  }

  const uploadImageCallBack = async (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onloadend = async () => {
        const mimeType = reader.result.split(":")[1].split(";")[0];
        const fileConverted = await urltoFile(reader.result, "image", mimeType);
        let convertTofile = new File([fileConverted], "image");
        const compressedFile = await getBase64(convertTofile);
        resolve({ data: { link: compressedFile, src: compressedFile } });
      };
      return reader.readAsDataURL(file);
    });
  };

  const stateChangeFun = (newState) => {
    setEditorState(newState);
  };

  const handleBeforeInput = (input) => {
    if (true) {
      const plainText = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      )
        .replaceAll("<p>", "")
        .replaceAll("&nbsp;", " ")
        .replaceAll("</p>", "")
        .replaceAll("<sup>", "")
        .replaceAll("</sup>", "")
        .replaceAll("<sub>", "")
        .replaceAll("</sub>", "")
        .replaceAll("<br>", "")
        .replaceAll("\n", "");
      // console.log(
      //   "handled",
      //   plainText,
      //   draftToHtml(convertToRaw(editorState.getCurrentContent())),
      //   plainText.length,
      //   props.maxLength
      // );
      const emojiWrapper = document
        .querySelector(`.textEditor_${props.page}_${props.id}`)
        .parentElement.querySelector(".rdw-emoji-wrapper");
      if (emojiWrapper) emojiWrapper.classList.remove("disable");
      if (plainText.length >= props.maxLength) {
        if (emojiWrapper) emojiWrapper.classList.add("disable");

        setEmojiButton(false);
        return "handled";
      }

      return "not-handled";
      // setCurrentChars(plainText.length);
    }
  };

  // const toolArr = ["emoji", "inline", "image"];
  const toolArr = ["emoji", "inline"];

  // if (true) {
  //   toolArr.splice(2, 1);
  // }

  // const onBlur = (e) => {
  //   // console.log("im blured", e);
  //   const editor = document.getElementById(props.id)
  //     ? document.getElementById(props.id).querySelector(".toolbar-class")
  //     : null;

  //   // console.log(editor);
  //   if (editor !== null) {
  //     editor.style.visibility = "hidden";
  //   }
  // };

  const handlePastedText = (pastedText, html, editorState) => {
    if (props.maxLength) {
      const currentContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      )
        .replaceAll("<p>", "")
        .replaceAll("&nbsp", " ")
        .replaceAll("</p>", "")
        .replaceAll("<sup>", "")
        .replaceAll("</sup>", "")
        .replaceAll("<sub>", "")
        .replaceAll("</sub>", "")
        // .replaceAll("\n", "");
      const currentContentLength = currentContent.length;

      if (currentContentLength + pastedText.length > props.maxLength) {
        return "handled";
      }
      return "not-handled";

      // setCurrentChars(plainText.length);
    }
  };

  function onFocus() {
    setHideToolBar(false);
  }

  function onBlur() {
    setHideToolBar(true);
    console.log("on blur method called--------------->");
    console.log(
      "found window obj in blur method",

      windowObj.editorData
    );
  }
  const myHandleReturn = (e) => {
    // console.log("my hanlde return", e);
    const plainText = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      .replaceAll("<p>", "")
      .replaceAll("&nbsp;", " ")
      .replaceAll("</p>", "")
      .replaceAll("<sup>", "")
      .replaceAll("</sup>", "")
      .replaceAll("<sub>", "")
      .replaceAll("</sub>", "")
      .replaceAll("<br>", "")
      .replaceAll("\n", "");

    if (plainText.length >= props.maxLength) return true;
  };
  return (
    <>
      <Editor
        toolbar={{
          options: [...toolArr],
          inline: {
            options: ["superscript", "subscript"],
          },
          // image: {
          //   icon: "public/images/core/Symbol.svg",

          //   className: undefined,
          //   component: undefined,
          //   popupClassName: undefined,
          //   urlEnabled: true,
          //   uploadEnabled: true,
          //   alignmentEnabled: false,
          //   uploadCallback: uploadImageCallBack,
          //   previewImage: true,
          //   inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
          //   alt: { present: false, mandatory: false },
          //   defaultSize: {
          //     height: props.defaultImgHeight ? props.defaultImgHeight : "50px",
          //     width: props.defaultImgWidth ? props.defaultImgWidth : "100px",
          //   },
          // },
          emoji: {
            icon: "./images/core/Symbol.svg",
            title: "symbols",
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            emojis: ["©", "®", "√"],
          },
        }}
        // editorRef={setEditorReference}
        id={props.id}
        editorClassName={`${
          props.className ? props.className : ""
        } text-editor customScrollbar editor-class textEditor_${props.page}_${
          props.id
        }`}
        // textAlignment={props.alignText ? props.alignText : "left"}
        readOnly={props.disabled}
        placeholder={props.placeholder}
        tabIndex='1'
        handleReturn={myHandleReturn}
        onFocus={onFocus}
        wrapperClassName='wrapper-class'
        // editorClassName='editor-class'
        toolbarClassName='toolbar-class'
        // defaultValue={props.defaultValue}
        // editorRef={setEditorReference}\stripPastedStyles
        stripPastedStyles={true}
        onBlur={onBlur}
        editorState={editorState}
        onEditorStateChange={stateChangeFun}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
        handlePastedText={handlePastedText}
        toolbarHidden={
          props.inputFieldType !== "editorLite"
            ? false
            : props.disabled
            ? true
            : hideToolBar
        }
      />
      {props.charCount ? (
        <span
          className={`character-count ${props.characterCountClass}`}
        ><span aria-hidden='true'>{`${currentChars} / ${props.maxLength}`}</span>
        <span className='character-count-label'>{`Character limit, ${currentChars} out of ${props.maxLength}`}</span>
        </span>
      ) : (
        ""
      )}
    </>
  );
};

export default withScorm()(TextEditor);
