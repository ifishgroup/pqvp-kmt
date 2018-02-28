<template>
<div>
  <header class="page-header">
                      <div class="container-fluid">
                          <h2 class="no-margin-bottom">{{this.$route.meta.title}}</h2>
                      </div>
 </header>
                  <ul class="breadcrumb">
                      <div class="container-fluid">
                          <li class="breadcrumb-item">{{this.$route.meta.area}}</li>
                          <li class="breadcrumb-item active">{{this.$route.meta.breadcrumb}}</li>
                      </div>
                  </ul>
</div>
</template>

<script>

export default {
  created() {

  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {},
  components: {}
};
</script>

