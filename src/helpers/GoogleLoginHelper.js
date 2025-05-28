import { LoginHelper } from './LoginHelper';

function handleCredentialResponse(response) {
  const responsePayload = parseJwt(response.credential);

  LoginHelper.googleSignIn(response, responsePayload);
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "948335850914-p4vkdqkftoejol9nb8ka1m3tie6sodnb.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("GoogleLogin"),
    { theme: "outline", size: "large" }
  );
  google.accounts.id.prompt();

}