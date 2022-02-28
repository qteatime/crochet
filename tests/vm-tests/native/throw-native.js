exports.default = (ffi) => {
  ffi.defmachine("throw-native.trapped", function* () {
    const promise = new Promise((_, reject) => reject(true));
    try {
      yield ffi.await(promise);
      return ffi.boolean(false);
    } catch (e) {
      return ffi.boolean(e);
    }
  });
};
