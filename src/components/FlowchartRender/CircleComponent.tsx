import { FlowchartComponentProps } from ".";
import useComponent from "./useComponent";

export default function CircleComponent(props: FlowchartComponentProps) {
    const componentProps = useComponent(props);

    return (
        <div
            {...componentProps}
            style={{
                ...componentProps,
                border: '1px solid black',
                background: 'white',
                borderRadius: '100%',
            }}
        />
    )
}