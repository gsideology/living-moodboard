const moodboard = document.getElementById("moodboard");
const dragItem = document.getElementsByClassName("drag-item");
const downloadButton = document.getElementById("_form_3_submit");

let isIn = false;
let indexGrid = 9;
let sliderTranslate = null;

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}
const watermark = document.createElement("watermark");

watermark.style =
  "background-image: url('https://www.in20abitare.it/bagno-moodboard/watermark.png'); width: 10%; height: 10%;";

watermark.style.position = "absolute";
watermark.style.top = "5%";
watermark.style.right = "5%";
watermark.style.zIndex = "1000";
watermark.style.opacity = "0.2";
var elem = document.createElement("img");
elem.setAttribute(
  "src",
  "https://www.in20abitare.it/bagno-moodboard/watermark.png"
);
watermark.appendChild(elem);
moodboard.appendChild(watermark);

/* pop up da mobile 

function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

*/

function refresh() {
  setTimeout(function () {
    location.reload();
  }, 100);
}

function removeContent() {
  let divElement = document.getElementById("moodboard");
  let div = document.getElementById("descrizione_mobile");
  if (div) {
    divElement.removeChild(div);
  }
}

// Inizializza gli elementi trascinabili e l'area del canvas
$(document).ready(function () {
  $(".drag-item").draggable({
    containment: "moodboard",
    cursor: "crosshair",
    addClasses: true,
    scroll: true,
    scrollSensitivity: 50,
    scrollspeed: 70,
    revert: "invalid",
    cursor: "move",
    helper: "clone",
    appendTo: "body",
    zIndex: 10000,
  });

  // setta l'area del canvas come acceptable per gli elementi draggable
  $("#moodboard").droppable({
    accept: ".drag-item",

    drop: function (event, ui) {
      var draggableOffset = ui.helper.offset();
      var droppableOffset = $(this).offset();
      var newLeft = draggableOffset.left - droppableOffset.left;
      var newTop = draggableOffset.top - droppableOffset.top;

      var elementHeight = 200 + "px";
      var elementWidth = 150 + "px";
      // Get the viewport's width and height
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (viewportWidth < 576) {
        elementHeight = 200 * 0.6 + "px";
        elementWidth = 150 * 0.6 + "px";
      } else if (viewportWidth < 768) {
        elementHeight = 200 * 0.7 + "px";
        elementWidth = 150 * 0.7 + "px";
      } else {
        var elementHeight = 200 + "px";
        var elementWidth = 150 + "px";
      }

      // Posiziona l'elemento draggable all'interno del canvas
      ui.helper
        .css({
          left: newLeft + "px",
          top: newTop + "px",
          position: "absolute",
          zIndex: 10000,
          opacity: 1,
          height: elementHeight,
          width: elementWidth,
        })
        .appendTo("#moodboard");
      removeContent();
      // Crea una copia dell'elemento draggable rimuova la classe "objetcDrag"
      //per evitare di aggiungere più cloni e lo rende all'interno del canvas

      var new_signature = $(ui.helper)
        .clone()
        .removeClass("drag-item")
        .draggable({ containment: "#moodboard" });

      new_signature.draggable();
      //var new_signatureb = $(ui.helper).clone().addClasses("dragged_item");
      $(this).append(new_signature);
      //$(this).append(new_signatureb);
    },
  });
});

function captureAndDownloadPng() {
  const divWidth = moodboard.clientWidth;
  const divHeight = moodboard.clientHeight;

  // Converte il contenuto del canvas in un'immagine PNG
  html2canvas(moodboard, {
    width: divWidth,
    height: divHeight,
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#fff8f1",
    backgroundImage: "https://www.in20abitare.it/bagno-moodboard/logo3.png",
  }).then((canvas) => {
    const imgData = canvas.toBlob(function (blob) {
      window.saveAs(blob, "living-mooodboard.png");

      moodboard.removeChild(watermark);
    });
  });
}

downloadButton.addEventListener("click", function () {
  captureAndDownloadPng();
});