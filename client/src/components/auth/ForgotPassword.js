import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { forgot } from "../../actions/auth";

const ForgotPassword = ({ forgot, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: ""
  });

  const { email } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    forgot(email);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <div className="loginBody">
        <h1 className="large text-primary">Forgot Password</h1>
        <p className="lead">
          <i className="fas fa-user" /> Please Type Your Register Email
        </p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              required
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Submit" />
        </form>
        <p className="my-1">
          Back To <Link to="/login">Login</Link>
        </p>
      </div>
    </Fragment>
  );
};

ForgotPassword.propTypes = {
  forgot: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { forgot }
)(ForgotPassword);
