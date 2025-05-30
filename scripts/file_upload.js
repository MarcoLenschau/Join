function extractFileExtension(file) {
  let filename = file.split('.');
  return filename[filename.length - 1];
}

function checkFormatOfFile(file) {
  const fileExtension = extractFileExtension(file.name).toLocaleLowerCase();
  if (fileExtension === 'svg' || fileExtension === 'jpeg' || fileExtension === 'png') {
    return true;
  } else {
    return false;
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}