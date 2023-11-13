export enum FlowchartComponentTypes {
    Rectangle = "Rectangle",
    Circle = "Circle",
}

export default interface FlowchartComponent {
    x: number;
    y: number;
    width: number;
    height: number;
    connections: FlowchartComponent[],
    type: FlowchartComponentTypes,
}