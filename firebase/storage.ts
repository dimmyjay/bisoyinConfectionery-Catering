// firebase/storage.ts

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "./config";


// ===============================
// Upload File
// ===============================

export async function uploadFile(
  file: File,
  folder: string
) {
  try {

    const fileName =
      `${Date.now()}-${file.name}`;

    const storageRef = ref(
      storage,
      `${folder}/${fileName}`
    );


    const snapshot = await uploadBytes(
      storageRef,
      file
    );


    const downloadURL =
      await getDownloadURL(
        snapshot.ref
      );


    return downloadURL;


  } catch (error) {

    console.error(
      "File upload failed:",
      error
    );

    throw error;
  }
}



// ===============================
// Upload Product Image
// ===============================

export async function uploadProductImage(
  file: File
) {

  return uploadFile(
    file,
    "products"
  );

}



// ===============================
// Upload Gallery Image
// ===============================

export async function uploadGalleryImage(
  file: File
) {

  return uploadFile(
    file,
    "gallery"
  );

}



// ===============================
// Upload Profile Image
// ===============================

export async function uploadProfileImage(
  file: File
) {

  return uploadFile(
    file,
    "profiles"
  );

}



// ===============================
// Delete File
// ===============================

export async function deleteFile(
  fileUrl: string
) {

  try {

    const fileRef = ref(
      storage,
      fileUrl
    );


    await deleteObject(
      fileRef
    );


  } catch(error){

    console.error(
      "Delete file failed:",
      error
    );

    throw error;
  }

}