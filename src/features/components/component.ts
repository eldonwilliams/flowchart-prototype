export type ComponentIdentifier = Component["uuid"] | Component;

export interface Component {
    uuid: string;
}

export const createComponent = (): Component => ({
    uuid: crypto.randomUUID(),
})