import { useReducer } from "react";
import FlowchartComponent from "../FlowchartComponents";

export type FlowchartComponentListPayload = AddElementPayload | RemoveElementPayload |
    ModifyElementPayload | MoveElementPayload | ResizeElementPayload | RotateElementPayload;

    
/**
 * Adds an element
 */
type AddElementPayload = {
    action: 'add',
    element: FlowchartComponent,
}

/**
 * Removes an element by searching for all matching elements of the one given
 */
type RemoveElementPayload = {
    action: 'remove',
    element: string,
}

/**
 * Modifies an element by performing the operation
 * @example
 * ```
 * element = { ...element, ...payload }
 * ```
 * 
 * effectively allowing payload to override any key of element.
 */
type ModifyElementPayload = {
    action: 'modify',
    element: string,
    payload: Partial<FlowchartComponent>,
}

type MoveElementPayload = {
    action: 'move',
    element: string,
    /**
     * Does this operation set or add to the current value
     * @default true
     */
    set?: boolean,
    /**
     * The data for the movement, structured as an array where a[0] is x-axis,
     * and a[1] is y-axis
     */
    payload: [number, number],
}

type ResizeElementPayload = {
    action: 'resize',
    element: string,
    /**
     * Does this operation set or add to the current value
     * @default true
     */
    set?: boolean,
    /**
     * The data for the resize, structured as an array where a[0] is height,
     * and a[1] is width
     */
    payload: [number, number],
}

type RotateElementPayload = {
    action: 'rotate',
    element: string,
    /**
     * Does this operation set or add to the current value
     */
    set?: boolean,
    payload: number
}

/**
 * A hook which provides a reducer-like way to handle a list of flowchart components.
 * Provides methods of updating specific elements, as well as,
 * @param components
 * @see FlowchartComponentListPayload to use reducer
 */
export default function useFlowchartComponents(components: FlowchartComponent[] = []) {
    // small helper function which can locate a component by its reference, and then modify it in some way
    const findElementAndModify = (state: FlowchartComponent[], component: string, modify: (comp: FlowchartComponent) => FlowchartComponent): FlowchartComponent[] => {
        const index = state.findIndex(v => component == v.uuid);
        const newState = [...state];
        newState[index] = modify(state[index]);
        return newState;
    }
    
    return useReducer((state: FlowchartComponent[], payload: FlowchartComponentListPayload) => {
        switch (payload.action) {
            case "add":
                return [...state, payload.element];
            case "remove":
                return state.filter(v => v.uuid != payload.element);
            case "modify":
                return findElementAndModify(state,
                    payload.element, (component) => ({ ...component, ...payload.payload }));
            case "move":
                // really messy, but it should work
                return findElementAndModify(state, payload.element, (component) => ({
                    ...component,
                    x: payload.payload[0] + (payload.set ?? true ? 0 : component.x),
                    y: payload.payload[1] + (payload.set ?? true ? 0 : component.y)
                }));
            case "resize":
                return findElementAndModify(state, payload.element, (component) => ({
                    ...component,
                    height: payload.payload[0] + (payload.set ?? true ? 0 : component.height),
                    width: payload.payload[1] + (payload.set ?? true ? 0 : component.width),
                }));
            case "rotate":
                return findElementAndModify(state, payload.element, (component) => ({
                    ...component,
                    rotation: payload.payload + (payload.set ?? true ? 0 : component.rotation),
                }));
        }
        return state
    }, components);
}