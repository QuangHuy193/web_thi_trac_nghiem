import styles from "./Exam.module.scss"

import classNames from "classnames/bind"

const cx = classNames.bind(styles)

function Exam({selectedSubject, typeSubject}) {
    console.log(selectedSubject, typeSubject);
    return ( <div>exam</div> );
}

export default Exam;