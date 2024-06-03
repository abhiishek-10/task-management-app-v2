import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./authPanel.module.css";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

type IFormInput = {
  email: string;
  password: string;
};

const AuthPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      navigate("/task-manager");
    }
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const [isLogin, setIsLogin] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [credError, setCredError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const isLoading = useSelector((state: RootState) => state.auth.loading);

  const onSignup: SubmitHandler<IFormInput> = async (data) => {
    const userToken = await dispatch(signup(data));

    if (userToken.payload === undefined) {
      setUserExists(true);
    } else {
      navigate("/task-manager");
    }
  };

  const onLogin: SubmitHandler<IFormInput> = async (data) => {
    const userToken = await dispatch(login(data));
    if (userToken.payload === undefined) {
      setCredError(true);
    } else {
      navigate("/task-manager");
    }
  };

  return (
    <div className={`${styles.authPanelMain}`}>
      <h1 className="text-white">{isLogin ? "Login" : "Sign Up"}</h1>
      <form
        className={styles.authForm}
        noValidate
        onSubmit={handleSubmit(isLogin ? onLogin : onSignup)}
      >
        <div className={`form-control ${styles.formControl}`}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Email is not valid.",
              },
            })}
          />
          {errors.email && <p className="errorMsg">{errors.email.message}</p>}
        </div>
        <div className={`form-control ${styles.formControl}`}>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required.",
              validate: {
                uppercase: (value) =>
                  /[A-Z]/.test(value) ||
                  "Password should contain at least one uppercase letter.",
                lowercase: (value) =>
                  /[a-z]/.test(value) ||
                  "Password should contain at least one lowercase letter.",
                digit: (value) =>
                  /[0-9]/.test(value) ||
                  "Password should contain at least one digit.",
                special: (value) =>
                  /[!@#$*]/.test(value) ||
                  "Password should contain at least one special symbol.",
              },
              minLength: {
                value: 6,
                message: "Password should be at-least 6 characters.",
              },
            })}
          />
          {errors.password && (
            <p className="errorMsg">{errors.password.message}</p>
          )}
        </div>
        <div className={`form-control d-flex  ${styles.formControl}`}>
          {isLoading ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <button className="common-btn" type="submit">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          )}
        </div>
      </form>
      <p className="text-white">
        {userExists && "Someone with this username already exists"}
        {credError && "Wrong Email or Password"}
      </p>

      <button
        className="secondary-btn mt-3"
        onClick={() => {
          setIsLogin((prev) => !prev);
          setUserExists(false);
          setCredError(false);
        }}
      >
        {isLogin ? "New here? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthPanel;
