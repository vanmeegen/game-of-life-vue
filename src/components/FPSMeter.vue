<template>
  <h6 style="margin: 5px; display: inline-block">FPS
    <span class="label label-default" :id="id">0</span>
  </h6>
</template>
<script>
import Vue = require("vue");
import Component from 'vue-class-component'
import log from "../Logger";


@Component({
props: {
  id: String
  }
})
export default class FPSMeter extends Vue {
  id: string;
}
</script>