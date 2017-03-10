<template>
<g>
    <CellRow v-for="(row,y) in board.cells" :maxX="board.maxX" :maxY="board.maxY" :y="y" :cellSize="cellSize" :boardRow="row" :key="y"/>
</g>
</template>
<script>
import Vue = require("vue");
import Component from 'vue-class-component'
import CellRow from "./CellRow.vue";
import log from "../Logger";
import {Board} from "../stores/ModelStore"


@Component({
    props: {
        cellSize: Number,
        board: Board
    },
    components: {CellRow}
})
 export default class CellGrid extends Vue {
  cellSize: number;
  board: Board;
}
</script>

