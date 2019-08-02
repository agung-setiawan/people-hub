import React, { Fragment, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { activation } from "../../actions/auth";

const RegisterActivation = ({ setAlert, activation, isAuthenticated }) => {
  const urlCode = window.location.href;
  const refCode = urlCode.substring(urlCode.indexOf("?") + 1);

  useEffect(() => {
    activation(refCode);
  }, [activation]);

  if (isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Activation</h1>
      <p className="lead">
        <i className="fas fa-user" /> Activation in progress
      </p>
      <p>
        Please Wait, if this process is success it will bring you to login
        page...!
      </p>
    </Fragment>
  );
};

RegisterActivation.propTypes = {
  setAlert: PropTypes.func.isRequired,
  activation: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, activation }
)(RegisterActivation);
