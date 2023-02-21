import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeClosedIcon,
  ArrowUpIcon,
} from "@primer/octicons-react";
import {
  UserContext,
  ThemeContext,
  GuideContext,
  CategoryListContext,
} from "../../../../context/ContextProvider";
import UserAPI from "../../../../utils/api/user";
import AuthAPI from "../../../../utils/api/auth";
import {
  googleLoginUrl,
  googleSuccessUrl,
} from "../../../../config/multi-environment";
import "./style.css";

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  setShowSignUpModal,
}) => {
  const navigate = useNavigate();
  const { setTheme } = useContext(ThemeContext);
  const { setCurrentUserInfo } = useContext(UserContext);
  const { setShowGuide } = useContext(GuideContext);
  const { setShowSidePanel } = useContext(CategoryListContext);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(null);
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    userError: "",
    matchError: "",
  });

  const closeModal = e => {
    e.stopPropagation();
    setUserInput({
      email: "",
      password: "",
      userError: "",
      matchError: "",
    });
    setShowLoginModal(false);
    e.target.name === "SignUp" && setShowSignUpModal(true);
  };

  const handleChange = e => {
    setUserInput(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    userInput.isLoggingIn = true;
    const userInfo = await AuthAPI.login(userInput);
    const { userData, isAuth, userError, matchError } = userInfo;
    setUserInput(prevState => ({
      ...prevState,
      userError: userError ? userError : "",
      matchError: matchError ? matchError : "",
    }));
    if (!userError && !matchError && isAuth) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          isLoggedIn: true,
        })
      );
      setCurrentUserInfo(userData);
      setTheme(userData.theme === "dark" ? "dark" : "light");
      setShowLoginModal(false);
      setUserInput({
        email: "",
        password: "",
        userError: "",
        matchError: "",
      });
      if (userData.showGuideModal) {
        setShowGuide(true);
        setShowSidePanel(false);
        if (userData.cubes.length !== 0) {
          navigate(`/dashboard/cube/${userData.categories[0].cubes[0]}`);
        } else {
          navigate("/dashboard/instructions");
        }
      } else {
        navigate("/dashboard/instructions");
      }
    }
  };

  const fetchOAuthUser = async () => {
    const userInfo = await UserAPI.userData();
    const { userData, isAuth } = userInfo;
    if (isAuth) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          isLoggedIn: true,
        })
      );
      setCurrentUserInfo(userData);
      setTheme(userData.theme === "dark" ? "dark" : "light");
      setShowLoginModal(false);
      if (userData.showGuideModal) {
        setShowGuide(true);
        setShowSidePanel(false);
        if (userData.cubes.length !== 0) {
          navigate(`/dashboard/cube/${userData.categories[0].cubes[0]}`);
        } else {
          navigate("/dashboard/instructions");
        }
      } else {
        navigate("/dashboard/instructions");
      }
    }
  };

  const loginWithGoogle = async () => {
    const newWindow = (url, windowName, win, w, h) => {
      const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
      return win.open(
        url,
        windowName,
        `width=${w}, height=${h}, top=${y}, left=${x}`
      );
    };
    const popup = newWindow(googleLoginUrl, "popup", window, 600, 700);
    const checkPopup = setInterval(() => {
      if (
        !popup.closed &&
        popup.window.location.href.includes(googleSuccessUrl)
      ) {
        popup.close();
        fetchOAuthUser();
      }
      if (!popup || !popup.closed) return;
      clearInterval(checkPopup);
    }, 1000);
  };

  const checkForCapsLock = e => {
    if (e.getModifierState("CapsLock")) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  };

  const errorStyle = {
    color: "red",
    fontSize: "12px",
  };

  return (
    <>
      {showLoginModal && (
        <div
          className="modal"
          id="modalLoginForm"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Login</h4>
                <button
                  type="button"
                  onClick={closeModal}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="oauth-container">
                <button
                  className="oauth-btn google-btn"
                  onClick={loginWithGoogle}></button>
              </div>
              <div className="hr-container">
                <hr size="2" width="30%" />
                <h6>or</h6>
                <hr size="2" width="30%" />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label
                      data-error="wrong"
                      data-success="right"
                      htmlFor="login-email">
                      <MailIcon size={16} className="label-icon" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="login-email"
                      className="form-control"
                      value={userInput.email}
                      onChange={handleChange}
                      required
                    />
                    {userInput.userError && (
                      <p style={errorStyle}>{userInput.userError}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label
                      data-error="wrong"
                      data-success="right"
                      htmlFor="login-pass">
                      <LockIcon size={16} className="label-icon" />
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="login-pass"
                      className="form-control"
                      value={userInput.password}
                      onChange={handleChange}
                      onKeyUp={checkForCapsLock}
                      onKeyDown={checkForCapsLock}
                      onClick={checkForCapsLock}
                      required
                      autoComplete="off"
                    />
                    <div className="input-icons-container">
                      <button
                        className="password-visibilty-btn"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide Password" : "Show Password"}
                        aria-label={
                          showPassword ? "Hide Password" : "Show Password"
                        }>
                        {showPassword ? (
                          <EyeIcon size={16} />
                        ) : (
                          <EyeClosedIcon size={16} />
                        )}
                      </button>
                      {capsLock ? (
                        <ArrowUpIcon size={16} className="caps-lock-warning" />
                      ) : (
                        <></>
                      )}
                    </div>
                    {userInput.matchError && (
                      <p style={errorStyle}>{userInput.matchError}</p>
                    )}
                  </div>
                  <div className="btn-container">
                    <button
                      type="submit"
                      className="btn form-btn btn-secondary">
                      Login
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <small>
                    Need an account?{" "}
                    <Link
                      to="/"
                      name="SignUp"
                      onClick={closeModal}
                      data-dismiss="modal"
                      data-toggle="modal"
                      data-target="#modalRegisterForm">
                      Sign Up Here
                    </Link>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;