const submitSignInForm = () => {
  const name = document.querySelector("#name-text-box").value.toUpperCase();
  const password = document.querySelector("#password-text-box").value;

  const request = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, password }),
  };

  fetch("/sign-in", request).then((res) => {
    if (res.status === 200) {
      location.replace("/");
      return;
    }
    alert("Bad Credentials");
  });
};

const main = () => {
  const signInForm = document.querySelector("#sign-in-form");

  signInForm.onsubmit = (event) => {
    event.preventDefault();

    submitSignInForm();
  };
};

window.onload = main;
