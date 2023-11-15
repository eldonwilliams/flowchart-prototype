import { useEffect, useState } from "react";
import { FlowchartComponentProps } from ".";
import { dilatePointAroundPoint, panviewPointToViewport } from "../../util/CoordinateMath";

/**
 * The base behaviour for a component,
 * gives most of the behaviour shared between components.
 * 
 * This mostly is so we don't have to repeat a bunch of code.
 * 
 * @returns a object that should be spread into the div returned from a component
 */
export default function useComponent(props: FlowchartComponentProps): JSX.IntrinsicElements["div"]  {
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        document.body.style.cursor = dragging ? 'grabbing' : 'default';
        props.SetDraggable(!dragging);
        if (dragging == true) {
            const handleMouseUp = () => {
                setDragging(false)
            }

            window.addEventListener('mouseup', handleMouseUp);

            const handleMouseMove = (e: MouseEvent) => {
                if (!dragging) return;
                const viewRect = props.RenderState.viewRef.current?.getBoundingClientRect();
                if (!viewRect) return;

                // Calculate the mouse position relative to the viewRect
                let x = e.clientX - viewRect.left;
                let y = e.clientY - viewRect.top;

                // Adjust for scale
                x /= props.RenderState.scale;
                y /= props.RenderState.scale;

                props.ReduceComponents({
                    action: 'move',
                    element: props.uuid,
                    payload: [x, y],
                })
            }

            window.addEventListener('mousemove', handleMouseMove);
            return () => {
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }, [dragging])

    return {
        style: {
            position: 'absolute',
            transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotation}deg)`,
            width: props.width,
            height: props.height,
            opacity: dragging ? 1 : 0.5,
            cursor: 'pointer',
        },
        onMouseDown: () => setDragging(true),
    };
}