<template>
<div class="card">
    <!-- <div class="card-close">
        <div class="dropdown">
            <button type="button" id="closeCard" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-ellipsis-v"></i></button>
            <div aria-labelledby="closeCard" class="dropdown-menu has-shadow"><a href="#" class="dropdown-item remove"> <i class="fa fa-times"></i>Close</a></div>
        </div>
    </div> -->
    <div class="card-header d-flex align-items-center">
        <h3 class="h4"><slot name="header-card"></slot></h3>
    </div>
    <div class="card-body">
        <slot name="body-card"></slot>
    </div>
</div>
</template>

<script>
export default {
    data() {
            return {}
        },
        methods: {},
        computed: {},
        components: {}
}
</script>

