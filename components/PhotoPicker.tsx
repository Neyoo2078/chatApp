import * as ReactDOM from 'react-dom';

const PhotoPicker = ({ change }: any) => {
  const photoPickerElement = document.getElementById(
    'photo-picker-element'
  ) as HTMLInputElement;
  const component = (
    <input
      type="file"
      hidden
      id="photo-picker"
      onChange={change}
      accept="image/png, image/gif, image/jpeg"
    />
  );

  return ReactDOM.createPortal(component, photoPickerElement);
};

export default PhotoPicker;
