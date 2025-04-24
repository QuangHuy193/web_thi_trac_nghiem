import classNames from "classnames/bind";

import styles from "./ListUserHistory.module.scss";
import IconBack from "../IconBack/IconBack";
import { handleBack } from "../../Utils/function";
import { useEffect, useState } from "react";
import { getListHistoryUserByExamIdAPI } from "../../Api/api";
import dayjs from "dayjs";

const cx = classNames.bind(styles);

function ListUserHistory({
  idExam,
  setHeaderTitle,
  setSelectedContent,
  setIsLoading,
  setTitleLoading,
}) {
  const [listHistoryUser, setListHistoryUser] = useState([]);

  const [isFetchDone, setIsFetchDone] = useState(false);

  useEffect(() => {
    const getListUser = async () => {
      setTitleLoading("Đang tải danh sách thí sinh...");
      setIsLoading(true);
      const rs = await getListHistoryUserByExamIdAPI(idExam);
      setIsFetchDone(true);      
      setIsLoading(false);

      setListHistoryUser(rs);
    };

    getListUser();
  }, []);

  return (
    <>
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
      {isFetchDone ? (
        listHistoryUser.takers?.length > 0 ? (
          <div className={cx("container")}>
            <div className={cx("title")}>{listHistoryUser.exam.title}</div>

            {/* HÀNG TIÊU ĐỀ */}
            <div className={cx("group-user", "header")}>
              <div className={cx("username")}>Tên thí sinh</div>
              <div className={cx("email")}>Email</div>
              <div className={cx("score")}>Điểm</div>
              <div className={cx("finished_at")}>Thời gian nộp</div>
            </div>

            {/* DANH SÁCH THÍ SINH */}
            {listHistoryUser.takers?.map((taker) => (
              <div className={cx("group-user")}>
                <div className={cx("username")}>{taker.username}</div>
                <div className={cx("email")}>{taker.email}</div>
                <div className={cx("score")}>{taker.score}</div>
                <div className={cx("finished_at")}>
                  {dayjs(taker.finished_at).format("HH:mm DD/MM/YYYY")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cx("no-user")}>
            Chưa có thí sinh nào làm bài thi này!
          </div>
        )
      ) : null}
    </>
  );
}

export default ListUserHistory;
