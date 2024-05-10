/** https://medium.com/@malikhamzav/how-to-close-daisyui-dropdown-on-click-ea65c5749410 */
export function closeDaisyUiDropdown() {
  const element = document.activeElement;
  if (element instanceof HTMLElement) element.blur();
};
