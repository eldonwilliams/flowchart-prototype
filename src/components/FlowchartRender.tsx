import PanView, { PanViewState } from "./PanView";
import './FlowchartRender.css';
import { FlowchartSelectionState } from "../FlowchartComponents";
import { Fragment, useState } from "react";
import Canvas from "../Canvas";

export interface FlowchartRenderProps {
    selectionState: FlowchartSelectionState
}

interface RectangleDefinition {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * A component whose job is to render a flowchart, given some data
 * Limited interaction
 * @returns 
 */
export default function FlowchartRender(props: FlowchartRenderProps) {
    const [elements, setElements] = useState<RectangleDefinition[]>([]);
    const [renderStateRef, setRenderStateRef] = useState<PanViewState | null>();

    function addRectangle(x: number, y: number) {
        setElements(v => [...v, {
            x, y, width: 10, height: 10
        }]);
    }

    return (
        <>
            <PanView
                draggable={props.selectionState === "pointer"}
                stateFunction={setRenderStateRef}
            >
                {elements.map((v, i) => <Fragment key={i}>
                        <div style={{
                            transform: `translate(${v.x}px, ${v.y}px)`,
                            width: v.width,
                            height: v.height,
                            background: '#000',
                            position: 'absolute',
                        }} />
                    </Fragment>
                )}
                <Canvas
                    renderFn={(ctx) => {
                        ctx.scale(renderStateRef?.scale ?? 1, renderStateRef?.scale ?? 1);
                        ctx.strokeStyle = "#000";

                        elements.forEach((currentElement, index) => {
                            if (index + 1 >= elements.length) return;
                            const nextElement = elements[index + 1];
                            ctx.beginPath();
                            ctx.moveTo(currentElement.x + currentElement.width / 2, currentElement.y + currentElement.height / 2);
                            ctx.lineTo(nextElement.x + currentElement.width / 2, nextElement.y + currentElement.height / 2);
                            ctx.stroke();
                        });
                    }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </PanView>
            <button
                onClick={() => addRectangle(Math.random() * 300, Math.random() * 300)}
            >
                Click to add element, random pos
            </button>
            <button
                onClick={() => setElements(v => v.slice(0, v.length - 1))}
            >
                Remove random element
            </button>
        </>
    );
}