const handleSignup = () => {
  const formData = new FormData(document.getElementById('signup-form'));
  const data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });

  if (!data.username || !data.password || !data.email)
    return alert('Email, username and password are required');
  if (
    !data.email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  )
    return alert('Invalid email');
  if (data.username.length > 30)
    return alert('User name must has at most 30 characters');
  if (data.username.length < 3)
    return alert('User name must has at least 3 characters');
  if (data.password.length < 6)
    return alert('Password must be 6 characters or longer');

  _post('/user/signup', { body: data })
    .then(() => {
      window.location.href = '/';
    })
    .catch((err) => {
      console.log(err);
      alert(err.message || 'Something went wrong, try later');
    });
};
