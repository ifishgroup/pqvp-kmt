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
    copyright() {
      const d = new Date();
      const n = d.getFullYear();

      return `Copyright &copy; ${n}, The iFish Group, Inc.`;
    },
  },
  components: {},
};
</script>

