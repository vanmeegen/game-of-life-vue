<template>
<h1 @click="onClick">Comp {{message}}</h1>
</template>
<script>
import Vue = require("vue");
import Component from 'vue-class-component'

@Component({
  props: {
    message: String
  }
}) export default class MinimalComponent extends Vue {
  // Initial data can be declared as instance properties
  message: string;
  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
</script>