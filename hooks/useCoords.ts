import { useState, useEffect } from "react";

export type Coords = {
    left: number;
    top: number;
    leftWidth: number;
};

export function useCoords(ref: any, isOpen: boolean) {
    const [coords, setCoords] = useState<Coords | null>(null);

    const getCoords = (): Coords | null => {
        if (ref.current) {
            return {
                left: ref.current.offsetLeft,
                top: ref.current.offsetTop + ref.current.offsetHeight,
                leftWidth: ref.current.offsetLeft + ref.current.offsetWidth
            };
        }

        return null;
    };

    useEffect(() => {
        if (!isOpen) return;
        setCoords(getCoords());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return [coords]
}
