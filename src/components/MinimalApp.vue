<template>
<h1 @click="onClick">{{message}}</h1>
</template>
<script>
import Vue = require("vue");
import Component from 'vue-class-component'

@Component export default class App extends Vue {
  // Initial data can be declared as instance properties
  message: string = "Hello!";
  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
</script>