import { ref } from "vue";
import {
  disablePageScale,
  drawImage,
  drawOnCanvas,
  drawOnCanvasLayer,
} from "./canvas-layer-core.js";
import { ElMessage, ElMessageBox } from "element-plus";
import strokeHistoryTable from "../db/controller/strokeHistory.js";

export default {
  props: {},
  data() {
    return {
      pickerColor: "red",
      strokeHistory: [],
      popStrokeHistory: [],
      lineWidth: 0,
      lineWidthPicker: 20,
      currentImage: { src: "" },
      canvasBackground: null,
      canvasDrawing: null,
      canvasSave: null,
    };
  },
  watch: {
    currentImage(newValue, oldValue) {
      this.drawBackgroundLayer();
    },
  },
  setup() {
    const items = ref([]);
    return { items };
  },
  methods: {
    drawBackgroundLayer(currentImage) {
      drawImage(
        this.canvasBackground,
        currentImage ? currentImage : this.currentImage
      );
    },
    drawOnCanvas(context, stroke) {
      drawOnCanvas(context, stroke, { pickerColor: this.pickerColor });
    },
    drawSaveLayer() {
      const context = this.canvasSave.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, this.canvasSave.width, this.canvasSave.height);

      drawOnCanvasLayer(this.canvasSave, this.strokeHistory, {
        pickerColor: this.pickerColor,
      });
    },
    drawDrawingLayer() {
      const $force = document.querySelectorAll("#force")[0];
      const $touches = document.querySelectorAll("#touches")[0];
      const context = this.canvasDrawing.getContext("2d");
      this.lineWidth = 0;
      let isDrawing = false;
      let points = [];

      const requestIdleCallback =
        window.requestIdleCallback ||
        function (fn) {
          setTimeout(fn, 1);
        };

      /**
       * Remove the previous stroke from history and repaint the entire canvas based on history
       * @return {void}
       */
      window.undoDraw = () => {
        if (this.strokeHistory.length) {
          let popStroke = this.strokeHistory.pop();
          this.popStrokeHistory.push(popStroke);
          context.clearRect(
            0,
            0,
            this.canvasDrawing.width,
            this.canvasDrawing.height
          );

          this.strokeHistory.map((stroke) => {
            if (this.strokeHistory.length === 0) return;

            context.beginPath();

            let strokePath = [];
            stroke.map((point) => {
              strokePath.push(point);
              this.drawOnCanvas(context, strokePath);
            });
          });
        }
      };

      window.forwardDraw = () => {
        if (this.popStrokeHistory.length) {
          let popStroke = this.popStrokeHistory.pop();
          this.strokeHistory.push(popStroke);
          context.clearRect(
            0,
            0,
            this.canvasDrawing.width,
            this.canvasDrawing.height
          );

          this.strokeHistory.map((stroke) => {
            if (this.strokeHistory.length === 0) return;

            context.beginPath();

            let strokePath = [];
            stroke.map((point) => {
              strokePath.push(point);
              this.drawOnCanvas(context, strokePath);
            });
          });
        }
      };

      window.clearDraw = () => {
        this.strokeHistory.length = 0;
        context.clearRect(
          0,
          0,
          this.canvasDrawing.width,
          this.canvasDrawing.height
        );
      };

      window.saveDraw = () => {
        if (this.$route.query.id) {
          strokeHistoryTable.update(this.$route.query.id, {
            strokeHistory: JSON.stringify(this.strokeHistory),
            currentImage: JSON.stringify(this.currentImage),
            updatedTime: new Date().getTime(),
          });
        } else {
          strokeHistoryTable.add([
            {
              strokeHistory: JSON.stringify(this.strokeHistory),
              currentImage: JSON.stringify(this.currentImage),
              updatedTime: new Date().getTime(),
            },
          ]);
        }
        // TODO 绘画内容草稿保存
        this.$router.push("/create");
      };
      window.exportDraw = () => {
        // 如果 toBlob 方法出现兼容性问题建议引入 https://github.com/eligrey/canvas-toBlob.js
        this.drawSaveLayer();
        this.canvasSave.toBlob((blob) => {
          sendMessageToSwift(blob);
        });
      };

      for (const ev of ["touchstart", "mousedown"]) {
        this.canvasDrawing.addEventListener(ev, (e) => {
          let pressure = 0.1;
          let x, y;
          if (
            e.touches &&
            e.touches[0] &&
            typeof e.touches[0]["force"] !== "undefined"
          ) {
            if (e.touches[0]["force"] > 0) {
              pressure = e.touches[0]["force"];
            }
            x = e.touches[0].pageX * 2;
            y = e.touches[0].pageY * 2;
          } else {
            pressure = 1.0;
            x = e.pageX * 2;
            y = e.pageY * 2;
          }

          isDrawing = true;

          // pencil force === 1，手指 force === 0.1 防止误触
          if (pressure >= 1) {
            this.lineWidth = Math.log(pressure + 1) * this.lineWidthPicker;
            context.lineWidth = this.lineWidth;
            points.push({
              x,
              y,
              lineWidth: this.lineWidth,
              color: this.pickerColor,
            });
            this.drawOnCanvas(context, points);
          }
        });
      }

      for (const ev of ["touchmove", "mousemove"]) {
        this.canvasDrawing.addEventListener(ev, (e) => {
          if (!isDrawing) return;
          e.preventDefault();

          let pressure = 0.1;
          let x, y;
          if (
            e.touches &&
            e.touches[0] &&
            typeof e.touches[0]["force"] !== "undefined"
          ) {
            if (e.touches[0]["force"] > 0) {
              pressure = e.touches[0]["force"];
            }
            x = e.touches[0].pageX * 2;
            y = e.touches[0].pageY * 2;
          } else {
            pressure = 1.0;
            x = e.pageX * 2;
            y = e.pageY * 2;
          }

          // pencil force === 1，手指 force === 0.1 防止误触
          if (pressure >= 1) {
            // smoothen line width
            this.lineWidth =
              Math.log(pressure + 1) * this.lineWidthPicker * 0.2 +
              this.lineWidth * 0.8;
            points.push({
              x,
              y,
              lineWidth: this.lineWidth,
              color: this.pickerColor,
            });
            this.drawOnCanvas(context, points);
          }

          requestIdleCallback(() => {
            $force.textContent = "force = " + pressure;

            const touch = e.touches ? e.touches[0] : null;
            if (touch) {
              $touches.innerHTML = `
                  touchType = ${touch.touchType} ${
                touch.touchType === "direct" ? "👆" : "✍️"
              } <br/>
                  radiusX = ${touch.radiusX} <br/>
                  radiusY = ${touch.radiusY} <br/>
                  rotationAngle = ${touch.rotationAngle} <br/>
                  altitudeAngle = ${touch.altitudeAngle} <br/>
                  azimuthAngle = ${touch.azimuthAngle} <br/>
                `;
            }
          });
        });
      }

      for (const ev of ["touchend", "touchleave", "mouseup"]) {
        this.canvasDrawing.addEventListener(ev, (e) => {
          let pressure = 0.1;
          let x, y;

          if (
            e.touches &&
            e.touches[0] &&
            typeof e.touches[0]["force"] !== "undefined"
          ) {
            if (e.touches[0]["force"] > 0) {
              pressure = e.touches[0]["force"];
            }
            x = e.touches[0].pageX * 2;
            y = e.touches[0].pageY * 2;
          } else {
            pressure = 1.0;
            x = e.pageX * 2;
            y = e.pageY * 2;
          }

          isDrawing = false;

          requestIdleCallback(() => {
            this.strokeHistory.push([...points]);
            points = [];
          });

          this.lineWidth = 0;
        });
      }
    },
    async drawStrokeHistory() {
      if (this.$route.query.id) {
        const tmpItem = await strokeHistoryTable.get(this.$route.query.id);
        this.PhotoGalleryComponent.onChangeBackgroundImage(
          JSON.parse(tmpItem.currentImage)
        );
        this.strokeHistory = JSON.parse(tmpItem.strokeHistory);
        drawOnCanvasLayer(this.canvasDrawing, this.strokeHistory, {
          pickerColor: this.pickerColor,
        });
      } else {
        this.currentImage = this.PhotoGalleryComponent.items[0];
        this.PhotoGalleryComponent.currentImage = this.currentImage;
      }
    },
    init() {
      this.drawDrawingLayer();
      this.drawStrokeHistory();
    },
    redrawDrawingLayer() {
      this.setCanvas();
      drawOnCanvasLayer(this.canvasDrawing, this.strokeHistory, {
        pickerColor: this.pickerColor,
      });
      this.drawBackgroundLayer();
    },
    setCanvas() {
      this.canvasBackground = this.canvasBackground
        ? this.canvasBackground
        : document.getElementById("backgroundLayer");
      this.canvasBackground.width = window.innerWidth * 2;
      this.canvasBackground.height = window.innerHeight * 2;
      this.canvasDrawing = this.canvasDrawing
        ? this.canvasDrawing
        : document.getElementById("drawingLayer");
      this.canvasDrawing.width = window.innerWidth * 2;
      this.canvasDrawing.height = window.innerHeight * 2;
      this.canvasSave = this.canvasSave
        ? this.canvasSave
        : document.getElementById("saveLayer");
      this.canvasSave.width = window.innerWidth * 2;
      this.canvasSave.height = window.innerHeight * 2;
    },
  },
  created() {
    disablePageScale();
  },
  mounted() {
    this.PhotoGalleryComponent = this.$parent.$refs.PhotoGalleryComponent;
    this.setCanvas();
    this.init();
  },
  template: document.getElementById("CanvasLayerComponent"),
};
