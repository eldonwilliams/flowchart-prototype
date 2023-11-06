class FlowchartComponent {
    public x: number = 0;
    public y: number = 0;

    private connections: FlowchartComponent[];
    
    constructor() {
        this.connections = [];
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