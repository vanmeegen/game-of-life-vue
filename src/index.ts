import {Configuration} from "./common/configuration";
import Vue = require("vue");
// for minimal app test setup
import "./components/app.css";
import Comp from "./components/GameOfLifeContainer.vue";
import modelStore from "./stores/ModelStore";
import {set} from "./actions/ActionCreator";
/*
 * Bootstrap the app
 */
function main(): void {
  console.log("running in mode " + (Configuration.isDevelopment() ? "development" : "production"));
  set(1,1,true);
  new Vue({
    el: '#app-container',
    // template: '',
    render: h => h(Comp,
        {
          props: {
            board: modelStore.board,
            cellSize: 30
          }
        })
});
}
main();

