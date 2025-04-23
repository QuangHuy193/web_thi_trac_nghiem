import classNames from "classnames/bind";

import styles from "./ListQuestion.module.scss";
import { useEffect, useState } from "react";
import {
  deleteQuestionAPI,
  getQuestionBySubSubjectIdAPI,
  getQuestionByUserIdAPI,
} from "../../Api/api";
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
}) {
  const [listQuestion, setListQuestion] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [isFetchDone, setIsFetchDone] = useState(false);
   // lưu để gọi lại api lấy question
   const [isChangeQuestion, setIsChangeQuestion] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setTitleLoading("Đang tải danh sách câu hỏi...");
      setIsLoading(true);
      const rs = await getQuestionByUserIdAPI(user.user_id);
      setIsLoading(false);
      setIsFetchDone(true);
      setListQuestion(rs?.questions || []);
    };
    getData();
  }, [isChangeQuestion]);

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
          setIsChangeQuestion(!isChangeQuestion)
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
        listQuestion.length > 0 ? (
          listQuestion.map((question, index) => {
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
          <div className={cx("no-question")}>Bạn chưa tạo bài thi nào</div>
        )
      ) : null}
    </div>
  );
}

export default ListQuestion;
