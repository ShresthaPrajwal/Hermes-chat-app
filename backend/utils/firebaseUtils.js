const firebaseUtils = require('../service/firebase-admin')

const uploadPhotoToFirebase = async (file) => {
  try {
    const uploadResult = await firebaseUtils.bucket.upload(file.path, {
      destination: `profile_pictures/${file.filename}`,
      metadata: {
        contentType: file.mimetype,
      },
    });
    const url = await uploadResult[0].getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });
    return url[0];
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw new Error("File upload failed");
  }
};

module.exports = { uploadPhotoToFirebase}