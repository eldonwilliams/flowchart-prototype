import FlowchartComponent from "../../FlowchartComponents";

export default function RectangleComponent(props: FlowchartComponent) {
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
        />
    )
}