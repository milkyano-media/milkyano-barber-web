const getAsset = (path: string) => {
  return `${import.meta.env.VITE_BASE_URL_MINIO}${path}`;
};

export default getAsset;