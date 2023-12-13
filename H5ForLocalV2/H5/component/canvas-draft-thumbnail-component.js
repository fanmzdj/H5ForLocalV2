import { ref } from "../lib/vue@3.3.4.esm-browser.js";
import { drawOnCanvasLayer } from "./canvas-layer-core.js";

export default {
  props: {
    strokeHistory: String,
  },
  data() {
    return {
      canvasDraftThumbnailLayer: null,
    };
  },
  setup() {
    const items = ref([]);
    return { items };
  },
  methods: {
    setCanvas() {
      this.canvasDraftThumbnailLayer = this.$refs.draftThumbnailLayer;
      this.canvasDraftThumbnailLayer.width = window.innerWidth * 2;
      this.canvasDraftThumbnailLayer.height = window.innerHeight * 2;
    },
    drawStrokeHistory() {
      drawOnCanvasLayer(
        this.canvasDraftThumbnailLayer,
        JSON.parse(this.strokeHistory),
        {
          pickerColor: "red",
        }
      );
    },
  },
  mounted() {
    this.setCanvas();
    this.drawStrokeHistory();
  },
  template: document.getElementById("CanvasDraftThumbnailComponent"),
};
