<template>
  <section class="page">
    <div class="container-fluid">
      <div class="row">
        <div class="statistics col-lg-4">
          <div class="statistic d-flex align-items-center bg-white has-shadow">
            <div class="icon bg-red">
              <i class="fa fa-file"></i>
            </div>
            <div class="text">
              <strong>{{data.totalarticles}}</strong>
              <br>
              <small>Articles</small>
            </div>
          </div>
        </div>
        <div class="statistics col-lg-4">
          <div class="statistic d-flex align-items-center bg-white has-shadow">
            <div class="icon bg-orange">
              <i class="fa fa-mouse-pointer"></i>
            </div>
            <div class="text">
              <strong>{{data.totalviews}}</strong>
              <br>
              <small>Views</small>
            </div>
          </div>
        </div>
        <div class="statistics col-lg-4">
          <div class="statistic d-flex align-items-center bg-white has-shadow">
            <div class="icon bg-blue">
              <i class="fa fa-thumbs-up"></i>
            </div>
            <div class="text">
              <strong>{{data.totalvotes}}</strong>
              <br>
              <small>Votes</small>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top:30px">
        <div class="col-lg-6">
          <card-default>
            <div slot="header-card">Views By Categories</div>
            <div slot="body-card">
              <bar-chart :chartData="viewsBarChart" :options="options"></bar-chart>
            </div>
          </card-default>
        </div>
        <div class="col-lg-6">
          <card-default>
            <div slot="header-card">Votes By Categories</div>
            <div slot="body-card">
              <bar-chart :chartData="votesBarChart" :options="options"></bar-chart>
            </div>
          </card-default>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import axios from 'axios';
import { CardDefault } from '@/components/index';
// eslint-disable-next-line
import BarChart from '../../Common/BarChart.js';

export default {
  created() {
    axios
      .get(this.$store.state.config.dashboardArticlesUrl, {
        headers: { 'x-auth': this.$store.state.user.info.token },
      })
      .then(response => {
        this.data = response.data[0];
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Dashboard Data');
      });

    axios
      .get(this.$store.state.config.dashboardVotesUrl, {
        headers: { 'x-auth': this.$store.state.user.info.token },
      })
      .then(response => {
        const labels = response.data.map(item => item._id);
        const votes = response.data.map(item => item.votes);
        this.votesBarChart = {};
        this.votesBarChart.labels = labels;
        this.votesBarChart.datasets = [{ label: 'Votes', backgroundColor: '#85B4F2', data: votes }];
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Dashboard Data');
      });

    axios
      .get(this.$store.state.config.dashboardViewsUrl, {
        headers: { 'x-auth': this.$store.state.user.info.token },
      })
      .then(response => {
        const labels = response.data.map(item => item._id);
        const views = response.data.map(item => item.viewcount);
        this.viewsBarChart = {};
        this.viewsBarChart.labels = labels;
        this.viewsBarChart.datasets = [{ label: 'Views', backgroundColor: '#ffc36d', data: views }];
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Dashboard Data');
      });
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
      data: [],
      votes: [],
      views: [],
      viewsBarChart: null,
      votesBarChart: null,
    };
  },
  components: {
    BarChart,
    CardDefault,
  },
};
</script>

