export const getUTCDate = () => {
  return new Date(new Date().toUTCString());
};
