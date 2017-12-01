import 'element-closest';

// Remove this when upgrading to Jest 21.3.
// See https://github.com/facebook/jest/issues/4545.
window.requestAnimationFrame = callback => {
    setTimeout(callback, 0);
};
