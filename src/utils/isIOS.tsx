export function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
