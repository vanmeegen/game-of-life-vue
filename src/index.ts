import {Configuration} from "./common/Configuration";
import Vue = require("vue");
// for minimal app test setup
import "bootstrap/dist/css/bootstrap.css";
import "./components/app.css";
import Comp from "./components/Main.vue";
/*
 * Bootstrap the app
 */
function main(): void {
  console.log("running in mode " + (Configuration.isDevelopment() ? "development" : "production"));
  new Vue({
    el: '#app-container',
    render: h => h(Comp)
});
}
main();

