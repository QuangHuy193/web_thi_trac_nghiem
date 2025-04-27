import classNames from "classnames/bind";

import styles from "./ListQuestion.module.scss";
import { useEffect, useState } from "react";
import {
  deleteQuestionAPI,
  getQuestionByUserIdAPI,
} from "../../apis/questionApi";
import { getSubSubjectsAPI } from "../../apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  expandCollapseMotion,
  fadeSlideIn,
  rotateArrow,
} from "../../configs/motionConfigs";
import { motion, AnimatePresence } from "framer-motion";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";

const cx = classNames.bind(styles);

function ListQuestion({
  user,
  setSelectedContent,
  setHeaderTitle,
  setIsLoading,
  setTitleLoading,
  setQuestionEdited,
  searchValue,
}) {
  //lưu ds câu hỏi
  const [listQuestion, setListQuestion] = useState([]);
  //lưu danh sách câu hỏi để hiển thị (đã lọc, tìm kiếm) tránh gọi lại api
  const [resultQuestion, setResultQuestion] = useState([]);
  //mở dropdown câu hỏi tương ứng
  const [openIndex, setOpenIndex] = useState(null);
  //quản lý việc gọi api
  const [isFetchDone, setIsFetchDone] = useState(false);
  // lưu để gọi lại api lấy question
  const [isChangeQuestion, setIsChangeQuestion] = useState(false);
  //lưu ds môn phân lớp
  const [subSubject, setSubSubject] = useState([]);
  // lưu môn dc chọn
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    const getData = async () => {
      setTitleLoading("Đang tải danh sách câu hỏi...");
      setIsLoading(true);
      const rs = await getQuestionByUserIdAPI(user.user_id);
      setIsLoading(false);
      setIsFetchDone(true);
      setListQuestion(rs?.questions || []);
      setResultQuestion(rs?.questions || []);
    };
    getData();
  }, [isChangeQuestion]);

  useEffect(() => {
    const getSubSubject = async () => {
      const rs = await getSubSubjectsAPI();
      setSubSubject(rs);
    };

    getSubSubject();
  }, []);

  useEffect(() => {
    let filtered = listQuestion;

    // Lọc theo môn học nếu được chọn
    if (selectedSubject) {
      filtered = filtered.filter((q) => q.subject_id == selectedSubject);
    }

    // Lọc theo giá trị tìm kiếm nếu có
    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      filtered = filtered.filter((q) =>
        q.question_text.toLowerCase().includes(lowerSearch)
      );
    }

    if (!selectedSubject && !searchValue) {
      setResultQuestion(listQuestion);
    }

    setResultQuestion(filtered);
  }, [selectedSubject, searchValue, listQuestion]);

  const toggleOpen = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleEdit = async (question) => {
    setHeaderTitle("Cập nhật câu hỏi");
    setSelectedContent("makeQuestion");
    setQuestionEdited(question);
  };

  const handleDelete = async (question_id) => {
    showConfirmDialog(
      "Xóa câu hỏi",
      "Bạn chắc chắn muốn xóa câu hỏi này",
      "warning",
      async () => {
        setTitleLoading("Đang xóa câu hỏi...");
        setIsLoading(true);
        const deleted = await deleteQuestionAPI(question_id);
        setIsLoading(false);
        if (deleted.status) {
          showSuccessToast(deleted.message, 1200);
          setIsChangeQuestion(!isChangeQuestion);
        } else {
          showErrorToast(deleted.message, 1200);
        }
      },
      "Có",
      "Không"
    );
  };

  return (
    <div className={cx("container")}>
      {isFetchDone ? (
        <div className={cx("container-filter")}>
          <div className={cx("group-number-question")}>
            <label className={cx("title-number-question")}>
              Số câu hỏi hiện tại:
            </label>
            <div className={cx("number-question")}>{resultQuestion.length}</div>
          </div>

          <div className={cx("group-filter")}>
            <label className={cx("title-filter")}>Lọc theo môn học:</label>
            <select
              className={cx("select-filter")}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Tất cả môn học</option>
              {subSubject.map((subject) => (
                <option
                  key={subject.subsubjects_id}
                  value={subject.subsubjects_id}
                >
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {isFetchDone ? (
        resultQuestion.length > 0 ? (
          resultQuestion.map((question, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className={cx("question-block")}>
                <div className={cx("question-header")}>
                  <div
                    className={cx("question-title")}
                    onClick={() => toggleOpen(index)}
                  >
                    <motion.div {...rotateArrow(isOpen)}>
                      <FontAwesomeIcon
                        icon={faCaretRight}
                        className={cx("arrow-icon")}
                      />
                    </motion.div>
                    <span>{question.question_text}</span>
                  </div>

                  <div className={cx("icons")}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className={cx("icon-edit")}
                      onClick={() => handleEdit(question)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={cx("icon-delete")}
                      onClick={() => handleDelete(question.question_id)}
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      {...expandCollapseMotion}
                      className={cx("answers")}
                    >
                      {question.answers.map((ans) => (
                        <motion.div
                          key={ans.answer_id}
                          {...fadeSlideIn}
                          className={cx("answer", { correct: ans.is_correct })}
                        >
                          {ans.answer_text}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className={cx("no-content")}>Bạn chưa tạo câu hỏi nào</div>
        )
      ) : null}
    </div>
  );
}

export default ListQuestion;
