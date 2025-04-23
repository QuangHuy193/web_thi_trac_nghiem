import classNames from "classnames/bind";

import styles from "./Home.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const cx = classNames.bind(styles);

function Home() {
  return (
  
      <div className={cx("container")}>
        <Slider
          dots={true}
          infinite={true}
          speed={600}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={3000}
        >
          <div>
            <img
              src="/bannertoan.jpg"
              alt="Banner 1"
              className={cx("banner")}
            />
          </div>
          <div>
            <img src="/bannerls.jpg" alt="Banner 2" className={cx("banner")} />
          </div>
          <div>
            <img src="/bannerdl.jpg" alt="Banner 3" className={cx("banner")} />
          </div>
          <div>
            <img src="/bannervl.jpg" alt="Banner 4" className={cx("banner")} />
          </div>
        </Slider>
        <div className={cx("card-container")}>
          <div className={cx("card")}>
            <img src="/sachmoi.jpg" alt="Đề thi học kỳ" />
            <h3>ĐỀ THI HỌC KỲ</h3>
            <p>
              Ngân hàng câu hỏi đầy đủ các môn cấp 1,2,3 được trộn tạo đề theo
              cấu trúc giúp luyện tập hiệu quả.
            </p>
          </div>

          <div className={cx("card")}>
            <img src="/sachnon.jpg" Đề thi THPT QG />
            <h3>ĐỀ THI THPT QG</h3>
            <p>
              Tổng hợp đề thi trắc nghiệm của các môn khối thi THPT QG, có đáp
              án & giải thích chi tiết.
            </p>
          </div>

          <div className={cx("card")}>
            <img src="/khoahoc.jpg" alt="Đề kiểm tra" />
            <h3>ĐỀ KIỂM TRA</h3>
            <p>
              Thi thử 15 phút, 1 tiết theo hình thức online, kết quả được chấm
              điểm tự động.
            </p>
          </div>
        </div>
      </div>

  );
}

export default Home;
