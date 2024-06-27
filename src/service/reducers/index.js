/** @format */

const initialState = {
  courseData: null,
  currentSection: 0,
  currentScene: 0,
  currentSubScene: 0,
  visitedArray: [],
  totalPages: 0,
  assessmentStatus: "NA",
  assessmentScore: 0,
  labNotebookPages: 0,
  hasLabNotebookSubmitted: false,
  preLabStatus: false,
  showMenuBool: false,
  showLightBox: false,
  lightBoxData: undefined,
  nextDisable: false,
  assessmentStartedBool: false,
  assessmentScreenNum: 0,
  materialScreenSelectedTab: -1,
  assessmentArray: null,
  zoomIndex: 1,
  hintClicked: false,
  showResourceSideBarBool: false,
  showGlossarySideBarBool: false,
  resourcePages: 0,
  fillInBlank: [],
  hideNavigation: false,
  imageLoaderBool: false,
  isPrintPage: false,
  imgLoadedArray: [],
  imgRefArray: 3,
};

const condition = (state = initialState, action) => {
  // console.log(action.type, action.payload);
  switch (action.type) {
    case "UPDATE_COURSE_DATA":
      return {
        ...state,
        courseData: action.payload,
      };
    case "UPDATE_SECTION":
      return {
        ...state,
        currentSection: action.payload,
      };
    case "UPDATE_SCENE":
      return {
        ...state,
        currentScene: action.payload,
      };
    case "UPDATE_SUB_SCENE":
      return {
        ...state,
        currentSubScene: action.payload,
      };
    case "UPDATE_PAGE_ARRAY":
      return {
        ...state,
        visitedArray: action.payload,
      };
    case "UPDATE_TOTAL_PAGES":
      return {
        ...state,
        totalPages: action.payload,
      };
    case "UPDATE_IMG_REF_ARRAY":
      return {
        ...state,
        imgRefArray: action.payload,
      };
    case "UPDATE_PRELAB_STATUS":
      return {
        ...state,
        preLabStatus: action.payload,
      };
    case "UPDATE_ASSESSMENT_STATUS":
      return {
        ...state,
        assessmentStatus: action.payload,
      };
    case "UPDATE_ASSESSMENT_SCORE":
      return {
        ...state,
        assessmentScore: action.payload,
      };
    case "UPDATE_ASSESSMENT_ARRAY":
      return {
        ...state,
        assessmentArray: action.payload,
      };
    case "UPDATE_MENU_BOOL":
      return {
        ...state,
        showMenuBool: action.payload,
      };
    case "UPDATE_SHOW_LIGHT_BOX_BOOL":
      return {
        ...state,
        showLightBox: action.payload,
      };
    case "UPDATE_LIGHT_BOX_DATA":
      return {
        ...state,
        lightBoxData: action.payload,
      };
    case "UPDATE_NEXT_DISABLE_BOOL":
      return {
        ...state,
        nextDisable: action.payload,
      };
    case "UPDATE_LAB_NOTEBOOK_PAGES":
      return {
        ...state,
        labNotebookPages: action.payload,
      };
    case "LAB_NOTEBOOK_SUBMITTED_STATUS":
      return {
        ...state,
        hasLabNotebookSubmitted: action.payload,
      };
    case "UPDATE_ASSESSMENT_STARTED_BOOL":
      return {
        ...state,
        assessmentStartedBool: action.payload,
      };
    case "UPDATE_ASSESSMENT_SCREEN_NUM":
      return {
        ...state,
        assessmentScreenNum: action.payload,
      };

    case "UPDATE_MATERIAL_SCREEN_SELECTED_TAB":
      return {
        ...state,
        materialScreenSelectedTab: action.payload,
      };
    case "UPDATE_ZOOM_INDEX":
      return {
        ...state,
        zoomIndex: action.payload,
      };
    case "UPDATE_HINT_CLICKED":
      return {
        ...state,
        hintClicked: action.payload,
      };
    case "SHOW_RESOURCE_SIDEBAR_BOOL":
      return {
        ...state,
        showResourceSideBarBool: action.payload,
      };
    case "SHOW_GLOSSARY_SIDEBAR_BOOL":
      return {
        ...state,
        showGlossarySideBarBool: action.payload,
      };
    case "UPDATE_RESOURCE_NOTEBOOK_PAGES":
      return {
        ...state,
        resourcePages: action.payload,
      };

    case "UPDATE_FILL_IN_BLANK":
      return {
        ...state,
        fillInBlank: action.payload,
      };
    case "UPDATE_HIDE_NAVIGATION_BOOL":
      return {
        ...state,
        hideNavigation: action.payload,
      };
    case "UPDATE_IMAGE_LOADER_BOOL":
      return {
        ...state,
        imageLoaderBool: action.payload,
      };
    case "UPDATE_IS_PRINT_PAGE":
      return {
        ...state,
        isPrintPage: action.payload,
      };

    case "UPDATE_IMG_LOADED_ARRAY":
      return {
        ...state,
        imgLoadedArray: action.payload,
      };
    default:
      return state;
  }
};

export default condition;
