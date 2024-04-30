export function setStopScroll(props: boolean) {
    const page = document.body;

    props
        ? page.style.overflow = 'hidden'
        : page.style.overflow = '';

    !page.style.length && page.removeAttribute('style')
}
