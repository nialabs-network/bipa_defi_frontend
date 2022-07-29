// Image Loader
export const fnLoader = ({ src, width, quality }) => {
  // Image Path Setting
  return `${process.env.NEXT_PUBLIC_IMG_URL}/${src}`;
};

export const s3Loader = ({ src, width, quality }) => {
  // Image Path Setting
  return `${process.env.NEXT_PUBLIC_S3_URL}/${src}`;
};
