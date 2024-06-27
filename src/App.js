import React, { Suspense } from "react";
import { Provider } from "react-redux";
import ScormProvider from "react-scorm-provider-v2";
import FontPreloader from "./components/FontPreloader";
import MainContainer from "./containers/MainContainer/MainContainer";
import store from "./store";
import "./App.css";

const App = () => {
  return (
    <Suspense fallback={<div className='loader'></div>}>
      <Provider store={store}>
        <ScormProvider debug={process.env.NODE_ENV !== "production"}>
          <FontPreloader />
          <MainContainer />
        </ScormProvider>
      </Provider>
    </Suspense>
  );
};

export default App;
