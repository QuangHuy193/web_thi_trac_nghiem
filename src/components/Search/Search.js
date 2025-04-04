import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Search.module.scss";

const cx = classNames.bind(styles);

function Search() {
  return (
    <div>
      {/* search */}
      <div className={cx("search")}>
        <input placeholder="Bạn đang tìm gì?" spellCheck="false" />

        <button className={cx("clear")}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>

        <button className={cx("search-btn")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
}

export default Search;
