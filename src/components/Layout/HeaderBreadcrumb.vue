<template>
  <div>
    <header class="page-header">
      <div class="container-fluid">
      </div>
    </header>
    <ul class="breadcrumb">
      <div class="container-fluid">
        <li class="breadcrumb-item font-weight-bold">{{this.$route.meta.area}}</li>
        <li class="breadcrumb-item active font-weight-bold">{{this.$route.meta.breadcrumb}}</li>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  created() {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
  components: {},
};
</script>

