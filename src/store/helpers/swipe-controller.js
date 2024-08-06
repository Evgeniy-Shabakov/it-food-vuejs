export function activateSwipeController(domElement, onSwipeLeft, onSwipeRight) {
    let touchStartX = 0;
    let touchEndX = 0;

    domElement.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });

    domElement.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > window.innerWidth/3.2) {
            if (typeof onSwipeLeft === 'function') {
                onSwipeLeft();
            }
        }
        if (touchEndX - touchStartX > window.innerWidth/3.2) {
            if (typeof onSwipeRight === 'function') {
                onSwipeRight();
            }
        }
    }
}