import classNames from "classnames/bind";

import styles from "./Loading.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function Loading({ title, setIsLoading }) {
  return (
    <div className={cx("container")}>
      <div className={cx("close")}>
        <FontAwesomeIcon
          icon={faClose}
          onClick={() => {
            setIsLoading(false);
          }}
        />
      </div>
      <div className={cx("spinner")}></div>
      <div className={cx("title")}>{title}</div>
    </div>
  );
}

export default Loading;
