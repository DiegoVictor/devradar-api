module.exports = (request, options) => {
  let mocked;

  ['axios', 'socket.io'].every((module) => {
    if (request.search(new RegExp(module, 'gi')) > -1) {
      mocked = module;
      return false;
    }
    return true;
  });

  if (mocked) {
    return `${options.rootDir}/mocks/${mocked}.js`;
  }

  return options.defaultResolver(request, options);
};
