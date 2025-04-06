import classNames from "classnames/bind";

import styles from "./HistoryExam.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

const cs = classNames.bind(styles);

function HistoryExam({
  resultExam,
  questionsExam,
  setHeaderTitle,
  setSelectedContent,
}) {
  const { exam_id, results } = resultExam;

  // Đếm số câu đúng
  const correctCount = results.reduce((count, item) => {
    const question = questionsExam.find(
      (q) => q.question_id === item.question_id
    );
    if (!question) return count;

    const correctAnswer = question.answers.find((ans) => ans.is_correct === 1);
    if (!correctAnswer) return count;

    if (item.answer_id === correctAnswer.answer_id) {
      return count + 1;
    }

    return count;
  }, 0);

  const totalQuestions = questionsExam.length;
  const score = ((correctCount / totalQuestions) * 10).toFixed(2); // Giữ 2 chữ số thập phân

  return (
    <div className={cs("history-container")}>
      <h2 className={cs("title")}>Kết quả bài thi vừa làm</h2>

      <p className={cs("score")}>
        ✅ Số câu đúng: {correctCount}/{totalQuestions} – 🎯 Điểm: {score}/10
      </p>
      
      {results.map((item, index) => {
        const question = questionsExam.find(
          (q) => q.question_id === item.question_id
        );

        if (!question) return null; // Nếu không tìm thấy câu hỏi, bỏ qua

        return (
          <div key={item.question_id} className={cs("question-block")}>
            <h3 className={cs("question-text")}>
              {index + 1}. {question.question_text}
            </h3>

            <div className={cs("options")}>
              {question.answers.map((answer) => {
                const isSelected = answer.answer_id === item.answer_id;
                const isCorrect = answer.is_correct === 1;

                return (
                  <label
                    key={answer.answer_id}
                    className={cs("option", {
                      selected: isSelected,
                      correct: isCorrect,
                    })}
                  >
                    <input
                      type="radio"
                      disabled
                      checked={isSelected}
                      readOnly
                    />
                    {answer.answer_text}

                    {/* Hiển thị icon đúng/sai */}
                    {isSelected && !isCorrect && (
                      <FontAwesomeIcon icon={faX} className={cs("icon", "wrong")}/>
                    )}
                    {isCorrect && (
                      <FontAwesomeIcon icon={faCheck} className={cs("icon", "correct")}/>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryExam;
