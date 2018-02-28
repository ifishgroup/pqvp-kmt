<template>
<footer class="main-footer">
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <p>2018 PQVP Prototype</p>
      </div>
      <div class="col-sm-6 text-right">
        <p v-html="copyright"></p>
      </div>
    </div>
  </div>
</footer>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    copyright: function() {
      var d = new Date();
      var n = d.getFullYear();

      return "&copy; iFish Group " + n;
    }
  },
  components: {}
};
</script>

