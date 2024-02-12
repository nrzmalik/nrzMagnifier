function addCssToHead(cssRules) {
  var styleElement = document.createElement('style');
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);
}

var css = ` 
#magnifier {
  position: absolute;
  display: none;
  width: 250px; 
  height: 250px; 
  border: 2px solid #000;
  border-radius: 50%; 
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  pointer-events: none; 
  z-index: 1000;
  background: #fff no-repeat; 
  cursor: none; 
} `;

addCssToHead(css);
function nrzMagnify(image_, zoomLevel = 4, magnifierSize = 250) {
  const magnifier = document.createElement('div');
  magnifier.id = 'magnifier';
  document.body.appendChild(magnifier);

  let targetElement;

  document.addEventListener('mousemove', (event) => {
    if (targetElement) {
      updateMagnifierPosition(event.pageX, event.pageY);
    }
  });

  document.addEventListener('touchmove', (event) => {
    if (targetElement) {
      const touch = event.touches[0];
      updateMagnifierPosition(touch.pageX, touch.pageY);
      event.preventDefault(); 
    }
  }, {passive: false}); 

  document.querySelectorAll(`[data-acc-text='${image_}']`).forEach(element => {
    element.addEventListener('mouseenter', startMagnifierEvent);
    element.addEventListener('mouseleave', stopMagnifier);

   
    element.addEventListener('touchstart', startMagnifierEvent, {passive: true});
    
    element.addEventListener('touchend', stopMagnifier);
  });

  function startMagnifierEvent(event) {
    if (event.type === 'touchstart') {
      const touch = event.touches[0];
      updateMagnifierPosition(touch.pageX, touch.pageY);
    }
    targetElement = this; 
    startMagnifier(targetElement);
  }

  function startMagnifier(element) {
    const image = element.querySelector('svg image');
    if (image) {
      const imagePath = image.getAttribute('xlink:href') || image.getAttribute('href');
      magnifier.style.backgroundImage = `url('${imagePath}')`;
      magnifier.style.display = 'block';
      magnifier.style.width = `${magnifierSize}px`;
      magnifier.style.height = `${magnifierSize}px`;
      magnifier.style.backgroundRepeat = 'no-repeat';
      magnifier.style.backgroundSize = `${element.offsetWidth * zoomLevel}px ${element.offsetHeight * zoomLevel}px`;
      document.body.style.cursor = 'none';
    } else {
      console.error("Image not found within the specified element.");
    }
  }

  function stopMagnifier() {
    targetElement = null;
    magnifier.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  function updateMagnifierPosition(pageX, pageY) {
    if (!targetElement) return;
    const rect = targetElement.getBoundingClientRect();
    const x = pageX - magnifierSize / 2 - window.pageXOffset;
    const y = pageY - magnifierSize / 2 - window.pageYOffset;

    magnifier.style.left = `${x}px`;
    magnifier.style.top = `${y}px`;

    const backgroundPosX = -((pageX - rect.left - window.pageXOffset) * zoomLevel - magnifierSize / 2);
    const backgroundPosY = -((pageY - rect.top - window.pageYOffset) * zoomLevel - magnifierSize / 2);
    magnifier.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;
  }
}