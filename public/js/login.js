document.addEventListener('DOMContentLoaded', function () {
  var submitBtn     = document.querySelector('#btn-submit');
  var usernameInput = document.querySelector('#input-username');
  var passwordInput = document.querySelector('#input-password');
  var form          = document.querySelector('#login-form');
  var $error        = $('#error');
  var md5           = window.md5;

  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();

    var username = usernameInput.value;
    var password = passwordInput.value;

    password = md5(password);

    if (!username || !password) {
      alert('必须同时填写用户名和密码');

      return;
    }

    $.ajax({
      url     : '/login',
      data    : {
        account: username,
        password: password
      },
      type    : "POST",
      complete: function (res) {
        res = JSON.parse(res.responseText);
        if (res.code === 0) {
          location.href = "/";
        } else {
          $error.text(res.desc);
          $error.removeClass('hidden');
        }
      }
    });
  });
});
