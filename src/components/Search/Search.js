import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Search.module.scss";
import { useState } from "react";

const cx = classNames.bind(styles);

function Search() {
  // lưu giá trị tạm của search
  const [tempValue, setTempValue] = useState("");
  // dùng giá trị này để xác định có tiềm kiếm hay không
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    setSearchValue(tempValue);
    handleClear();
    console.log(tempValue);
  };

  const handleClear = () => {
    setTempValue("");
  };

  return (
    <div>
      {/* search */}
      <div className={cx("search")}>
        <input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          placeholder="Bạn đang tìm gì?"
          spellCheck="false"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button className={cx("clear")} onClick={handleClear}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>

        <button className={cx("search-btn")} onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
}

export default Search;
