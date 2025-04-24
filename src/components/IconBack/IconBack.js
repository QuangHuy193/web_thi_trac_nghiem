import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";

import styles from "./IconBack.module.scss"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

const cx=classNames.bind(styles)

function IconBack({handleBack}) {
    return ( <FontAwesomeIcon
                className={cx("icon-back")}
                icon={faArrowLeftLong}
                onClick={handleBack}
              /> );
}

export default IconBack;