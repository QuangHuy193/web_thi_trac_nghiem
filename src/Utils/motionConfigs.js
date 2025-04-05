// hiệu ứng height + opacity
const expandCollapseMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3 },
};

// hiệu ứng từng dòng hiện lên
const fadeSlideIn = {
  initial: { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
  transition: { duration: 0.2 },
};

//xoay icon
const rotateArrow = (isOpen) => ({
  animate: { rotate: isOpen ? 90 : 0 },
  transition: { duration: 0.3 },
});

export { expandCollapseMotion, fadeSlideIn, rotateArrow };
