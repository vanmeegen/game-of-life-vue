<template>
<div class="editor">
  <div class="editor-header" onKeyPress={this.stop}>
    <HeaderBarComponent title="Game of Life" fpsId="fps" :tooltip="version()">
      <button type="button" class="btn btn-default btn-s" @click="clear">Clear</button>
      <button type="button" class="btn btn-default btn-s" @click="initRandom">Random</button>
      <button type="button" class="btn btn-default btn-s" @click="initRegular">Regular</button>
      <button type="button" class="btn btn-default btn-s" @click="nextGeneration">Next Gen</button>
      <button type="button" class="btn btn-default btn-s" @click="startInfinite">Run</button>
      <div class="btn btn-default btn-s">
        <label htmlFor="boardColumns" class="slider-label">Columns: ({board.maxX})</label>
        <input type="range" min="10" max="500" :value="board.maxX" name="boardColumns"
          title="number of board columns" @change="changeBoardSize"/>
      </div>
      <div class="btn btn-default btn-s">
        <label htmlFor="cellSize" class="slider-label">Cell: ({this.state.cellSize})</label>
        <input type="range" min="3" max="30" :value="cellSize" name="cellSize" title="pixel per cell"
                   @change="changeCellSize"/>
      </div>
    </HeaderBarComponent>
  </div>
  <div class="editor-container">
    <svg width="100vh" height="100vh" @mouse-down="onMouseDown">
      <g>
        <Grid :cellSize="cellSize" :maxX="board.maxX" :maxY="board.maxY"/>
        <CellGrid :cellSize="cellSize" :board="board"/>
      </g>
    </svg>
  </div>
</div>
</template>
<script>
import Vue = require("vue");
import Component from "vue-class-component";
import {Configuration} from "../common/Configuration";
import CellGrid from "./CellGrid.vue";
import Grid from "./Grid.vue";
import HeaderBarComponent from "./HeaderBarComponent.vue";
import {Board} from "../stores/ModelStore";
import {initRandom, initRegular, next, clear, size, set} from "../actions/ActionCreator";
import {Point} from "../util/Geometry";

@Component({
    props: {
       board: Board,
       cellSize: Number
    },
    components: {
      CellGrid, Grid, HeaderBarComponent
    }
   })
export default class GameOfLifeContainer extends Vue {
  /** padding around svg diagram to enabe moving elements outside of original bounds of container */
  private static PADDING_WIDTH: number = 10;

  /** flag if running infinite loop of generations */
  private infinite: boolean = false;

  board: Board;
  cellSize: number;

  initRandom(): void {
    initRandom();
  }

  initRegular(): void {
    initRegular();
  }
  nextGeneration(): void {
    next();
  }

  version(): string {
    return `Version: ${Configuration.version()} commit: ${Configuration.revision()} build time: ${Configuration.BUILD_TIME}`;
  }

  clear(): void {
    clear();
  }

  startInfinite(): void {
    this.infinite = true;
    requestAnimationFrame(this.autoGeneration);
    // update fps every second
    const fpsOut = document.getElementById("fps");
    setInterval(() => fpsOut.innerHTML = (1000 / this.totalFrameTime).toFixed(1) + " fps", 1000);
  }

  // The higher this value, the less the fps will reflect temporary variations
// A value of 1 will only keep the last value
  private filterStrength: number = 20;
  private totalFrameTime: number = 0;
  private lastGenerationTime: Date = new Date;

  autoGeneration(): void {
    if (this.infinite) {
      const thisGenerationTime = new Date;
      next();

      const thisFrameTime: number = (thisGenerationTime.getTime() - this.lastGenerationTime.getTime());
      this.totalFrameTime += (thisFrameTime - this.totalFrameTime) / this.filterStrength;
      this.lastGenerationTime = thisGenerationTime;
    }
    requestAnimationFrame(this.autoGeneration);
  }

  private changeBoardSize(evt: any): void {
    const value: number = parseInt(evt.target.value);
    size(value);
  }

  private changeCellSize(evt: any): void {
    const value: number = parseInt(evt.target.value);
    // TODO: implement
  }

  updateDimensions(): void {
/* TODO: implement
    if (this.refs["svgRef"]) {
      // bounding box of all svg elements in canvas should be new size of viewport

      const rect: SVGRect = (this.refs["svgRef"] as any).getBBox();

      // determine viewport width and height, enlarge by padding width
      const viewportWidth = rect.width + GameOfLifeContainer.PADDING_WIDTH * 2;
      const viewportHeight = rect.height + GameOfLifeContainer.PADDING_WIDTH * 2;
      const viewBoxString: string = `${-GameOfLifeContainer.PADDING_WIDTH} ${-GameOfLifeContainer.PADDING_WIDTH} ${viewportWidth - GameOfLifeContainer.PADDING_WIDTH} ${viewportHeight - GameOfLifeContainer.PADDING_WIDTH}`;
      (this.refs["svgRef"] as any).setAttribute("viewBox", viewBoxString);
      (this.refs["svgRef"] as any).setAttribute("width", viewportWidth);
      (this.refs["svgRef"] as any).setAttribute("height", viewportHeight);
    }
    */
  }

  private stop(): boolean {
    if (this.infinite) {
      this.infinite = false;
      return true;
    }
    return false;
  }

  private onMouseDown(e: any): void {
    this.log("mousedown", e);
    if (!this.stop()) {
      const {x, y}: Point = this.getBoardCoordinates(e);
      if (x >= 0 && x < this.board.maxX && y >= 0 && y < this.board.maxY) {
        const newValue = !this.board.cell(x ,y);
        set(x, y, newValue);
      }
    }
  }

  private getBoardCoordinates(e: any): Point {
    const cpt = this.convertClientToSVG(e.clientX, e.clientY);
    return new Point(Math.floor(cpt.x / this.cellSize), Math.floor(cpt.y / this.cellSize));
  }

  private  convertClientToSVG(x: number, y: number): Point {
/* TODO: implement
    const svg: SVGSVGElement = (this.refs["svgRef"] as any);
    // convert from screen to matrix coordinates
    const point = svg.createSVGPoint();
    const transform = svg.getScreenCTM().inverse();
    point.x = x;
    point.y = y;
    const transformedPoint = point.matrixTransform(transform);
    return new Point(transformedPoint.x, transformedPoint.y);
 */
   return new Point(0,0);
  }

  private log(evtName: string, e: any): void {
    log.trace(evtName, e.target);
  }


}
</script>


