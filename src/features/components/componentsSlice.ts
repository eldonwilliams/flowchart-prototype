import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Component, ComponentIdentifier } from "./component";
import { RootState } from "../../store";

type ComponentsState = { [a: string]: Component, }

const initialState: ComponentsState = {}

export const componentsSlice = createSlice({
    name: 'components',
    initialState,
    reducers: {
        /**
         * Adds a component
         * @param state 
         * @param action 
         */
        addComponent: (state, action: PayloadAction<Component>) => {
            state[action.payload.uuid] = action.payload
        },

        /**
         * Removes a component given the component itself or its UUID
         * @param state 
         * @param action 
         */
        removeComponent: (state, action: PayloadAction<ComponentIdentifier>) => {
            if (typeof action.payload !== "string") {
                action.payload = action.payload.uuid
            }

            delete state[action.payload]
        },

        /**
         * Creates a union of the given component and the component in the state with the same uuid
         * @param state 
         * @param action 
         * @returns 
         */
        danger_modifyComponent: (state, action: PayloadAction<Component>) => {
            let old = state[action.payload.uuid];
            if (old === undefined) return;

            old = { ...old, ...action.payload, uuid: old.uuid };

            state[old.uuid] = old;
        },
    }
})

export const {
    addComponent,
    removeComponent,
    danger_modifyComponent
} = componentsSlice.actions;

/**
 * Selects the components data from state
 * @param state 
 * @returns 
 */
export const selectComponents = (state: RootState) => state.components;

/**
 * Selects the components from state as an array
 * @param state 
 * @returns 
 */
export const selectComponentsArray = (state: RootState) => Object.values(state.components);

/**
 * Selects the UUIDs of all components in the state, as a loosely ordered array
 * @param state 
 * @returns 
 */
export const selectComponentsUUIDs = (state: RootState) => Object.keys(state.components);

/**
 * Selects a specific component given a identifier
 * @param state current state
 * @param identifier a component identifier
 * @returns the component selected
 */
export const selectComponent = (state: RootState, identifier: ComponentIdentifier): Component | undefined => {
    if (typeof identifier !== "string") {
        identifier = identifier.uuid;
    }

    return state.components[identifier];
}

export default componentsSlice.reducer;