export default (a, b) => {
  if (a.github_username < b.github_username) {
    return -1;
  }
  if (a.github_username === b.github_username) {
    return 0;
  }

  return 1;
};
