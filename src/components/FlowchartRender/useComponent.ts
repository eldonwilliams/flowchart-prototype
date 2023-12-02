import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { FlowchartComponentProps } from ".";
import useMousePosition from "../../hooks/useMousePosition";

interface DragState {
    /**
     * If the component is currently being dragged
     */
    dragging: boolean;

    /**
     * If the component is being hovered over
     */
    hover: boolean;

    /**
     * If the component is being resized by the drag ( > 0
     * And the direction can be determined by binary ANDing with the following:
     * - 0b0001 - Top
     * - 0b0010 - Right
     * - 0b0100 - Bottom
     * - 0b1000 - Left
     * 
     * Contridicting directions such as 0b0011 (Top and Right) are allowed
     * 
     * Combinations of directions may be given, such as 0b1010 (Top and Left)
     */
    resizing: number;

    /**
     * Where the mouse was when the drag started
     */
    x: number;

    /**
     * Where the mouse was when the drag started
     */
    y: number;
}

/**
 * The base behaviour for a component,
 * gives most of the behaviour shared between components.
 * 
 * This mostly is so we don't have to repeat a bunch of code.
 * 
 * @returns a object that should be spread into the div returned from a component
 */
export default function useComponent(props: FlowchartComponentProps): JSX.IntrinsicElements["div"]  {
    const componentRef = useRef<HTMLDivElement>(null);
    const mousePosition = useMousePosition();
    
    const [dragging, setDragging] = useState<DragState>({
        dragging: false,
        hover: false,
        x: 0,
        y: 0,
        resizing: 0,
    });

    /**
     * Checks if a point is on the edge of a rectangle, and if so, which edge(s)
     * 
     * (uses binary flags to determine which edges are being hovered over)
     * 
     * @param x 
     * @param y 
     * @param rect 
     * @param threshold
     */
    function isPointOnRectEdge(x: number, y: number, rect: DOMRect, threshold: number = 10): number {
        if (!props.RenderState) return 0;
        let result = 0;

        threshold *= props.RenderState.scale;

        // check if the mouse is in the rectangle at all
        if (x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height) return 0;

        if (y - rect.y < threshold) result |= 0b0001; // top
        else if (y - rect.y > rect.height - threshold) result |= 0b0100; // bottom

        if (x - rect.x > rect.width - threshold) result |= 0b0010; // right
        else if (x - rect.x < threshold) result |= 0b1000; // left

        return result;
    }

    useEffect(() => {
        if (dragging.resizing > 0) return;
        if (!componentRef.current) {
            document.body.style.cursor = "auto";
            return;
        }
        const resize = isPointOnRectEdge(mousePosition.x, mousePosition.y, componentRef.current.getBoundingClientRect());
        if (resize > 0) {
            let resizeString = '';
            if (resize & 0b0001) resizeString += 'n';
            if (resize & 0b0100) resizeString += 's'; // south before east, cause idk
            if (resize & 0b0010) resizeString += 'e';
            if (resize & 0b1000) resizeString += 'w';
            document.body.style.cursor = resizeString + '-resize';
            return;
        }
        if (!dragging.hover) {
            return;
        }
        document.body.style.cursor = dragging.dragging ? 'grabbing' : 'grab';
    }, [dragging.dragging, dragging.resizing, mousePosition, componentRef])

    // when hover is false, reset value, but only if we are not doing something
    useEffect(() => {
        if (dragging.hover == false && dragging.dragging != true) {
            document.body.style.cursor = "auto";
        }
    }, [dragging.hover, dragging.dragging]);

    useEffect(() => {
        if (dragging.hover) {
            props.SetDraggable(!dragging.dragging);
        }

        if (dragging.dragging == true) {
            const handleMouseUp = () => {
                setDragging(drag => ({ ...drag, dragging: false, resizing: 0, }));
            }

            window.addEventListener('mouseup', handleMouseUp);

            const handleMouseMove = (e: MouseEvent) => {

                if (!dragging.dragging) return;
                const viewRect = props.RenderState.viewRef.current?.getBoundingClientRect();
                if (!viewRect) return;

                // Calculate the mouse position relative to the viewRect
                let x = e.clientX - viewRect.left;
                let y = e.clientY - viewRect.top;

                // Subtract the original mouse position, so the component doesn't jump
                x -= dragging.x;
                y -= dragging.y;

                // Adjust for scale
                x /= props.RenderState.scale;
                y /= props.RenderState.scale;

                if (dragging.resizing == 0) {
                    props.ReduceComponents({
                        action: 'move',
                        element: props.uuid,
                        payload: [x, y],
                    })
                } else {
                    // calculate the new width and height and position
                    // if moving in the given axis, allow movement
                    let offsetWidth = ((dragging.resizing & 0b0010) > 0 ||
                        (dragging.resizing & 0b1000) > 0) ? e.movementX : 0;

                    // invert because we're moving the left edge, not the right
                    if ((dragging.resizing & 0b1000) > 0) offsetWidth = -offsetWidth;

                    let offsetHeight = ((dragging.resizing & 0b0001) > 0 ||
                        (dragging.resizing & 0b0100) > 0) ? e.movementY : 0;
                    
                    // invert because we're moving the top edge, not the bottom
                    if ((dragging.resizing & 0b0001) > 0) offsetHeight = -offsetHeight;

                    // offset the position by the movement in the given axis, if moving in -that- axis
                    let offsetX = (dragging.resizing & 0b1000) > 0 ? e.movementX : 0;
                    let offsetY = (dragging.resizing & 0b0001) > 0 ? e.movementY : 0;

                    offsetHeight /= props.RenderState.scale;
                    offsetWidth /= props.RenderState.scale;
                    offsetX /= props.RenderState.scale;
                    offsetY /= props.RenderState.scale;

                    props.ReduceComponents({
                        action: 'modify',
                        element: props.uuid,
                        payload: {
                            width: props.width + offsetWidth,
                            height: props.height + offsetHeight,
                            x: props.x + offsetX,
                            y: props.y + offsetY,
                        }
                    })
                }
            }

            window.addEventListener('mousemove', handleMouseMove);
            return () => {
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }, [dragging, props])

    const onMouseEnter = () => setDragging(d => ({ ...d, hover: true, }));
    const onMouseLeave = () => setDragging(d => ({ ...d, hover: false, }));

    const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        let resizing = isPointOnRectEdge(e.clientX, e.clientY, rect);

        setDragging({
            dragging: true,
            x: e.clientX - rect.x,
            y: e.clientY - rect.y,
            resizing,
            hover: dragging.hover,
        });
    };
    
    return {
        style: {
            position: 'absolute',
            transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotation}deg)`,
            width: props.width,
            height: props.height,
        },
        ref: componentRef,
        onMouseDown,
        onMouseEnter,
        onMouseLeave,
    };
}