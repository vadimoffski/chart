import {
  WIDTH,
  HEIGHT,
  PADDING,
  DPI_WIDTH,
  DPI_HEIGHT,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  ROWS_COUNT,
  LINE_COLOUR,
  CIRCLE_COLOUR,
  X_COLOUR,
  Y_COLOUR,
} from "./constants";
import { tooltip } from "./tooltip";
import {
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
} from "./utils";

export function chart(root, data) {
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const tip = tooltip(root.querySelector('[data-el="tooltip"]'));

  clear(ctx, DPI_WIDTH, DPI_HEIGHT);
  const proxy = new Proxy(
    {},
    {
      set(...args) {
        const result = Reflect.set(...args);
        raf = requestAnimationFrame(paint);
        return result;
      },
    }
  );
  let raf;
  css(canvas, {
    width: WIDTH + "px",
    height: HEIGHT + "px",
  });

  canvas.width = DPI_WIDTH;
  canvas.height = DPI_HEIGHT;
  canvas.addEventListener("mousemove", (event) =>
    mouseMove(event, canvas, proxy)
  );
  canvas.addEventListener("mouseleave", () => mouseLeave(proxy, tip));

  function xAxis(coords, xRatio) {
    const colsCount = 6;
    const step = Math.round(coords.length / colsCount);
    ctx.beginPath();
    for (let i = 1; i < coords.length; i++) {
      const x = (i - 1) * xRatio;
      if (i % step === 0) {
        ctx.fillText(i.toString(), x, DPI_HEIGHT - 10);
      }

      if (isOver(proxy.mouse, x, coords.length, DPI_WIDTH)) {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.moveTo(x, PADDING / 2);
        ctx.lineTo(x, DPI_HEIGHT - PADDING);
        ctx.restore();
        tip.show(proxy.mouse.tooltip, {
          title: "Coords:",
          items: [
            { colorX: X_COLOUR, colorY: Y_COLOUR, x: `${i}`, y: `${data[i]}` },
          ],
        });
      }
    }
    ctx.stroke();
    ctx.closePath();
  }

  function yAxis(yMax, yMin) {
    const step = VIEW_HEIGHT / ROWS_COUNT;
    const textStep = (yMax - yMin) / ROWS_COUNT;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.font = "normal 20px Halvetica,sans-serif";
    ctx.strokeStyle = "#bbb";
    ctx.fillStyle = "#96a2aa";
    for (let i = 1; i <= ROWS_COUNT; i++) {
      const y = step * i;
      const text = Math.round(yMax - textStep * i);
      ctx.fillText(text.toString(), 5, y + PADDING - 10);
      ctx.moveTo(0, y + PADDING);
      ctx.lineTo(DPI_WIDTH, y + PADDING);
    }
    ctx.stroke();
    ctx.closePath();
  }

  function paint() {
    clear(ctx, DPI_WIDTH, DPI_HEIGHT);
    const [yMin, yMax] = computBoundaries(data);
    const yRatio = computeYRatio(VIEW_HEIGHT, yMax, yMin);
    const xRatio = computeXRatio(VIEW_WIDTH, data.length);

    const coords = getCoords(data, xRatio, yRatio, DPI_HEIGHT, PADDING, yMin);
    yAxis(yMax, yMin);
    xAxis(coords, xRatio);
    line(ctx, coords, LINE_COLOUR);
    for (const [x, y] of coords) {
      if (isOver(proxy.mouse, x, coords.length, DPI_WIDTH)) {
        circle(ctx, [x, y], CIRCLE_COLOUR);
        break;
      }
    }
  }

  return {
    init() {
      paint();
    },
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove");
      canvas.removeEventListener("mouseleave");
    },
  };
}
