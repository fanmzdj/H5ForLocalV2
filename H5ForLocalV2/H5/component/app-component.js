import { ref } from "../lib/vue@3.3.4.esm-browser.js";
import CanvasLayerComponent from "./canvas-layer-component.js";
import MenuComponent from "./menu-component.js";
import PhotoGalleryComponent from "./photo-gallery-component.js";
import ColorPickerComponent from "./color-picker-component.js";
import PenPickerComponent from "./pen-picker-component.js";
import { initDb } from "../db/install.v2.js";

export default {
  components: {
    CanvasLayerComponent,
    PhotoGalleryComponent,
    MenuComponent,
    ColorPickerComponent,
    PenPickerComponent,
  },
  data() {
    return {};
  },
  setup() {
    const items = ref([]);
    return { items };
  },

  methods: {
    onEventResizeHeight() {
      const doms = document.querySelectorAll("[ibEvent='onEventResizeHeight']");
      doms.forEach((dom) => {
        let minusHeight = parseInt(dom.getAttribute("ibEventMinusHeight"));
        let innerHeight = isNaN(minusHeight)
          ? window.innerHeight
          : window.innerHeight - minusHeight;
        dom.style.setProperty("height", `${innerHeight}px`);
      });
    },

    onEventResizeTop() {
      const doms = document.querySelectorAll("[ibEvent='onEventResizeTop']");
      doms.forEach((dom) => {
        let top = parseInt(dom.getAttribute("ibEventMinusTop"));
        if (!isNaN(top)) {
          dom.style.setProperty("top", `${window.innerHeight - top}px`);
        }
      });
    },
  },
  beforeMount() {
    initDb();
  },
  created() {
    const convertStyle = () => {
      this.onEventResizeHeight();
      this.onEventResizeTop();
      setTimeout(() => {
        this.CanvasLayerComponent.redrawDrawingLayer();
      }, 100);
    };
    window.addEventListener("resize", convertStyle);
    window.addEventListener("DOMContentLoaded", convertStyle);
  },
  mounted() {
    this.CanvasLayerComponent = this.$refs.CanvasLayerComponent;
  },
  template: document.getElementById("AppComponent"),
};
