import Vue from "vue";
import Component from "vue-class-component";
import log from "../Logger";

/**
 * draw a cell of a grid
 * @author Marco van Meegen
 */
interface LocalProps {
  cellSize: number;
  x: number;
  y: number;
  alive: boolean;
}

@observer
export class Cell extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: LocalProps): boolean {
    return !shallowequal(nextProps, this.props);
  }

  render(): JSX.Element {
    log.debug("Rendering Cell " + this.props.x + "," + this.props.y);
    return <rect x={this.props.x * this.props.cellSize + 1} y={this.props.y * this.props.cellSize + 1}
                 width={this.props.cellSize - 2} height={this.props.cellSize - 2}
    className = {this.props.alive ? "field-filled" : "field-empty"
  }/>
  }
}

// The @Component decorator indicates the class is a Vue component
@Component({
  // All component options are allowed in here
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Initial data can be declared as instance properties
  message: string = 'Hello!';
  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
