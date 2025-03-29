const checkLogin = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated;
};

export { checkLogin };
