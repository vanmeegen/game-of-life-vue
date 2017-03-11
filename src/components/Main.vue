<template>
    <GameOfLifeContainer :board="board" :cellSize="cellSize"/>
</template>
<script>
import Vue = require("vue");
import Component from 'vue-class-component'
import log from "../Logger";
import GameOfLifeContainer from "./GameOfLifeContainer.vue";
import modelStore from "../stores/ModelStore";

@Component({
components: {
    GameOfLifeContainer
  }
})
 export default class Main extends Vue {
  data() {
      return {
        board: modelStore.board,
        cellSize: 10
      }
  }
}
</script>


