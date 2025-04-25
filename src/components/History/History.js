import classNames from "classnames/bind";
import dayjs from "dayjs";

import styles from "./History.module.scss";
import { useEffect, useState } from "react";
import { getHistoryByUserIdAPI } from "../../Api/api";

const cx = classNames.bind(styles);

function History({
  setSelectedContent,
  setHeaderTitle,
  user,
  setIdHistory,
  setIsLoading,
  setTitleLoading,
}) {
  // lưu danh sách lịch sử
  const [history, setHistory] = useState([]);

  const [isFetchDone, setIsFetchDone] = useState(false);

  useEffect(() => {
    const getHistoryByUserId = async () => {
      setTitleLoading("Đang tải lịch sử làm bài...");
      setIsLoading(true);
      const rs = await getHistoryByUserIdAPI(user.user_id);
      setIsFetchDone(true);
      setIsLoading(false);
      setHistory(rs);
    };

    getHistoryByUserId();
  }, []);

  const handleClickReviewExam = (history_id) => {
    setSelectedContent("historyExam");
    setHeaderTitle("Kết quả làm bài");
    setIdHistory(history_id);
  };

  return (
    <div className={cx("container")}>
      {/* Danh sách các bài thi đã làm */}
      {isFetchDone ? (
        history.length !== 0 ? (
          history.histories?.map((item, index) => (
            <div key={index} className={cx("history-item")}>
              <div className={cx("history-row")}>
                <span className={cx("label")}>Bài thi:</span>
                <span className={cx("value")}>{item.exam.title}</span>
              </div>
              <div className={cx("history-row")}>
                <span className={cx("label")}>Điểm số:</span>
                <span className={cx("value")}>{item.score}</span>
              </div>
              <div className={cx("history-row")}>
                <span className={cx("label")}>Bắt đầu lúc:</span>
                <span className={cx("value")}>
                  {dayjs(item.started_at).format("HH:mm DD/MM/YYYY")}
                </span>
              </div>
              <div className={cx("history-row")}>
                <span className={cx("label")}>Kết thúc lúc:</span>
                <span className={cx("value")}>
                  {dayjs(item.finished_at).format("HH:mm DD/MM/YYYY")}
                </span>
              </div>
              <div
                className={cx("history-btn")}
                onClick={() => {
                  handleClickReviewExam(item.history_id);
                }}
              >
                <button>Xem lại bài thi</button>
              </div>
            </div>
          ))
        ) : (
          <div className={cx("no-content")}>Bạn chưa làm bài thi nào!</div>
        )
      ) : null}
    </div>
  );
}

export default History;
