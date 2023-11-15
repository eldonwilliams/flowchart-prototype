import { ComponentPropsWithoutRef, ReactNode, useEffect, useReducer, useRef, useState } from "react";
import './PanView.css';

/**
 * A representation of the entire rendering state of a PanView component
 */
export interface PanViewState {
    x: number;
    y: number;
    scale: number;
    containerRef: React.RefObject<HTMLDivElement>;
    viewRef: React.RefObject<HTMLDivElement>;
}

export interface PanViewStateReducerAction {
    action: 'setpos' | 'move' | 'scale' | 'containerRef' | 'viewRef',
    payload: { x: number, y: number} | number | React.Ref<HTMLDivElement>,
}

/**
 * This event is fired whenever the viewport is dragged
 */
export interface PanViewDragEvent extends MouseEvent {
    // The new x position of the viewport
    newPosX: number;
    // The new y position of the viewport
    newPosY: number;
}

/**
 * This event is fired whenever the viewport is scaled
 */
export interface PanViewScrollEvent extends WheelEvent {
    // The new scale of the viewport
    scale: number;
}

/**
 * Props for the PanView component.
 * Any <div> props are propogated to the panview-view element.
 * 
 * The following are currently overridden:
 * - ref
 * 
 * and the following are called manually, and may use `Event.stopPropogation()` to prevent the components default behaviour
 * 
 * - onMouseMove
 * - onDrag
 * - onWheel
 * 
 * PanView also exposes custom events
 * @see PanViewDragEvent
 * @see PanViewScrollEvent
 */
export interface PanViewProps extends ComponentPropsWithoutRef<"div"> {
    // can this panview be dragged or scaled? If not set, true
    draggable?: boolean;

    viewChildren?: ReactNode

    onPanViewDrag?: (e: PanViewDragEvent) => void;
    onPanViewScroll?: (e: PanViewScrollEvent) => void;

    stateFunction?: ReturnType<typeof useState<PanViewState | null>>[1];
}

/**
 * Clamps a number, v, between low and high.
 * low <= v <= high;
 * @param v
 * @param low 
 * @param high 
 * @returns 
 */
function Clamp(v: number, low: number, high: number): number {
    return Math.max(Math.min(v, high), low);
}

const SCROLL_DIVISOR = 600;

function PanViewStateReducer(state: PanViewState, action: PanViewStateReducerAction): PanViewState {
    const stateCopy = { ...state };
    if (action.action === "setpos") {
        // copy and paste?!?!?! :)
        if (!(action.payload instanceof Object)) return state;
        const { payload } = action as unknown as any;
        stateCopy.x = payload.x;
        stateCopy.y = payload.y;
    } else if (action.action === "move") {
        if (!(action.payload instanceof Object)) return state;
        const { payload } = action as unknown as any; // this is not good, but it is required to use ap
        stateCopy.x += payload.x;
        stateCopy.y += payload.y;
    } else if (action.action === "scale") {
        if (typeof action.payload !== "number") return state;
        stateCopy.scale = Clamp(action.payload + state.scale, 0.5, 5);
    } else {
        stateCopy[action.action] = action.payload as unknown as any;
    }

    return stateCopy;
}

/**
 * A component with a inner object whose position is panned and dragged by the major element.
 * Can have children
 */
export default function PanView({ stateFunction, draggable = true, onPanViewDrag, onPanViewScroll, viewChildren, ...props }: PanViewProps) {
    const [state, mutateState] = useReducer(PanViewStateReducer, {
        x: 0, y: 0, scale: 1, containerRef: useRef(null), viewRef: useRef(null),
    });

    const containerRef = state.containerRef!;
    const viewRef = state.viewRef!;

    function handleMovement(e: MouseEvent) {
        if (!draggable) return;
        // if primary button is not down and control key is not down, return
        // to activate a drag, either the primary button or control key must be held
        if ((e.buttons & 1) != 1 && !e.ctrlKey) return;
        const panViewDragEvent: PanViewDragEvent = e as PanViewDragEvent;
        panViewDragEvent.newPosX = state.x - e.movementX / state.scale;
        panViewDragEvent.newPosY = state.y - e.movementY / state.scale;
        mutateState({
            action: 'setpos',
            payload: {
                x: panViewDragEvent.newPosX,
                y: panViewDragEvent.newPosY,
            }
        });
        if (onPanViewDrag) onPanViewDrag(panViewDragEvent);
    }

    function handleWheel(e: WheelEvent) {
        if (!draggable) return; // draggable also affects scaling!
        e.preventDefault();
        const panViewScroll: PanViewScrollEvent = e as PanViewScrollEvent;
        panViewScroll.scale = state.scale + e.deltaY / SCROLL_DIVISOR;
        mutateState({
            action: 'scale',
            payload: e.deltaY / SCROLL_DIVISOR,
        })
        if (onPanViewScroll) onPanViewScroll(panViewScroll);
    }

    useEffect(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mutateState({
            action: 'setpos',
            payload: { x: rect.width / 2, y: rect.height / 2, }
        })
    }, [containerRef]);

    useEffect(() => {
        if (!viewRef.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        viewRef.current.style.transform = `translate(${-state.x}px, ${-state.y}px) scale(${state.scale})`;
        viewRef.current.style.transformOrigin = `${state.x + rect.width / 2}px ${state.y + rect.height / 2}px`;
        if (stateFunction) stateFunction(state);
    }, [state, containerRef, viewRef, stateFunction]);

    return (
        <div className="panview-container" ref={state.containerRef}>
            <div
                style={{
                    width: 0,
                    height: 0,
                }}
            >
                <div
                    {...props}
                    className={`panview-view ${props.className ?? ""}`}
                    ref={state.viewRef}
                    onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        if (props.onMouseMove) props.onMouseMove(e);
                        if (!e.isPropagationStopped()) handleMovement(e.nativeEvent);
                    }}
                    onDrag={(e: React.DragEvent<HTMLDivElement>) => {
                        if (props.onDrag) props.onDrag(e);
                        if (!e.isPropagationStopped()) handleMovement(e.nativeEvent);
                    }}
                    onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
                        if (props.onWheel) props.onWheel(e);
                        if (!e.isPropagationStopped()) handleWheel(e.nativeEvent);
                    }}
                    draggable={false}
                />
            </div>
            {viewChildren}
        </div>
        /* <div id="dev-info">
            <p>Center: ({pos[0]}, {pos[1]})</p>
            <p>Mouse: ({mousePos.x}, {mousePos.y}) {mousePos.touching ? 'true' : 'false'}</p>
            <p>Scale: {scale}</p>
            <p>Transform: {viewRef.current?.style.transform}</p>
        </div> */
    )
}