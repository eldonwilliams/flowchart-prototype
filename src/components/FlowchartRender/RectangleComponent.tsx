import { FlowchartComponentProps } from ".";
import useComponent from "./useComponent";

export default function RectangleComponent(props: FlowchartComponentProps) {
    const componentProps = useComponent(props);

    return (
        <div
            {...componentProps}
            style={{
                ...componentProps.style,
                border: '1px solid black',
                background: 'white',
            }}
        />
    )
}