export function useResizeCloser(onClose: () => void) {
    function handleResize() {
        onClose();
    }

    window.addEventListener('resize', handleResize);
}