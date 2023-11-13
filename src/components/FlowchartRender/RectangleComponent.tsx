import FlowchartComponent from "../../FlowchartComponents";

export default function RectangleComponent(props: FlowchartComponent & {
    setState: Function,
}) {
    return (
        <div
            style={{
                position: 'absolute',
                transform: `translate(${props.x}px, ${props.y}px)`,
                width: props.width,
                height: props.height,
                border: '1px solid black',
                background: 'white',
                cursor: 'pointer',
            }}
            onClick={() => props.setState([
                { x: Math.random() * 30, y: Math.random() * 60, height: Math.random() * 10, width: Math.random() * 20, type: "Rectangle", connections: [], },
            ])}
        />
    )
}