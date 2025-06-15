export function setCookie(name: string, value: string, daysToExpire = 999999) {
  if (typeof window === "undefined") return;

  var expires = "";
  if (daysToExpire) {
    var date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function deleteCookie(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

export function getCookie(name: string) {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift();
  return null;
}
