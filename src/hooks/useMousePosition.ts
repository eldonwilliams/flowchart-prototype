import { useEffect, useState } from "react";

export default function useMousePosition() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            setPosition({ x: e.clientX, y: e.clientY });
        }

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return position;
}

export function useMousePositionOnElement(elem: React.RefObject<HTMLElement>) {
    const [position, setPosition] = useState({ x: 0, y: 0, touching: false, });

    useEffect(() => {
        if (!elem.current) return;

        const elemCurrent = elem.current!;

        function handleMouseMove(e: MouseEvent) {
            const rect = elemCurrent.getBoundingClientRect();
            const touching = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top, touching });
        }

        document.addEventListener('mousemove', handleMouseMove)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [elem]);

    return position;
}