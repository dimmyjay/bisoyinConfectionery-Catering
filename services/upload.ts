// services/upload.ts

import {
  uploadProductImage,
  uploadGalleryImage,
  uploadProfileImage,
} from "@/firebase/storage";


// ===============================
// Upload Product Image
// ===============================

export async function uploadProduct(
  file: File
) {

  try {

    const url =
      await uploadProductImage(file);

    return url;


  } catch(error){

    console.error(
      "Product image upload failed:",
      error
    );

    throw error;

  }

}



// ===============================
// Upload Gallery Image
// ===============================

export async function uploadGallery(
  file: File
) {

  try {

    const url =
      await uploadGalleryImage(file);

    return url;


  } catch(error){

    console.error(
      "Gallery image upload failed:",
      error
    );

    throw error;

  }

}



// ===============================
// Upload User Profile Image
// ===============================

export async function uploadProfile(
  file: File
) {

  try {

    const url =
      await uploadProfileImage(file);

    return url;


  } catch(error){

    console.error(
      "Profile image upload failed:",
      error
    );

    throw error;

  }

}



// ===============================
// Upload Multiple Images
// ===============================

export async function uploadMultipleImages(
  files: File[],
  type:
    | "product"
    | "gallery"
    | "profile"
) {

  try {

    const uploads =
      files.map((file)=>{

        if(type === "product"){

          return uploadProductImage(
            file
          );

        }


        if(type === "gallery"){

          return uploadGalleryImage(
            file
          );

        }


        return uploadProfileImage(
          file
        );

      });


    const urls =
      await Promise.all(
        uploads
      );


    return urls;


  } catch(error){

    console.error(
      "Multiple upload failed:",
      error
    );

    throw error;

  }

}