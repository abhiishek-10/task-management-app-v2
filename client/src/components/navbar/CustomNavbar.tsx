import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import styles from "./customNavbar.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { logout } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { fetchUser } from "../../features/profile/profileSlice";

const CustomNavbar = () => {
  const authStatus = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (
      localStorage.getItem("userToken") !== null ||
      localStorage.getItem("userToken") !== "" ||
      localStorage.getItem("userToken") !== undefined
    ) {
      setIsLoggedIn(true);
      setUserToken(localStorage.getItem("userToken"));
    }
  }, [authStatus]); // Add authStatus as a dependency

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const handleLogout = async () => {
    const logoutSuccess = await dispatch(logout());
    if (logoutSuccess) {
      setIsLoggedIn(false);
      setUserToken(null);
      navigate("/");
    }
  };

  return (
    <Container className="pt-5">
      <Navbar className={styles.navbar}>
        <Link to="/" className={styles.navbarLogo}>
          Task Manager
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {isLoggedIn == true && userToken !== null && (
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            <div className="d-flex gap-3 align-items-center">
              {user && (
                <Link to="/me" className={styles.userPfp}>
                  <img src={user.avatar} alt="Profile" />
                </Link>
              )}

              <button className="common-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </Navbar.Collapse>
        )}
      </Navbar>
    </Container>
  );
};

export default CustomNavbar;
