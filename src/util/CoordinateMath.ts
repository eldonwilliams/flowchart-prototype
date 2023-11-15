import { PanViewState } from "../components/PanView";

/**
 * Basic type that represents a point in the R^2 space
 */
export type Point = [number, number];

/**
 * Dilates/Scales a point, A, around another point, B, by a given factor.
 * 
 * Formula: (x1 + x2) * factor - x2
 * 
 * @param a The point to be changed
 * @param b The point to change a around
 * @param factor The factor by which to change
 */
export function dilatePointAroundPoint(a: Point, b: Point, factor: number): Point {
    return [
        (a[0] + b[0]) * factor - b[0],
        (a[1] + b[1]) * factor - b[1],
    ]
}

/**
 * Dilates/Scales a point by a given
 * @param a 
 * @param factor 
 */
export function dilatePoint(a: Point, factor: number) {
    return [a[0] * factor, a[1] * factor];
}

/**
 * Converts a point on the PanView-View to its respective point on the PanView-Container.
 * The point may currently be off screen, make sure clipping occurs.
 * 
 * @param point 
 * @param state 
 */
export function panviewPointToViewport(point: Point, state: PanViewState): Point {
    point[0] -= state.x;
    point[1] -= state.y;

    const rect = state.containerRef.current?.getBoundingClientRect();
    if (!rect) return point;
    const center: Point = [
        -(rect.x - rect.left + rect.width / 2),
        -(rect.y - rect.top + rect.height / 2)
    ];

    return dilatePointAroundPoint(point, center, state.scale);
}

/**
 * Converts a point whose reference is the viewport to be relative to a given element.
 * 
 * @param point 
 * @param elem 
 * @returns 
 */
export function globalPointToElementSpace(point: Point, elem: Element): Point {
    const rect = elem.getBoundingClientRect();
    return [point[0] - rect.left, point[1] - rect.top];
}