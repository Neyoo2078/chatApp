import React from 'react';

const Validate = (values) => {
  let errors = {};

  if (!values.displayName) {
    errors.displayName = 'Required';
  }
  if (!values.about) {
    errors.about = 'Required';
  }

  return errors;
};
export default Validate;
