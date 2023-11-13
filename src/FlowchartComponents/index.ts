export enum FlowchartComponentTypes {
    Rectangle = "Rectangle",
    Circle = "Circle",
}

export default interface FlowchartComponent {
    /**
     * A unique identifier for this component
     */
    uuid: string;

    /**
     * The x position of the component
     */
    x: number;

    /**
     * the y position of the component
     */
    y: number;

    /**
     * The width of the compoennt
     */
    width: number;

    /**
     * The height of the component
     */
    height: number;

    /**
     * The rotation of the component
     */
    rotation: number;

    /**
     * The connections to other flowchart components
     * @todo currently does nothing
     */
    connections: FlowchartComponent[],

    /**
     * The type of component this is
     */
    type: FlowchartComponentTypes,
}

export function createFlowchartComponent(type: FlowchartComponentTypes, x: number = 0, y: number = 0,
    height: number = 10, width: number = 10, rotation: number = 0): FlowchartComponent {
        return ({
            x, y, height, width, rotation, type,
            connections: [],
            uuid: crypto.randomUUID(),
        })
}