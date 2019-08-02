import React, { Fragment, Component } from "react";
import { Redirect } from "react-router-dom";

class ResetPasswordMessage extends Component {
  state = {
    query: this.props.history.location.search
  };

  render() {
    if (this.state.query === "") {
      return <Redirect to="/login" />;
    }
    return (
      <Fragment>
        <h1 className="large text-primary">What Next ?</h1>
        <p className="confirmation">
          In a few moments, you will receive an email with the subject line
          "Reset Password" that contains a link to reset your password.
        </p>
        <small className="form-text">
          If you cannot find inside Inbox folder, please check it in Spam folder
        </small>
      </Fragment>
    );
  }
}

export default ResetPasswordMessage;
