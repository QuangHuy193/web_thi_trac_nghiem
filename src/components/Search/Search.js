import styles from "./Search.module.scss";

import classNames from "classnames/bind";
import HeadlessTippy from "@tippyjs/react/headless";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

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
