import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const PostForm = ({ addPost }) => {
  // const [text, setText] = useState('');

  const [formData, setFormData] = useState({
    text: "",
    setText: ""
  });

  const { text, setText } = formData;

  const onSubmit = e => {
    e.preventDefault();
    addPost({ text });
  };

  const onEditorStateChange = data => {
    try {
      setFormData({ ...formData, text: data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form className="form my-1" onSubmit={e => onSubmit(e)}>
        <CKEditor
          editor={ClassicEditor}
          data={text}
          onBlur={(event, editor) => {
            const data = editor.getData();
            onEditorStateChange(data);
          }}
        />
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(
  null,
  { addPost }
)(PostForm);
