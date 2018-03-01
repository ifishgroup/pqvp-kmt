<template>
<div class="page-error404">
    <div class="error-container404">
        <div class="error-code404">404</div>
        <div class="error-text404">page not found</div>
        <div class="error-subtext404">Unfortunately we're having trouble loading the page you are looking for. Please wait a moment and try again or use action below.</div>
        <div class="error-actions404">
            <div class="row">
                <div class="col-md-12">
                    <button class="btn btn-info btn-block btn-lg" @click="$router.push('/')">HOME</button>
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
};
</script>

<style scoped>
.page-error404 {
  width: 100%;
  height: 500px;
  background: linear-gradient(
    45deg,
    rgb(135, 28, 10) 20%,
    rgb(252, 124, 15) 61%,
    rgb(253, 121, 20) 100%
  );
}

.error-container404 {
  margin: auto;
  width: 60%;
  min-height: 100%;
  padding: 20px;
}

.error-code404 {
  vertical-align:middle;
  min-height: 100%;
  width: 100%;
  color: #fff;
  font-size: 12em;
  line-height: 130px;
  text-align: center;
  font-weight: bold;
  font-family: Helvetica;
  text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9,
    0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2),
    0 5px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2),
    0 20px 20px rgba(0, 0, 0, 0.15);
}

.error-text404 {
  float: left;
  width: 100%;
  margin-top: 10px;
  font-size: 26px;
  line-height: 24px;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
  font-weight: 400;
}

.error-subtext404 {
  float: left;
  width: 100%;
  margin: 30px 0px 10px;
  font-size: 13px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  font-weight: 400;
}

.error-container404 .error-actions404 {
  float: left;
  width: 100%;

}
</style>
