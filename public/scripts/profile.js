const handleResetForm = () => {
  document.getElementById("profile-form").reset();
};

const handleSubmitProfile = () => {
  const formData = new FormData(document.getElementById("profile-form"));
  const data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });
  if (data.image && !isValidURL(data.image)) {
    return alert("Image is not an url");
  }
  if (data.nickname && data.nickname.length > 30) {
    return alert("Nick name must has at most 30 characters");
  }
  if (data.username) {
    if (data.username.length > 30)
      return alert("User name must has at most 30 characters");
    if (data.username.length < 3)
      return alert("User name must has at least 3 characters");
  }
  if (data.age && data.age < 5) {
    return alert("You must be at least 5 years old");
  }
  if (data.password) {
    if (data.password.length < 6)
      return alert("Password must be 6 characters or longer");
    if (data.password !== data.confirm_password)
      return alert("Password not match");
  }
  const payload = {};
  if (data.username) payload.username = data.username;
  if (data.nickname) payload.nickname = data.nickname;
  if (data.image) payload.image = data.image;
  if (data.age) payload.age = +data.age;
  if (data.password) payload.password = data.password;
  console.log(payload);
  _patch("/user/profile", { body: payload })
    .then(() => {
      window.location.href = "/";
    })
    .catch((err) => {
      console.log(err);
      alert(err.message || "Something went wrong, try later");
    });
};
