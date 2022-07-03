function computBoundaries(data) {
  let min;
  let max;

  for (const y of data) {
    if (typeof min !== "number") min = y;
    if (typeof max !== "number") max = y;

    if (min > y) min = y;
    if (max < y) max = y;
  }
  return [min, max];
}

function isOver(mouse, x, length, dWidth) {
  if (!mouse) {
    return false;
  }
  const width = dWidth / length;
  return Math.abs(x - mouse.x) < width / 2;
}

function line(ctx, coords, color) {
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  for (const [x, y] of coords) {
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.closePath();
}

function circle(ctx, [x, y], color) {
  const CIRCLE_RADIUS = 8;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = "#fff";
  ctx.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

function computeYRatio(height, max, min) {
  return height / (max - min);
}

function computeXRatio(width, length) {
  return width / (length - 2);
}

function getCoords(data, xRatio, yRatio, DPI_HEIGHT, PADDING, yMin) {
  return data.map((y, index) => {
    const coordX = Math.floor((index - 1) * xRatio);
    const coordY = Math.floor(DPI_HEIGHT - PADDING - (y - yMin) * yRatio);
    return [coordX, coordY];
  });
}
function clear(ctx, DPI_WIDTH, DPI_HEIGHT) {
  ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
}
function mouseLeave(proxy, tip) {
  proxy.mouse = null;
  tip.hide();
}

function mouseMove({ clientX, clientY }, canvas, proxy) {
  const { left, top } = canvas.getBoundingClientRect();
  proxy.mouse = {
    x: (clientX - left) * 2,
    tooltip: {
      left: clientX - left,
      top: clientY - top,
    },
  };
}

function css(el, styles = {}) {
  Object.assign(el.style, styles);
}

function resetMyChart(data, chart) {
  const isConfirmed = confirm("Are you sure?");
  if (!data.length) {
    return alert("The array is empty");
  }
  if (isConfirmed) {
    data.length = 0;
    data.push(0);
    chart.init();
  }
}

function deleteLast(data, chart) {
  if (!data.length) {
    return alert("The array is empty");
  }
  data.pop();
  chart.init();
}

function onSubmit(event, data, chart) {
  event.preventDefault();
  const y = +event.target.elements.coordY.value;
  if (y > 250) {
    return alert("Enter the correct number");
  } else {
    data.push(y);
    chart.init();
  }
}
export {
  computBoundaries,
  isOver,
  line,
  circle,
  computeYRatio,
  computeXRatio,
  getCoords,
  clear,
  mouseLeave,
  mouseMove,
  css,
  resetMyChart,
  deleteLast,
  onSubmit,
};
