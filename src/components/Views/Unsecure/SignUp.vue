<template>
<div class="page login-page">
  <div class="container d-flex align-items-center">
    <div class="form-holder has-shadow">
      <div class="row">
        <div class="col-lg-6">
          <div class="info d-flex align-items-center">
            <div class="content">
              <div class="logo-register">
                <h1>REGISTER</h1>
              </div>
              <p>PQVP Knowledge Management Tool</p>
            </div>
          </div>
        </div>
        <div class="col-lg-6 bg-white">
          <div class="form d-flex align-items-center">
            <div class="content">
              <form id="register-form">
                <div class="form-group">
                  <input id="register-username" type="text" name="registerUsername" required="" class="input-material">
                  <label for="register-username" class="label-material">User Name</label>
                </div>
                <div class="form-group">
                  <input id="register-email" type="email" name="registerEmail" required="" class="input-material">
                  <label for="register-email" class="label-material">Email Address</label>
                </div>
                <div class="form-group">
                  <input id="register-passowrd" type="password" name="registerPassword" required="" class="input-material">
                  <label for="register-passowrd" class="label-material">Password</label>
                </div>
                <div class="form-group terms-conditions">
                  <input id="license" type="checkbox" class="checkbox-template">
                  <label for="license">Agree the terms and policy</label>
                </div>
                <input id="register" type="submit" value="Register" class="btn btn-primary">
              </form><small>Already have an account? </small><router-link to="/login" class="signup">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
    export default {
  data() {
    return {};
  },
  components: {
  }
};
</script>
