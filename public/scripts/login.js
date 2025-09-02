const handleLogin = () => {
  const formData = new FormData(document.getElementById('login-form'));
  const data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });

  if (!data.username || !data.password)
    return alert('Username and password are required');
  if (data.username.length > 30)
    return alert('User name must has at most 30 characters');
  if (data.username.length < 3)
    return alert('User name must has at least 3 characters');
  if (data.password.length < 6)
    return alert('Password must be 6 characters or longer');

  _post('/user/login', { body: data })
    .then(() => {
      window.location.href = '/';
    })
    .catch((err) => {
      console.log(err);
      alert(err.message || 'Something went wrong, try later');
    });
};
