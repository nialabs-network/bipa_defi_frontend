// Image Loader
export const fnLoader = ({ src, width, quality }) => {
  // Image Path Setting
  return `${process.env.NEXT_PUBLIC_IMG_URL}/${src}`;
};
