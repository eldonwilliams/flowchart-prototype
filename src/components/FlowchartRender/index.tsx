import PanView, { PanViewState } from "../PanView";
import './FlowchartRender.css';
import { Fragment, useState } from "react";
import Canvas from "../../Canvas";
import FlowchartComponent, { FlowchartComponentTypes, createFlowchartComponent } from "../../FlowchartComponents";
import RectangleComponent from "./RectangleComponent";
import CircleComponent from "./CircleComponent";
import useFlowchartComponents from "../../hooks/useFlowchartComponents";
import { panviewPointToViewport } from "../../util/CoordinateMath";

const ComponentRenders = {
    [FlowchartComponentTypes.Rectangle]: RectangleComponent,
    [FlowchartComponentTypes.Circle]: CircleComponent,
}

export interface FlowchartRenderProps {

}

/**
 * Props that are given to components
 */
export interface FlowchartComponentProps extends FlowchartComponent {
    /**
     * A reference to the render state of the panview of the parent renderer
     */
    RenderState: PanViewState;

    /**
     * A reference to the reduce components function in the parent renderer
     * Allows a child component to modify its own state (or a sibling's state)
     */
    ReduceComponents: ReturnType<typeof useFlowchartComponents>[1];

    /**
     * Allows a component to perform a drag lock
     */
    SetDraggable: ReturnType<typeof useState<boolean>>[1]
}

const component = createFlowchartComponent(FlowchartComponentTypes.Rectangle, 10, 10, 30, 30, 0);
const otherComponent = createFlowchartComponent(FlowchartComponentTypes.Circle, 50, 10, 15, 20, 0);

/**
 * A component whose job is to render a flowchart, given some data
 * Limited interaction
 * @returns 
 */
export default function FlowchartRender(props: FlowchartRenderProps) {
    const [renderStateRef, setRenderStateRef] = useState<PanViewState | null>();
    const [draggable, setDraggable] = useState<boolean | undefined>(true);

    const [components, reduceComponents] = useFlowchartComponents([
        component,
        otherComponent
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
                                const [x1, y1] = panviewPointToViewport([10, 10], renderStateRef);
                                const [x2, y2] = panviewPointToViewport([30, 30], renderStateRef);
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
                draggable={draggable}
            >
                {components.map((v, i) => <Fragment key={i}>
                    {(ComponentRenders[v.type])({
                        ...v,
                        RenderState: renderStateRef!, // we know the renderStateRef is not null
                        ReduceComponents: reduceComponents,
                        SetDraggable: setDraggable,
                    })}
                </Fragment>)}
            </PanView>
        </>
    );
}