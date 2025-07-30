export function logoutUserOnTokenError() {
  localStorage.clear();
  window.location.href = '/';
}
