export const disablePageScale = () => {
  // 进制双击页面缩放
  document.addEventListener("gesturestart", (event) => {
    event.preventDefault();
  });
  document.addEventListener("touchstart", (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
};

// canvas 绘画图片
export const drawImage = (canvas, currentImage) => {
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;
  let context = canvas.getContext("2d");
  let img = new Image();
  img.onload = () => {
    context.drawImage(img, canvas.width / 4, canvas.height / 4);
    // svg置灰
    const { width, height } = img;
    const imgData = context.getImageData(
      canvas.width / 4,
      canvas.height / 4,
      width,
      height
    );
    const data = imgData.data;
    // 像素遍历
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const lm = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = lm;
      data[i + 1] = lm;
      data[i + 2] = lm;
    }
    // 在 canvas 中显示ImageData
    context.putImageData(imgData, canvas.width / 4, canvas.height / 4);
  };
  img.src = currentImage.src;
};

/**
 * This function takes in an array of points and draws them onto the canvas.
 * @param {array} stroke array of points to draw on the canvas
 * @return {void}
 */
export const drawOnCanvas = (context, stroke, option) => {
  context.strokeStyle = option.pickerColor;
  context.lineCap = "round";
  context.lineJoin = "round";

  const l = stroke.length - 1;
  if (stroke.length >= 3) {
    const xc = (stroke[l].x + stroke[l - 1].x) / 2;
    const yc = (stroke[l].y + stroke[l - 1].y) / 2;
    context.lineWidth = stroke[l - 1].lineWidth;
    context.strokeStyle = stroke[l - 1].color;
    context.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc);
    context.stroke();
    context.beginPath();
    context.moveTo(xc, yc);
  } else {
    const point = stroke[l];
    context.lineWidth = point.lineWidth;
    context.strokeStyle = point.color;
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.stroke();
  }
};

export const drawOnCanvasLayer = (canvas, strokeHistory, option) => {
  const context = canvas.getContext("2d");

  strokeHistory.map((stroke) => {
    if (strokeHistory.length === 0) {
      return;
    }
    context.beginPath();
    let strokePath = [];
    stroke.map((point) => {
      strokePath.push(point);
      drawOnCanvas(context, strokePath, option);
    });
  });

  return canvas;
};
