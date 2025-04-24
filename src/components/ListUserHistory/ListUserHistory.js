import classNames from "classnames/bind";

import styles from "./ListUserHistory.module.scss";
import IconBack from "../IconBack/IconBack";
import { handleBack } from "../../Utils/function";

const cx = classNames.bind(styles);

function ListUserHistory({ idExam ,setHeaderTitle, setSelectedContent}) {
  return (
    <div>
      <IconBack handleBack={()=>handleBack(setHeaderTitle, 
      "Danh sách bài thi", setSelectedContent,"listExam")} />
      {idExam}
    </div>
  );
}

export default ListUserHistory;
