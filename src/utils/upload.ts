import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'adebowale-motors',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        }
      )
      .end(buffer);
  });
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  try {
    // Extract public ID from URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `adebowale-motors/${filename.split('.')[0]}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};