const getAsset = (path: string) => {
  return `${import.meta.env.VITE_BASE_URL}${path}`;
};

export default getAsset;