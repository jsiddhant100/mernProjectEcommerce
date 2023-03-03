import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import SideBar from "./Sidebar";
import { getUserDetails, STATUSES, clearError as stopError } from "../../store/userDetailsSlice";
import {
  setUpdate,
  STATUSES as updateStatus,
  updateUser,
  clearError
} from "../../store/profileSlice";
import Loader from "../layout/Loader/Loader";
const UpdateUser = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { status, isUpdated } = useSelector((state) => state.profile);
  const { status: userStatus, user } = useSelector(
    (state) => state.userDetails
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = match.params.id;
  const error = STATUSES.ERROR;
  const updateError = updateStatus.ERROR;
  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (error !== "no-error") {
      alert.error(error);
      dispatch(stopError('no-error'));  
    }
    if (updateError !== "no-error") {
      alert.error(updateError);
      dispatch(clearError('no-error'));  
    }
    if (isUpdated) {
      alert.success("User Updated Successfully");
      history.push("/admin/users");
      dispatch(setUpdate(false));
    }
  }, [error, alert, history, dispatch, updateError, isUpdated, user, userId]);
  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);
    dispatch(updateUser(userId, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {userStatus === STATUSES.LOADING ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              encType="multipart/form-data"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>
              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  status === updateStatus.LOADING
                    ? true
                    : false || role === ""
                    ? true
                    : false
                }
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
