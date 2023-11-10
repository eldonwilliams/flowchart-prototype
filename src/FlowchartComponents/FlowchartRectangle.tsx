import FlowchartPrimitive from "./FlowchartPrimitive";
import './FlowchartRectangle.css';

export default class FlowchartRectangle extends FlowchartPrimitive {
    public render(): any;
    public render(ctx?: CanvasRenderingContext2D | undefined): any {
        if (ctx) return null;

        return (
            <div
                className="flowchart-rectangle"
                style={{
                    transform: `translate(${this.state.x}px, ${this.state.y}px)`,
                    height: this.state.height,
                    width: this.state.width,
                }}
                onClick={() => this.state = this.reducer(this.state, {
                    action: 'move',
                    payload: [10, 2],
                })}
            >
            </div>
        );
    }
}