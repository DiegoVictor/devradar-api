export default arrayAsString => {
  return arrayAsString.split(',').map(tech => tech.trim());
};
