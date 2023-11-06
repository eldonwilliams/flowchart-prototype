/**
 * A interface which represents a FlowchartComponents state
 */
interface FlowchartComponentState {
    x: number;
    y: number;
    height: number;
    width: number;
}

interface FlowchartComponentReducerAction {
    /**
     * The actions will *set* the values, not add
     */
    action: 'move' | 'resize',

    /**
     * Payload is [x, y] or [height, width]
     */
    payload: [number, number],
}

export default class FlowchartComponent {
    public x: number = 0;
    public y: number = 0;

    private connections: FlowchartComponent[];
    
    constructor(public height: number = 10, public width: number = 10) {
        this.connections = [];
    }

    /**
     * The reducer for this object, as a React element.
     * We use this so that we will be able to trigger rerenderers
     * 
     * @param state the current state
     * @param payload A payload of what to change
     * @returns the new state
     */
    private reducer(state: FlowchartComponentState, payload: FlowchartComponentReducerAction): FlowchartComponentState {
        const newState = { ...state };

        if (payload.action === "move") {
            newState.x = payload.payload[0];
            newState.y = payload.payload[1];
        } else if (payload.action === "resize") {
            newState.height = payload.payload[0];
            newState.width = payload.payload[1];
        }

        return newState;
    }

    /**
     * Sets the Flowchart Components position, 0,0 is the middle of the screen with no scrolling
     * @param x the x
     * @param y the y
     */
    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Render the Flowchart Component
     */
    public render() {
        return (<div></div>);
    }
}