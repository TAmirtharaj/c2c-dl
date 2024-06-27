import CustomButton from "./CustomButton";
import { useDispatch } from "react-redux";
import { withScorm } from "react-scorm-provider-v2";
import "./CompletionActionButtons.css";
import { getCommonWindowObj, setCommonWindowObj } from "../helper/Helper";

const CompletionActionButtons = (props) => {
  const dispatch = useDispatch();
  let windowObj = getCommonWindowObj();
  const submitClickHandler = () => {
    dispatch({ type: "LAB_NOTEBOOK_SUBMITTED_STATUS", payload: true });

    windowObj.hasLabNotebookSubmitted = true;
    setCommonWindowObj(windowObj);

    if (props.sco.apiConnected) {
      props.sco.setSuspendData(`hasLabNotebookSubmitted`, true).then((data) => {
        props.sco.setStatus("completed").then(() => {
          // console.log("completionStatus :::: completed");
        });
      });
    }
    props.onClose();
  };

  const doNotSubmitClickHandler = () => {
    props.onClose();
  };
  return (
    <div className='completion-action-buttons'>
      <CustomButton
        title={props.labNoteBookFlag ? "Do not submit" : "Do not finish"}
        className='no-submit-button'
        onClick={doNotSubmitClickHandler}
      />
      <CustomButton
        title={props.labNoteBookFlag ? "Yes, submit" : "Yes, finish"}
        className='yes-submit-button'
        onClick={submitClickHandler}
      />
    </div>
  );
};

export default withScorm()(CompletionActionButtons);
