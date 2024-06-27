/** @format */

import { useState, useEffect, useRef } from "react";
import { withScorm } from "react-scorm-provider-v2";
import { Col, CloseButton } from "react-bootstrap";
import { connect } from "react-redux";
import {
  getCommonWindowObj,
  getImgLoadedCount,
  getImgRefCount,
  labNoteBookZoomLineheight,
  setCommonWindowObj,
  setImgLoadedCount,
  setImgRefCount,
  storeLabNotebookPagesDataToScorm,
} from "../helper/Helper";
import { useSelector } from "react-redux";
import $ from "jquery";
import "./UploadFiles.css";
import axios from "axios";
import { IMAGE_UPLOAD, IMAGE_READ } from "./imageUploadLinks";

const UploadFiles = (props) => {
  let imageData, hasLabNotebookSubmitted, fileId;
  const zoomIndex = useSelector((state) => state.zoomIndex);
  const imgLoadedVar = useSelector((state) => state.imgLoadedArray);
  let imageUploadUrl;
  let windowObj = getCommonWindowObj();
  const [imgFileId, setFileId] = useState(null);
  const [loader, setLoader] = useState(false);
  const isPrintPage = useSelector((state) => state.isPrintPage);
  const serialNumberData = props.pageData.sr ? props.pageData.sr : 0;
  const screenId = `uploadedImg_${props.page}_${serialNumberData}`;
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();

  function uploadFileHandler(event) {
    if (!hasLabNotebookSubmitted) {
      document.getElementById(`getFile_${serialNumberData}`).click();
    }
  }

  useEffect(() => {
    props.updateImageLoaderBool(false);
  }, [imgFileId]);

  // loader;
  // useEffect(() => {
  //   props.updateImageLoaderBool(false);
  // }, [imgFileId]);

  const setImageRef = (_imageData, _fileId) => {
    console.log(_imageData, "_imageData");
    console.log(_fileId, "_fileId");
    const img = document.querySelector(
      `#imageData_${props.page}_${serialNumberData}`
    );
    console.log(img, "img");
    if (img) {
      img.src = _imageData;
      setFileId(_fileId);
    } else {
      if (!windowObj.uploadImgData) windowObj.uploadImgData = [];
      if (!windowObj.uploadImgData[screenId])
        windowObj.uploadImgData[screenId] = "";
      windowObj.uploadImgData[screenId] = _fileId;
    }
  };

  useEffect(() => {
    windowObj = getCommonWindowObj();
    if (props.sco.apiConnected) {
      imageUploadUrl = props.sco.get("CSO_USER_CONTENT_FILES_BASE_URL");
      const scormData = props.sco.suspendData;
      const scormImageData =
        scormData &&
        scormData[props.page] &&
        scormData[props.page].mainImageData &&
        scormData[props.page].mainImageData[screenId]
          ? scormData[props.page].mainImageData[screenId]
          : "";

      if (
        (!windowObj.uploadImgDataFile ||
          !(
            windowObj.uploadImgDataFile && windowObj.uploadImgDataFile[screenId]
          ) ||
          !(
            windowObj.uploadImgDataFile &&
            windowObj.uploadImgDataFile[screenId] === ""
          )) &&
        scormImageData
      ) {
        setImgRefCount(getImgRefCount() + 1);
        setImageRef(null, scormImageData);
        props.updateImageLoaderBool(true);
        setLoader(true);

        axios
          .get(IMAGE_READ + scormImageData)
          .then((response) => {
            console.log("INSIDE_READ", response);
            const responseData = response.data;
            const fileName = responseData.file_content;

            setIsVisible(true);
            imageData = fileName;
            setLoader(false);
            props.updateImageLoaderBool(false);
            if (!windowObj.uploadImgDataFile) windowObj.uploadImgDataFile = [];
            if (!windowObj.uploadImgDataFile[screenId])
              windowObj.uploadImgDataFile[screenId] = fileName;
            setTimeout(() => {
              setImageRef(imageData, scormImageData);
              setImgLoadedCount(getImgLoadedCount() + 1);
            }, 300);
          })
          .catch((error) => {
            console.error("Error loading image:", error);
            setLoader(false);
            props.updateImageLoaderBool(false);
          });
      } else if (
        windowObj.uploadImgDataFile &&
        windowObj.uploadImgDataFile[screenId] &&
        windowObj.uploadImgDataFile[screenId] !== ""
      ) {
        setIsVisible(true);
        imageData = windowObj.uploadImgDataFile[screenId];

        setLoader(false);
        setTimeout(() => {
          setImageRef(
            windowObj.uploadImgDataFile[screenId],
            windowObj.uploadImgData[screenId]
          );
          setImgLoadedCount(getImgLoadedCount() + 1);
        }, 300);
      }
      const hasLabNotebookSubmittedFlag = scormData["hasLabNotebookSubmitted"];
      hasLabNotebookSubmitted = hasLabNotebookSubmittedFlag
        ? hasLabNotebookSubmittedFlag
        : false;
    } else {
      imageData = windowObj[`${props.page}`]
        ? windowObj[`${props.page}`].mainImageDataSrc[serialNumberData]
        : "";
      hasLabNotebookSubmitted = windowObj.hasLabNotebookSubmitted
        ? windowObj.hasLabNotebookSubmitted
        : false;

      if (imageData) {
        setIsVisible(true);
        setImgRefCount(getImgRefCount() + 1);

        setTimeout(() => {
          setImageRef(imageData, null);
          setImgLoadedCount(getImgLoadedCount() + 1);
        }, 300);
      } else {
        setTimeout(() => {
          props.updateImageLoaderBool(false);
        }, 300);
      }
    }
  }, []);

  function uploadedHandler(event) {
    let head = "data:image/png;base64,";
    const file = event.target.files[0];
    console.log("file", file);
    let compressionPara = 0.1;

    const fileSize = file.size;
    if (fileSize <= 350000) {
      compressionPara = 1;
    } else if (fileSize <= 1500000) {
      compressionPara = 0.8;
    } else if (fileSize <= 3000000) {
      compressionPara = 0.5;
    } else if (fileSize <= 7000000) {
      compressionPara = 0.3;
    } else if (fileSize > 7000000) {
      compressionPara = 0.1;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const base64data = reader.result;
      var img = new Image();
      img.src = base64data;
      var base64;
      var dataURL;
      img.onload = async function () {
        let canvas = document.createElement("canvas");
        const originalWidth = img.width;
        const originalHeight = img.height;

        canvas.width = originalWidth;
        canvas.height = originalHeight;

        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, originalWidth, originalHeight);

        const getBase64StringFromDataURL = (dataURL) =>
          dataURL.replace("data:", "").replace(/^.+,/, "");

        dataURL = canvas.toDataURL("image/jpeg", compressionPara);

        base64 = getBase64StringFromDataURL(dataURL);

        if (!props.sco.apiConnected) {
          setIsVisible(true);
          setImageRef(dataURL);
          canvas = null;
        } else {
          props.updateImageLoaderBool(true);

          fileId = "image_data_" + Math.floor(Math.random() * 100000);

          setLoader(true);
          await axios
            .post(IMAGE_UPLOAD, {
              filename: fileId,
              content: base64data,
            })
            .then((response) => {
              const responseData = response.data;
              const bodyObject = JSON.parse(responseData.body);
              const fileName = bodyObject.file_name;
              console.log(fileName, "FileName");

              windowObj = getCommonWindowObj();
              if (!windowObj.uploadImgData) windowObj.uploadImgData = [];
              if (!windowObj.uploadImgData[screenId])
                windowObj.uploadImgData[screenId] = "";
              windowObj.uploadImgData[screenId] = fileName;

              if (!windowObj.uploadImgDataFile)
                windowObj.uploadImgDataFile = [];
              if (!windowObj.uploadImgDataFile[screenId])
                windowObj.uploadImgDataFile[screenId] = "";
              windowObj.uploadImgDataFile[screenId] = dataURL;

              setCommonWindowObj(windowObj);
              storeLabNotebookPagesDataToScorm(
                props.sco,
                windowObj.hasLabNotebookSubmitted,
                props.labNotebookPages
              );
              setIsVisible(true);
              setLoader(false);
              setImageRef(dataURL, fileName);
              props.updateImageLoaderBool(false);
              canvas = null;
            })
            .catch((error) => {
              console.error("Error uploading image:", error);
              setLoader(false);
              props.updateImageLoaderBool(false);
            });
        }
      };
    };
  }

  async function removeUploadedImageHandler(e) {
    imageUploadUrl = props.sco.get("CSO_USER_CONTENT_FILES_BASE_URL");

    if (props.sco.apiConnected) {
      props.updateImageLoaderBool(true);
      setLoader(true);
      await axios
        .delete(IMAGE_UPLOAD, { filename: imgFileId })
        .then((response) => {
          setIsVisible(false);
          setImageRef(null, -1);
          // await axios.delete(IMAGE_UPLOAD, {
          //   filename: imgFileId,
          // });
          let windowObj = getCommonWindowObj();
          windowObj.uploadImgData[screenId] = "";

          if (!windowObj.uploadImgDataFile) windowObj.uploadImgDataFile = [];
          if (!windowObj.uploadImgDataFile[screenId])
            windowObj.uploadImgDataFile[screenId] = "";
          windowObj.uploadImgDataFile[screenId] = "";
          setCommonWindowObj(windowObj);

          storeLabNotebookPagesDataToScorm(
            props.sco,
            windowObj.hasLabNotebookSubmitted,
            props.labNotebookPages
          );
          setLoader(false);
          props.updateImageLoaderBool(false);
        })
        .catch((error) => {
          console.error("Error removing image:", error);
          setLoader(false);
          props.updateImageLoaderBool(false);
        });
    } else {
      setIsVisible(false);
      setImageRef(null, null);
    }
  }

  return (
    <Col className="upload-files-container">
      {!isVisible && loader && <div className="uploaded-image-loader"></div>}
      {!isVisible && !loader && (
        <div
          className={`upload-file-dashed-border ${
            hasLabNotebookSubmitted ? "disabled" : ""
          }`}
          onClick={uploadFileHandler}
        >
          <input
            type="file"
            id={`getFile_${serialNumberData}`}
            data-sr-number={serialNumberData}
            accept={props.pageData.fileType}
            onChange={uploadedHandler}
          />
          <button
            className={`upload-browse-button ${
              hasLabNotebookSubmitted ? "disabled" : ""
            }`}
            disabled={hasLabNotebookSubmitted}
            aria-hidden={hasLabNotebookSubmitted}
            aria-label="Browse to Upload File"
            title="Browse device to upload image"
          >
            Browse
          </button>
          <p className="browse-description">{props.pageData.text}</p>
        </div>
      )}

      {isVisible && !loader && (
        <div className="uploaded-image">
          <div className="file">
            {!hasLabNotebookSubmitted && (
              <button
                aria-hidden={hasLabNotebookSubmitted}
                aria-label="Remove Upload File"
                className="file-close-btn"
                disabled={hasLabNotebookSubmitted}
                onClick={removeUploadedImageHandler}
                title="Remove uploaded image"
              >
                ⨉
              </button>
            )}
            <img
              ref={imgRef}
              draggable={false}
              alt={`imageData_${props.page}_${serialNumberData}`}
              className={`imageData imageData_${serialNumberData}`}
              fileId={imgFileId}
              id={`imageData_${props.page}_${serialNumberData}`}
              style={{
                maxWidth: props.pageData.maxWidth
                  ? props.pageData.maxWidth
                  : "auto",
                maxHeight: props.pageData.maxHeight
                  ? props.pageData.maxHeight
                  : "auto",
              }}
            />
          </div>
        </div>
      )}
    </Col>
  );
};

const mapStateToProps = (state) => {
  return {
    totalPages: state.totalPages,
    imgRefArray: state.imgRefArray,
    imgLoadedArray: state.imgLoadedArray,
    labNotebookPages: state.labNotebookPages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateImageLoaderBool: (data) =>
      dispatch({ type: "UPDATE_IMAGE_LOADER_BOOL", payload: data }),
    updateImgRefArray: (data) => dispatch({ type: "UPDATE_IMG_REF_ARRAY" }),
    updateLoadedRefArray: (data) =>
      dispatch({ type: "UPDATE_IMG_LOADED_ARRAY" }),
  };
};

export default withScorm()(
  connect(mapStateToProps, mapDispatchToProps)(UploadFiles)
);
