const moodboard = document.getElementById("moodboard");
const downloadButton = document.getElementById("_form_3_submit");

const watermark = document.createElement("watermark");

watermark.style =
  "background-image: url('https://www.in20abitare.it/bagno-moodboard/watermark.png'); width: 10%; height: 10%;";

watermark.style.position = "absolute";
watermark.style.top = "5%";
watermark.style.right = "5%";
watermark.style.zIndex = "1000";
watermark.style.opacity = "0.2";

const watermarkImg = document.createElement("img");
watermarkImg.src = "https://www.in20abitare.it/bagno-moodboard/watermark.png";
watermark.appendChild(watermarkImg);
moodboard.appendChild(watermark);

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

$(document).ready(function () {
  $(".drag-item").draggable({
    containment: "#moodboard",
    cursor: "move",
    addClasses: true,
    opacity: 0.8,
    helper: "clone",
    appendTo: "body",
    zIndex: 10000,
    scroll: true,
    scrollSensitivity: 50,
    scrollSpeed: 70,
    revert: "invalid",
    distance: 5,
    delay: 0,
    start: function (event, ui) {
      $(this).addClass("ui-dragging");
      $("#drag-label").show().text("Trascina nell'area moodboard");
    },

    drag: function (event, ui) {
      const offset = ui.helper.offset();
      $("#drag-label").css({
        left: offset.left + 10,
        top: offset.top - 30,
      });
    },

    stop: function (event, ui) {
      $(this).removeClass("ui-dragging");
      $("#drag-label").hide();
    },
  });

  $("#moodboard").droppable({
    accept: ".drag-item",
    tolerance: "pointer",

    over: function (event, ui) {
      $(this).addClass("ui-droppable-hover");
      $("#drag-label").text("Rilascia qui per aggiungere");
    },

    out: function (event, ui) {
      $(this).removeClass("ui-droppable-hover");
      $("#drag-label").text("Trascina nell'area moodboard");
    },

    activate: function (event, ui) {
      $(this).addClass("ui-droppable-active");
    },

    deactivate: function (event, ui) {
      $(this).removeClass("ui-droppable-active ui-droppable-hover");
    },

    drop: function (event, ui) {
      const helperOffset = ui.offset || ui.helper.offset();
      const droppableOffset = $(this).offset();
      const scrollLeft = $(window).scrollLeft();
      const scrollTop = $(window).scrollTop();
      const newLeft = Math.round(
        helperOffset.left - droppableOffset.left + scrollLeft
      );
      const newTop = Math.round(
        helperOffset.top - droppableOffset.top + scrollTop
      );

      const viewportWidth = window.innerWidth;
      let elementHeight = 200 + "px";
      let elementWidth = 150 + "px";

      if (viewportWidth < 576) {
        elementHeight = 200 * 0.6 + "px";
        elementWidth = 150 * 0.6 + "px";
      } else if (viewportWidth < 768) {
        elementHeight = 200 * 0.7 + "px";
        elementWidth = 150 * 0.7 + "px";
      }

      removeContent();

      const originalElement = ui.draggable;
      const new_signature = originalElement
        .clone()
        .removeClass("drag-item")
        .css({
          height: elementHeight,
          width: elementWidth,
          position: "absolute", // make image fill the container reliably
          left: 0,
          top: 0,
          display: "block",
        });

      const imgSrc = originalElement.find("img").attr("src");
      if (imgSrc) {
        new_signature.find("img").attr("src", imgSrc);
      }

      const container = $('<div class="canvas-element-container"></div>');

      container.css({
        left: newLeft + "px",
        top: newTop + "px",
        position: "absolute",
        zIndex: 10000,
        opacity: 1,
        width: elementWidth,
        height: elementHeight,
      });

      const removeButton = $('<div class="remove-button">×</div>');

      removeButton.click(function (e) {
        e.stopPropagation();
        container.remove();
      });

      container.append(new_signature);
      container.append(removeButton);

      container.draggable({
        containment: "#moodboard",
        cursor: "move",
        handle: new_signature,
      });

      container.resizable({
        containment: "#moodboard",
        aspectRatio: false,
        minWidth: 50,
        minHeight: 50,
        maxWidth: 400,
        maxHeight: 400,
        handles: "se,sw,nw",
        start: function (event, ui) {
          removeButton.hide();
          $(this).addClass("ui-resizing");
          const position = $(this).position();
          $(this).data("originalPosition", {
            left: position.left,
            top: position.top,
          });
        },
        resize: function (event, ui) {
          const originalPos = $(this).data("originalPosition");
          ui.position.left = originalPos.left;
          ui.position.top = originalPos.top;

          $(this).css({
            left: originalPos.left + "px",
            top: originalPos.top + "px",
            position: "absolute",
          });

          new_signature.css({
            width: ui.size.width + "px",
            height: ui.size.height + "px",
            left: 0,
            top: 0,
            position: "absolute",
          });
        },
        stop: function (event, ui) {
          const originalPos = $(this).data("originalPosition");
          $(this).css({
            left: originalPos.left + "px",
            top: originalPos.top + "px",
            position: "absolute",
          });

          removeButton.show();
          $(this).removeClass("ui-resizing");
          $(this).removeData("originalPosition");
        },
      });

      $(this).append(container);
    },
  });
});

function captureAndDownloadPng() {
  const divWidth = moodboard.clientWidth;
  const divHeight = moodboard.clientHeight;

  const $controls = $(".remove-button, .ui-resizable-handle, #drag-label");
  const previousVisibility = [];
  $controls.each(function () {
    previousVisibility.push($(this).css("visibility"));
  });
  $controls.css("visibility", "hidden");

  $(".canvas-element-container.ui-resizing").removeClass("ui-resizing");

  html2canvas(moodboard, {
    width: divWidth,
    height: divHeight,
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#fff8f1",
    backgroundImage: "https://www.in20abitare.it/bagno-moodboard/logo3.png",
  })
    .then((canvas) => {
      canvas.toBlob(function (blob) {
        window.saveAs(blob, "living-mooodboard.png");
        moodboard.removeChild(watermark);

        $controls.each(function (idx) {
          $(this).css("visibility", previousVisibility[idx] || "");
        });
      });
    })
    .catch(function () {
      $controls.each(function (idx) {
        $(this).css("visibility", previousVisibility[idx] || "");
      });
    });
}

downloadButton.addEventListener("click", function () {
  captureAndDownloadPng();
});
