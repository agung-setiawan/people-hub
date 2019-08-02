import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updatePassword } from "../../actions/auth";

const ResetPassword = ({ setAlert, updatePassword, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    password: "",
    retypepassword: ""
  });

  const { password, retypepassword } = formData;
  const urlCode = window.location.href;
  const refCode = urlCode.substring(urlCode.indexOf("?") + 1);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== retypepassword) {
      setAlert("Passwords do not match", "danger");
    } else {
      updatePassword(password, refCode);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Reset Password</h1>
      <p className="lead">
        <i className="fas fa-user" /> Set New password
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Retype Password"
            name="retypepassword"
            value={retypepassword}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Reset" />
      </form>
    </Fragment>
  );
};

ResetPassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, updatePassword }
)(ResetPassword);
