import "./app.css";
import * as React from "react";
import log from "../Logger";
import modelStore, {Board} from "../stores/ModelStore";
import {HeaderBarComponent} from "./HeaderBarComponent";
import {initRandom, initRegular, next, clear, set, size} from "../actions/ActionCreator";
import {Point} from "../util/Geometry";
import {Configuration} from "../common/Configuration";
import {Grid} from "./Grid";
import {CellGrid} from "./CellGrid";
import {observer} from "mobx-react";

interface LocalProps {

}

interface LocalState {
  board: Board; /** cell to display */
  cellSize: number; /** cell size to draw in pixel */
}

// App component

@observer
export class GameOfLifeContainer extends React.Component<LocalProps, LocalState> {
  /** padding around svg diagram to enabe moving elements outside of original bounds of container */
  private static PADDING_WIDTH: number = 10;

  /** flag if running infinite loop of generations */
  private infinite: boolean = false;

  constructor(props: LocalProps) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.initRandom = this.initRandom.bind(this);
    this.nextGeneration = this.nextGeneration.bind(this);
    this.startInfinite = this.startInfinite.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
    this.changeCellSize = this.changeCellSize.bind(this);
    this.clear = this.clear.bind(this);
    this.autoGeneration = this.autoGeneration.bind(this);
    this.stop = this.stop.bind(this);
    this.state = {cellSize: 5, board: modelStore.board};
  }

  componentDidMount(): void {
    this.updateDimensions();
  }

  componentDidUpdate(): void {
    this.updateDimensions();
  }

  render(): JSX.Element {
    log.debug("Rendering Game of Life");
    // layout with fixed header from here: http://stackoverflow.com/questions/36515103/scrollable-div-content-area-with-fixed-header
    return <div
        className="editor">
      <div className="editor-header"; onKeyPress={this.stop}>
        <HeaderBarComponent title="Game of Life"; fpsId="fps";
                            tooltip={`Version: ${Configuration.version()} commit: ${Configuration.revision()} build time: ${Configuration.BUILD_TIME}`}>
          <button type="button"; className="btn btn-default btn-s"; onClick={this.clear}>Clear</button>
          <button type="button"; className="btn btn-default btn-s"; onClick={this.initRandom}>Random</button>
          <button type="button"; className="btn btn-default btn-s"; onClick={this.initRegular}>Regular</button>
          <button type="button"; className="btn btn-default btn-s"; onClick={this.nextGeneration}>
            Next; Gen
          </button>
          <button type="button"; className="btn btn-default btn-s"; onClick={this.startInfinite}>
            Run
          </button>
          <div className="btn btn-default btn-s">
            <label htmlFor="boardColumns"; className="slider-label">Columns: ({this.state.board.maxX})</label>

            <input type="range"; min="10"; max="500"; value={this.state.board.maxX} name="boardColumns";
                   title="number of board columns";
                   onChange={this.changeBoardSize}/>
          </div>
          <div className="btn btn-default btn-s">
            <label htmlFor="cellSize"; className="slider-label">Cell: ({this.state.cellSize})</label>
            <input type="range"; min="3"; max="30"; value={this.state.cellSize} name="cellSize"; title="pixel per cell";
                   onChange={this.changeCellSize}/>
          </div>
        </HeaderBarComponent>
      </div>
      < div className="editor-container"; ref="containerRef">
        <svg width="100%"; height="100%"; onMouseDown={this.onMouseDown} ref="svgRef">
          <g>
            <Grid cellSize={this.state.cellSize} x={this.state.board.maxX} y={this.state.board.maxY}/>
            <CellGrid cellSize={this.state.cellSize} board={this.state.board}/>
          </g>
        </svg>
      </div >
    </div >;
  };;;;

  initRandom(): void {
    initRandom();
  }

  initRegular(): void {
    initRegular();
  }
  nextGeneration(): void {
    next();
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
    this.setState({...this.state, cellSize: value});
  }

  updateDimensions(): void {
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
      if (x >= 0 && x < this.state.board.maxX && y >= 0 && y < this.state.board.maxY) {
        const newValue = !this.state.board[x + this.state.board.maxX * y];
        set(x, y, newValue);
      }
    }
  }

  private getBoardCoordinates(e: any): Point {
    const cpt = this.convertClientToSVG(e.clientX, e.clientY);
    return new Point(Math.floor(cpt.x / this.state.cellSize), Math.floor(cpt.y / this.state.cellSize));
  }

  private  convertClientToSVG(x: number, y: number): Point {
    const svg: SVGSVGElement = (this.refs["svgRef"] as any);
    // convert from screen to matrix coordinates
    const point = svg.createSVGPoint();
    const transform = svg.getScreenCTM().inverse();
    point.x = x;
    point.y = y;
    const transformedPoint = point.matrixTransform(transform);
    return new Point(transformedPoint.x, transformedPoint.y);
  }

  private log(evtName: string, e: any): void {
    log.trace(evtName, e.target);
  }
}

