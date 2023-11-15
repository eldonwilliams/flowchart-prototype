import { useEffect, useState } from "react";
import { FlowchartComponentProps } from ".";

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
        console.log(dragging);
        props.SetDraggable(!dragging);
        if (dragging == true) {
            const handleMouseUp = () => {
                setDragging(false)
            }

            window.addEventListener('mouseup', handleMouseUp);

            const handleMouseMove = (e: MouseEvent) => {
                if (!dragging) return;
                const viewRect = props.RenderState.viewRef.current?.getBoundingClientRect();
                props.ReduceComponents({
                    action: 'move',
                    element: props.uuid,
                    payload: [
                        e.clientX - (viewRect?.left ?? 0) - (props.width / 2),
                        e.clientY - (viewRect?.top ?? 0) - (props.height / 2),
                    ],
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