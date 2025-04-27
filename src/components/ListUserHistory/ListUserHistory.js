import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpShortWide,
  faArrowUpWideShort,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./ListUserHistory.module.scss";
import IconBack from "../IconBack/IconBack";
import TippyCustom from "../TippyCustom/TippyCustom";
import { handleBack } from "../../Utils/function";
import { getListHistoryUserByExamIdAPI } from "../../Api/api";

const cx = classNames.bind(styles);

function ListUserHistory({
  idExam,
  setHeaderTitle,
  setSelectedContent,
  setIsLoading,
  setTitleLoading,
}) {
  const [listHistoryUser, setListHistoryUser] = useState(null);
  const [listHistoryUserDisplay, setListHistoryUserDisplay] = useState([]);
  const [statusSort, setStatusSort] = useState({
    score: "ascending",
    finished_at: "ascending",
  });
  const [isFetchDone, setIsFetchDone] = useState(false);

  useEffect(() => {
    const fetchListUser = async () => {
      setTitleLoading("Đang tải danh sách thí sinh...");
      setIsLoading(true);
      const result = await getListHistoryUserByExamIdAPI(idExam);
      setListHistoryUser(result);
      setListHistoryUserDisplay(result?.takers || []);
      setIsFetchDone(true);
      setIsLoading(false);
    };

    fetchListUser();
  }, [idExam, setIsLoading, setTitleLoading]);

  const filterScore = (value) => {
    if (!listHistoryUser) return [];

    const { takers } = listHistoryUser;
    switch (value) {
      case "=0":
        return takers.filter((user) => user.score === 0);
      case ">0":
        return takers.filter((user) => user.score > 0);
      case ">=5":
        return takers.filter((user) => user.score >= 5);
      case ">=8":
        return takers.filter((user) => user.score >= 8);
      case "=10":
        return takers.filter((user) => user.score === 10);
      default:
        return takers;
    }
  };

  const handleFilterScore = (e) => {
    const filtered = filterScore(e.target.value);
    const sorted = sortList(filtered, "finished_at", statusSort.finished_at);
    setListHistoryUserDisplay(sorted);
  };

  const sortList = (list, field, direction) => {
    const sorted = [...list].sort((a, b) => {
      const valueA =
        field === "finished_at" ? new Date(a.finished_at).getTime() : a[field];
      const valueB =
        field === "finished_at" ? new Date(b.finished_at).getTime() : b[field];
      return direction === "ascending" ? valueA - valueB : valueB - valueA;
    });
    return sorted;
  };

  const handleSort = (field) => {
    const newDirection =
      statusSort[field] === "ascending" ? "decreasing" : "ascending";
    const sorted = sortList(listHistoryUserDisplay, field, newDirection);

    setListHistoryUserDisplay(sorted);
    setStatusSort((prev) => ({ ...prev, [field]: newDirection }));
  };

  return (
    <div className={cx("container")}>
      <IconBack
        handleBack={() =>
          handleBack(
            setHeaderTitle,
            "Danh sách bài thi",
            setSelectedContent,
            "listExam"
          )
        }
      />

      {isFetchDone && listHistoryUser && (
        <div className={cx("title")}>{listHistoryUser.exam.title}</div>
      )}

      {/* Bộ lọc điểm */}
      <div className={cx("filter-score")}>
        <label>Lọc điểm</label>
        <select onChange={handleFilterScore}>
          <option value="">Tất cả</option>
          <option value="=0">Điểm = 0</option>
          <option value=">0">Điểm &gt; 0</option>
          <option value=">=5">Điểm &gt;= 5</option>
          <option value=">=8">Điểm &gt;= 8</option>
          <option value="=10">Điểm = 10</option>
        </select>
      </div>

      {/* Danh sách thí sinh */}
      {isFetchDone &&
        (listHistoryUserDisplay.length > 0 ? (
          <div className={cx("list-user")}>
            {/* Header */}
            <div className={cx("group-user", "header")}>
              <div className={cx("username")}>Tên thí sinh</div>
              <div className={cx("email")}>Email</div>
              <div className={cx("score")}>
                Điểm
                <TippyCustom
                  content={
                    statusSort.score === "ascending"
                      ? "Sắp xếp tăng dần"
                      : "Sắp xếp giảm dần"
                  }
                >
                  <span onClick={() => handleSort("score")}>
                    <FontAwesomeIcon
                      icon={
                        statusSort.score === "ascending"
                          ? faArrowUpWideShort
                          : faArrowUpShortWide
                      }
                    />
                  </span>
                </TippyCustom>
              </div>
              <div className={cx("finished_at")}>
                Thời gian nộp
                <TippyCustom
                  content={
                    statusSort.finished_at === "ascending"
                      ? "Sắp xếp tăng dần"
                      : "Sắp xếp giảm dần"
                  }
                >
                  <span onClick={() => handleSort("finished_at")}>
                    <FontAwesomeIcon
                      icon={
                        statusSort.finished_at === "ascending"
                          ? faArrowUpWideShort
                          : faArrowUpShortWide
                      }
                    />
                  </span>
                </TippyCustom>
              </div>
              <div className={cx("duration")}>Thời gian làm bài</div>
            </div>

            {/* Body */}
            {listHistoryUserDisplay.map((taker, index) => {
              const durationMinutes = Math.floor(
                (new Date(taker.finished_at) - new Date(taker.started_at)) /
                  60000
              );
              return (
                <div key={index} className={cx("group-user")}>
                  <div className={cx("username")}>{taker.username}</div>
                  <div className={cx("email")}>{taker.email}</div>
                  <div className={cx("score")}>{taker.score.toFixed(2)}</div>
                  <div className={cx("finished_at")}>
                    {dayjs(taker.finished_at).format("HH:mm DD/MM/YYYY")}
                  </div>
                  <div className={cx("duration")}>{durationMinutes} phút</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={cx("no-user")}>
            Chưa có thí sinh nào làm bài thi này!
          </div>
        ))}
    </div>
  );
}

export default ListUserHistory;
