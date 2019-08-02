import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  createProfile,
  getCurrentProfile,
  changeAvatar
} from "../../actions/profile";
import { countryList } from "../../actions/countries";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  changeAvatar,
  history
}) => {
  const [formData, setFormData] = useState({
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    avatar: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
    file: []
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    getCurrentProfile();

    if (profile !== null) {
      setFormData({
        company: loading || !profile.company ? "" : profile.company,
        website: loading || !profile.website ? "" : profile.website,
        location: loading || !profile.location ? "" : profile.location,
        status: loading || !profile.status ? "" : profile.status,
        skills: loading || !profile.skills ? "" : profile.skills.join(","),
        githubusername:
          loading || !profile.githubusername ? "" : profile.githubusername,
        bio: loading || !profile.bio ? "" : profile.bio,
        avatar: loading || !profile.user.avatar ? "" : profile.user.avatar,
        twitter: loading || !profile.social ? "" : profile.social.twitter,
        facebook: loading || !profile.social ? "" : profile.social.facebook,
        linkedin: loading || !profile.social ? "" : profile.social.linkedin,
        youtube: loading || !profile.social ? "" : profile.social.youtube,
        instagram: loading || !profile.social ? "" : profile.social.instagram
      });
    } else {
      window.location.href = "/login";
    }
  }, [loading, getCurrentProfile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    avatar,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
    file
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
  };

  const handleImageChange = e => {
    e.preventDefault();

    let reader = new FileReader();
    let files = e.target.files[0];

    reader.onloadend = () => {
      setFormData({
        avatar: reader.result,
        file: files
      });
    };
    reader.readAsDataURL(files);
  };

  const fileUploadHandler = e => {
    e.preventDefault();
    try {
      changeAvatar(file, true);
    } catch (error) {
      alert("Please Select The Image First");
    }
  };

  const onEditorStateChange = data => {
    try {
      setFormData({ ...formData, bio: data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Let's get some information to make your
        profile stand out
      </p>
      <div className="profile-avatar">
        <div className="avatar" style={{ backgroundImage: `url(${avatar})` }} />
        <p>
          <input
            type="file"
            name="avatar"
            onChange={e => handleImageChange(e)}
          />
        </p>
        <p>
          <button
            onClick={e => fileUploadHandler(e)}
            className="btn btn-dark"
            style={{ marginTop: 10 }}
          >
            Change Avatar
          </button>
        </p>
      </div>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <select name="status" value={status} onChange={e => onChange(e)}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <select name="location" value={location} onChange={e => onChange(e)}>
            {countryList().map(countryIn => (
              <option key={countryIn} value={countryIn}>
                {countryIn}
              </option>
            ))}
          </select>
          <small className="form-text">Your Current Country</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className="form-group">
          <CKEditor
            editor={ClassicEditor}
            data={bio}
            onBlur={(event, editor) => {
              const data = editor.getData();
              onEditorStateChange(data);
            }}
          />
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light"
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x" />
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x" />
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x" />
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x" />
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x" />
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={e => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  changeAvatar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile, changeAvatar }
)(withRouter(EditProfile));
