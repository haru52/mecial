import crypto from "crypto";

// https://railstutorial.jp/chapters/sign_up?version=5.1#sec-a_gravatar_image
export function getGravatarUrl(email: string, size = 80) {
  const gravatarId = crypto.createHash("md5").update(email).digest("hex");
  return `https://secure.gravatar.com/avatar/${gravatarId}?s=${size}`;
}

/** https://medium.com/@malikhamzav/how-to-close-daisyui-dropdown-on-click-ea65c5749410 */
export function closeDaisyUiDropdown() {
  const element = document.activeElement;
  if (element instanceof HTMLElement) element.blur();
}
