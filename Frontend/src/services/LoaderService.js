// export const registerLoader = (showFn, hideFn) => {
//   _show = showFn;
//   _hide = hideFn;
// };

// export const showLoader = () => _show();
// export const hideLoader = () => _hide();
let _show = () => {};
let _hide = () => {};

export const registerLoader = (showFn, hideFn) => {
  _show = showFn;
  _hide = hideFn;
};

export const showLoader = () => _show();
export const hideLoader = () => _hide();
