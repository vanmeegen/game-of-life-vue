import {Configuration} from "./common/configuration";
import Vue = require("vue");
// for minimal app test setup
import App from "./components/MinimalApp.vue";

/*
 * Bootstrap the app
 */
function main(): void {
  console.log("running in mode " + (Configuration.isDevelopment() ? "development" : "production"));
  new Vue({
    el: '#app-container',
    render: h => h(App)
  });
}
main();

