/** @format */

import React, { lazy } from "react";

let Component, componentRef;
const returnComponent = (pageData, customizeData = {}) => {
  switch (pageData.type) {
    case "Plain":
      Component = lazy(() => import("../components/PlainText"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
          updatePageStatus={customizeData.updatePageStatus}
          classList={customizeData.classList}
        />
      );
      break;
    case "PlainImage":
      Component = lazy(() => import("../components/PlainImage"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
          updatePageStatus={customizeData.updatePageStatus}
          classList={customizeData.classList}
        />
      );
      break;
    case "Box":
      Component = lazy(() => import("../components/TextWithBox"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
        />
      );
      break;

    case "Image":
      Component = lazy(() => import("../components/ImageWithHeading"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
        />
      );
      break;

    case "ImageWithLabel":
      Component = lazy(() => import("../components/ImageWithLabel"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
        />
      );
      break;

    case "List":
      Component = lazy(() => import("../components/List"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
          classList={customizeData.classList}
        />
      );
      break;

    case "Tab":
      Component = lazy(() => import("../components/Tabs"));
      const InnerComponent = lazy(() => import("../components/TabContent"));

      componentRef = (
        <Component pageData={pageData} key={`${pageData.type}${Math.random()}`}>
          {pageData.tabs.map((tab, index) => {
            return (
              <div label={tab.title} key={`tab_${index}`}>
                <InnerComponent pageData={tab.content} />
              </div>
            );
          })}
        </Component>
      );
      break;

    case "Video":
      Component = lazy(() => import("../components/Video"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
          customizeData={customizeData ? customizeData : null}
        />
      );
      break;

    case "Wrapper":
      Component = lazy(() => import("../components/Wrapper"));
      // console.log(customizeData, "customizeData");
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type} ${Math.random()}`}
          customizeData={customizeData ? customizeData : null}
        />
      );
      break;

    case "MCSS":
      Component = lazy(() => import("../components/MCSS"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type}${Math.random()}`}
          onLoadNextQue={customizeData.loadNextQue}
          onUpdateResult={customizeData.updateResult}
          totalQues={customizeData.totalQues}
          currentQue={customizeData.currentQue}
          updatePageStatus={customizeData.updatePageStatus}
        />
      );
      break;

    case "KC":
      Component = lazy(() => import("../components/KC"));
      componentRef = (
        <Component
          pageData={pageData}
          key={`${pageData.type}${Math.random()}`}
          onLoadNextQue={customizeData.loadNextQue}
          onUpdateResult={customizeData.updateResult}
          onChallengeQuestion={customizeData.onChallengeQuestion}
          onHint={customizeData.onHint}
          totalQues={customizeData.totalQues}
          currentQue={customizeData.currentQue}
          kcRef={customizeData.kcRef}
          updatePageStatus={customizeData.updatePageStatus}
          isChallengeQuestion={customizeData.isChallengeQuestion}
          updateShuffleStatus={customizeData.updateShuffleStatus}
        />
      );
      break;
    case "KCDragAndDrop":
      Component = lazy(() => import("../components/KCDragAndDrop"));
      componentRef = (
        <Component
          pageData={pageData}
          onChallengeQuestion={customizeData.onChallengeQuestion}
          onLoadNextQue={customizeData.loadNextQue}
          onUpdateResult={customizeData.updateResult}
          onHint={customizeData.onHint}
          kcRef={customizeData.kcRef}
          isChallengeQuestion={customizeData.isChallengeQuestion}
          key={`${pageData.type}${Math.random()}`}
        />
      );
      break;

    case "DataTable":
      Component = lazy(() => import("../components/DataTable"));
      componentRef = (
        <Component
          pageData={pageData}
          key={pageData.type + Math.random()}
          page={customizeData.page}
          index={customizeData.index || 0}
        />
      );
      break;

    case "Activity":
      Component = lazy(() => import("../components/Activity"));
      componentRef = <Component pageData={pageData} key={pageData.type} />;
      break;

    case "Notes":
      Component = lazy(() => import("../components/Notes"));
      componentRef = (
        <Component
          pageData={pageData}
          key={pageData.type}
          page={customizeData.page}
          index={customizeData.index || 0}
        />
      );
      break;

    case "TextAndButton":
      Component = lazy(() => import("../components/TextAndButton"));
      componentRef = (
        <Component
          pageData={pageData}
          key={pageData.type}
          onClick={customizeData.onClick}
          updatePageStatus={customizeData.updatePageStatus}
        />
      );
      break;
    case "Button":
      Component = lazy(() => import("../components/CustomButton"));
      componentRef = (
        <Component
          title={pageData.title}
          key={pageData.type}
          onClick={customizeData.onClick}
        />
      );
      break;
    case "UploadFiles":
      Component = lazy(() => import("../components/UploadFiles"));
      componentRef = (
        <Component
          pageData={pageData}
          key={pageData.type}
          page={customizeData.page}
          index={customizeData.index || 0}
        />
      );
      break;

    case "Feedback":
      Component = lazy(() => import("../components/Feedback"));
      componentRef = <Component pageData={pageData} key={pageData.type} />;
      break;

    case "Questions":
      Component = lazy(() => import("../components/Questions"));
      // console.log(customizeData.index, "customizeData index");
      componentRef = (
        <Component
          pageData={pageData}
          key={pageData.type}
          page={customizeData.page}
          index={customizeData.index || 0}
        />
      );
      break;

    case "Print":
      Component = lazy(() => import("../components/Print"));
      componentRef = <Component pageData={pageData} key={pageData.type} />;
      break;

    case "FillInBlank":
      Component = lazy(() => import("../components/FillInTheBlank"));
      componentRef = (
        <Component
          pageData={pageData}
          key={pageData.id}
          updatePageStatus={customizeData.updatePageStatus}
          classList={customizeData.classList}
          page={customizeData.page}
        />
      );

      break;

    case "HoverActivity":
      Component = lazy(() => import("../components/HoverActivity"));
      componentRef = <Component pageData={pageData} key={pageData.type} />;
      break;

    case "Grid":
      Component = lazy(() => import("../components/Grid"));
      componentRef = (
        <Component
          pageData={pageData}
          key={pageData.type}
          page={customizeData.page}
        />
      );
      break;
    default:
      break;
  }

  return componentRef;
};

export { returnComponent };
