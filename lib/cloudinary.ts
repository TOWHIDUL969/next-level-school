import "server-only";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Delete a video from Cloudinary using its public_id.
 */
export async function deleteCloudinaryVideo(
  publicId: string
) {
  if (!publicId?.trim()) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(
      publicId.trim(),
      {
        resource_type: "video",
      }
    );

    console.log(
      `Cloudinary video deleted: ${publicId}`,
      result
    );

    return result;
  } catch (error) {
    console.error(
      `Cloudinary video delete failed: ${publicId}`,
      error
    );

    throw error;
  }
}

export default cloudinary;