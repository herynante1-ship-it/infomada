import imageCompression from 'imagecompression';

interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

export const compressImage = async (
  file: File,
  options: CompressOptions = {}
): Promise<File> => {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    useWebWorker = true,
  } = options;

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
    });
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Return original if compression fails
  }
};

export const compressImages = async (files: File[]): Promise<File[]> => {
  return Promise.all(files.map((file) => compressImage(file)));
};
