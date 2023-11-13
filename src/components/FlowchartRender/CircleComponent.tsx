import FlowchartComponent from "../../FlowchartComponents";

export default function CircleComponent(props: FlowchartComponent) {
    return (
        <div
            style={{
                position: 'absolute',
                transform: `translate(${props.x}px, ${props.y}px)`,
                width: props.width,
                height: props.height,
                border: '1px solid black',
                background: 'white',
                borderRadius: '100%',
            }}
        />
    )
}