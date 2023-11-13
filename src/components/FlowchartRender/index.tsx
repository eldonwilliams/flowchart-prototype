import PanView, { PanViewCoordinatesToGlobal, PanViewState } from "../PanView";
import './FlowchartRender.css';
import { Fragment, useEffect, useState } from "react";
import Canvas from "../../Canvas";
import FlowchartComponent, { FlowchartComponentTypes, createFlowchartComponent } from "../../FlowchartComponents";
import RectangleComponent from "./RectangleComponent";
import CircleComponent from "./CircleComponent";
import useFlowchartComponents from "../../hooks/useFlowchartComponents";

const ComponentRenders = {
    [FlowchartComponentTypes.Rectangle]: RectangleComponent,
    [FlowchartComponentTypes.Circle]: CircleComponent,
}

export interface FlowchartRenderProps {

}

/**
 * Props that are given to components
 */
export interface FlowchartComponentProps {

}

const component = createFlowchartComponent(FlowchartComponentTypes.Rectangle, 10, 10, 5, 5, 0);

/**
 * A component whose job is to render a flowchart, given some data
 * Limited interaction
 * @returns 
 */
export default function FlowchartRender(props: FlowchartRenderProps) {
    const [renderStateRef, setRenderStateRef] = useState<PanViewState | null>();

    const [components, reduceComponents] = useFlowchartComponents([
        component
    ]);

    return (
        <>
            <PanView
                stateFunction={setRenderStateRef}
                viewChildren={
                        <Canvas
                            renderFn={(ctx) => {
                                if (!renderStateRef) return;
                                ctx.strokeStyle = "#000";
                                ctx.beginPath();
                                const [x1, y1] = PanViewCoordinatesToGlobal(renderStateRef, 10, 10);
                                const [x2, y2] = PanViewCoordinatesToGlobal(renderStateRef, 30, 30);
                                ctx.moveTo(x1, y1);
                                ctx.lineTo(x2, y2);
                                ctx.stroke();
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                }
            >
                {components.map((v, i) => <Fragment key={i}>
                    {(ComponentRenders[v.type])(v)}
                </Fragment>)}
            </PanView>
            <button onClick={() => {
                reduceComponents({
                    action: 'move',
                    element: component.uuid,
                    payload: [Math.random() * 5, Math.random() * 5],
                    set: true,
                })
            }}>
                Randomly Update Component
            </button>
        </>
    );
}