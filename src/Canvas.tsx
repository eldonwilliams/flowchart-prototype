import { useEffect, useRef } from "react";

/**
 * A function that renders to a canvas context.
 */
export type RenderFn = (ctx: CanvasRenderingContext2D) => void;
/**
 * The props for the Canvas component.
 */
export type CanvasProps = JSX.IntrinsicElements["canvas"] & {
    /**
     * The function that renders to the canvas.
     * The canvas is cleared before this function is called.
     */
    renderFn: RenderFn;
};

/**
 * A component that renders a canvas.
 * This is very low level, and should be abstracted away.
 */
function Canvas({ renderFn, ...canvasProps }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const revalidate = () => {
        if (canvasRef.current === null) return;
        var dpr = window.devicePixelRatio || 1;
        var rect = canvasRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        const ctx = canvasRef.current.getContext("2d");
        if (ctx === null) return;
        ctx.scale(dpr, dpr);
        // TODO: there should be some selective re-rendering here, or making sub-canvases.
        // Possibly groups could be canvases?
        // But, for a first prototype, this works
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        renderFn(ctx);
    }

    useEffect(revalidate, [renderFn, canvasRef]);

    return <canvas {...canvasProps} ref={canvasRef} />;
}

export default Canvas;