export interface FlowchartPrimitiveState {
    x: number;
    y: number;
    height: number;
    width: number;
    rotation: number;
}

export interface FlowchartPrimitiveReducerAction {
    /**
     * The action to perform, I feel the names are self explanatory
     */
    action: "move" | "size" | "rotate",

    /**
     * Will this action set the value, or use +=
     * @default true
     */
    set?: boolean,

    /**
     * The values to use in the operation,
     * use [x, y] or [height, width]
     * Rotation uses a single value
     */
    payload: [number, number] | number;
}

/**
 * An abstract that represents a primitive element of a flowchart.
 * Primitives are the most basic component of a flowchart, being just squares, circles, and lines.
 */
export default abstract class FlowchartPrimitive {
    public reducer: any; //ReturnType<typeof useReducer>[1];
    public state: FlowchartPrimitiveState;

    public constructor (x: number, y: number, height: number, width: number, rotation: number = 0) {

        const state = {
            x, y, height, width, rotation
        };

        this.state = state;
        this.reducer = FlowchartPrimitive.reducerFunction;
    }

    private static reducerFunction(state: FlowchartPrimitiveState, { action, set = false, payload }: FlowchartPrimitiveReducerAction): FlowchartPrimitiveState {
        if (action == "move") {
            if (!(payload instanceof Array)) return state;
            let [x, y] = payload;
            if (!set) {
                x += state.x;
                y += state.y;
            }
            return { ...state, x, y };
        } else if (action == "size") {
            if (!(payload instanceof Array)) return state;
            let [height, width] = payload;
            if (!set) {
                height += state.height;
                width += state.width;
            }
            return { ...state, height, width };
        } else if (action == "rotate") {
            if (typeof payload !== "number") return state;
            if (!set) {
                payload += state.rotation;
            }
            return { ...state, rotation: payload, };
        }
        return state;
    }

    public render(): any;
    public render(ctx?: CanvasRenderingContext2D): any {
        if (ctx === undefined) return (<div></div>);
        return null;
    }
}