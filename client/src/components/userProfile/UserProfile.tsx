import { useNavigate } from "react-router-dom";
import styles from "./userProfile.module.css";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { updateUser } from "../../features/profile/profileSlice";
const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [openProfileForm, setOpenProfileForm] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>();
  const lastNameRef = useRef<HTMLInputElement>();
  const bioRef = useRef<HTMLTextAreaElement>();
  const avatarRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (
      localStorage.getItem("userToken") === null ||
      localStorage.getItem("userToken") === "" ||
      localStorage.getItem("userToken") === undefined
    ) {
      navigate("/");
    }
  }, []);
  const { user, loading } = useSelector((state: RootState) => state.profile);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldValues = {
      firstName: firstNameRef.current?.value ?? "",
      lastName: lastNameRef.current?.value ?? "",
      bio: bioRef.current?.value ?? "",
      avatar: avatarRef.current?.files?.[0] ?? "",
    };
    const response = await dispatch(updateUser(fieldValues));
    if (updateUser.fulfilled.match(response)) {
      setOpenProfileForm(false);
    }
  };

  return (
    <>
      <div className={`${styles.userPanel}`}>
        <div className={styles.userPanelInr}>
          <div className="d-flex flex-column gap-3">
            <div className={` ${styles.userProfileImg}`}>
              <img src={user?.avatar} alt="User Profile Pic" />
            </div>
            <h5 className="text-white fw-bold text-center">{user?.username}</h5>
          </div>
          <div className={styles.userProfileDetails}>
            <h2 className="text-white fw-bold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-light ">{user?.bio}</p>
          </div>
        </div>
        <div>
          <div className={styles.editProfileBtn}>
            <button
              className="common-btn"
              onClick={() => setOpenProfileForm(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      {openProfileForm && (
        <div className={styles.profileForm}>
          <div className={styles.profileFormInr}>
            <div className="mb-3 d-flex justify-content-between">
              <h2 className="text-white">Edit Profile</h2>
              <button
                className="common-btn"
                onClick={() => setOpenProfileForm(false)}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  ref={firstNameRef as LegacyRef<HTMLInputElement>}
                  type="text"
                  className="form-control"
                  id="firstName"
                  defaultValue={user?.firstName}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  ref={lastNameRef as LegacyRef<HTMLInputElement>}
                  type="text"
                  className="form-control"
                  id="lastName"
                  defaultValue={user?.lastName}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea
                  ref={bioRef as LegacyRef<HTMLTextAreaElement>}
                  className="form-control"
                  id="bio"
                  defaultValue={user?.bio}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="avatar" className="form-label">
                  Avatar
                </label>
                <input
                  ref={avatarRef as LegacyRef<HTMLInputElement>}
                  type="file"
                  className="form-control"
                  id="avatar"
                  required
                />
              </div>
              <div className="d-flex gap-3 align-items-center">
                {loading ? (
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <button type="submit" className="common-btn">
                    Update
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
