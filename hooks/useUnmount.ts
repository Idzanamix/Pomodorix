import { useState, useEffect } from "react";

export function useUnmount() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    return [mounted]
}
