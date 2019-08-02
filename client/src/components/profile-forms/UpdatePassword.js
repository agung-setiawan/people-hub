import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getCurrentProfile,
  updatePassword
} from "../../actions/profile";

const EditProfile = ({
  profile: { profile, loading },
  getCurrentProfile,
  updatePassword,
  history
}) => {
  const [formData, setFormData] = useState({
    password1: "",
    password2: ""
  });

  const { password1, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    updatePassword(formData, history, true);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Update Password
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            name="password1"
            value={password1}
            onChange={e => onChange(e)}
          />
          <small className="form-text">Your Desire Password</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Type Again Your Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
          />
          <small className="form-text">Re-type Your Password</small>
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Back To Dashboard
        </Link>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, updatePassword }
)(withRouter(EditProfile));
