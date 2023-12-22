function addCssToHead(cssRules) {
  var styleElement = document.createElement('style');
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);
}

var css = ` 
#magnifier {
  position: absolute;
  display: none;
  width: 220px; 
  height: 220px; 
  border: 2px solid #000;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 1000;
  cursor: zoom-in;
}

#magnifier img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  visibility: hidden;
}`;

addCssToHead(css);

function nrzMagnify(image_) {
  const magnifier = document.createElement('div');
  magnifier.id = 'magnifier';
  document.body.appendChild(magnifier);

  let targetElement;
  const zoomLevel = 2; // Set the zoom level to 2 for 200%

  document.addEventListener('mousemove', (event) => {
    if (targetElement) {
      updateMagnifierPosition(event);
    }
  });

  document.querySelectorAll(`[data-acc-text='${image_}']`).forEach(element => {
    element.addEventListener('mouseenter', () => {
      targetElement = element;
      startMagnifier(targetElement);
    });

    element.addEventListener('mouseleave', () => {
      stopMagnifier();
    });
  });

  function startMagnifier(element) {
    const image = element.querySelector('svg image');

    if (image) {
      const imagePath = image.getAttribute('xlink:href') || image.getAttribute('href');
      magnifier.style.backgroundImage = `url('${imagePath}')`;
      magnifier.style.display = 'block';
      document.body.style.cursor = 'zoom-in'; // Change the cursor style
    } else {
      console.error("Image not found within the specified element.");
    }
  }

  function stopMagnifier() {
    targetElement = null;
    magnifier.style.display = 'none';
    document.body.style.cursor = 'auto'; // Reset the cursor style
  }

  function updateMagnifierPosition(event) {
    const rect = targetElement.getBoundingClientRect();

    const offsetX = magnifier.offsetWidth / 2;
    const offsetY = magnifier.offsetHeight / 2;


    const x = event.clientX - rect.left - offsetX;
    const y = event.clientY - rect.top - offsetY;

    // Ensure that the magnifier stays within the bounds of the target element
    const minX = 0;
    const minY = 0;
    const maxX = targetElement.offsetWidth - magnifier.offsetWidth;
    const maxY = targetElement.offsetHeight - magnifier.offsetHeight;

    magnifier.style.left = `${Math.min(maxX, Math.max(minX, x))+200}px`;
    magnifier.style.top = `${Math.min(maxY, Math.max(minY, y))+200}px`;

    // Ensure that the magnifier stays within the bounds of the image
    const imageX = Math.min(100, Math.max(0, (x / targetElement.offsetWidth) * 100 * zoomLevel));
    const imageY = Math.min(100, Math.max(0, (y / targetElement.offsetHeight) * 100 * zoomLevel));

    magnifier.style.backgroundPosition = `${imageX}% ${imageY}%`;
  }
}
