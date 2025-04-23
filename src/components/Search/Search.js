import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Search.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function Search({ setSearchValue, selectedContent }) {
  // lưu giá trị tạm của search
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    setTempValue("");
    setSearchValue("");
  }, [selectedContent]);

  const handleSearch = () => {
    setSearchValue(tempValue);
  };

  const handleClear = () => {
    setTempValue("");
    setSearchValue("");
  };

  const handleChange = (value) => {
    setTempValue(value);
    if (!value) {
      setSearchValue("");
    }
  };

  return (
    <div>
      {/* search */}
      <div className={cx("search")}>
        <input
          value={tempValue}
          onChange={(e) => handleChange(e.target.value)}
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
