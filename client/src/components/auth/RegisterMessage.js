import React, { Fragment, Component } from "react";
import { Redirect } from "react-router-dom";

class Confirmation extends Component {
  state = {
    query: this.props.history.location.search
  };

  render() {
    if (this.state.query === "") {
      return <Redirect to="/" />;
    }
    return (
      <Fragment>
        <h1 className="large text-primary">You Are Almost Done</h1>
        <p className="confirmation">
          Thank you for the participation, you are almost complete the
          registration step, we send you an email to varification process.{" "}
        </p>
        <small className="form-text">
          If you cannot find inside Inbox folder, please check it in Spam folder
        </small>
      </Fragment>
    );
  }
}

export default Confirmation;
