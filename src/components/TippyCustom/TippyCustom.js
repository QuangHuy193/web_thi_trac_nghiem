import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";


function TippyCustom({ children , content, placement = "bottom" }) {
  return (
    <Tippy content={content} placement={placement}>
      {children}
    </Tippy>
  );
}

export default TippyCustom;
