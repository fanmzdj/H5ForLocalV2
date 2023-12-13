import { ref } from "../lib/vue@3.3.4.esm-browser.js";

export default {
  components: {},
  data() {
    return {
      isShow: "",
      pickerColor: "",
    };
  },
  setup() {
    const items = ref([]);
    return { items };
  },

  computed: {
    colorPickerItems() {
      let strokeStyle = [
        "#000000",
        "#FFFFFF",
        "#FF0000",
        "#FF2400",
        "#E34234",
        "#FF6600",
        "#FFBF00",
        "#FFD700",
        "#FFFF00",
        "#CCFF00",
        "#66FF00",
        "#008001",
        "#00FFFF",
        "#007FFF",
        "#0000FF",
        "#7FFFD4",
        "#E0FFFF",
        "#F0F8FF",
        "#30D5C8",
        "#6495ED",
        "#003399",
        "#4169E1",
        "#003153",
        "#003366",
        "#2A52BE",
        "#0047AB",
        "#1E90FF",
        "#002FA7",
        "#000080",
        "#5E86C1",
        "#CCCCFF",
        "#082567",
        "#8000FF",
        "#E32636",
        "#FF00FF",
      ];
      return strokeStyle;
    },
  },

  methods: {
    onShowPicker() {
      this.isShow = !this.isShow;
      this.PenPickerComponent.hide();
    },
    onChangePicker(v) {
      this.pickerColor = v;
      this.CanvasLayerComponent.pickerColor = this.pickerColor;
    },
    hide() {
      this.isShow = false;
    },
  },
  created() {},
  mounted() {
    this.CanvasLayerComponent = this.$parent.$refs.CanvasLayerComponent;
    this.PenPickerComponent = this.$parent.$refs.PenPickerComponent;
    // 颜色选择面板
    ColorPicker(
      document.getElementById("slider"),
      document.getElementById("picker"),
      (hex) => {
        this.onChangePicker(hex);
      }
    );
  },
  template: document.getElementById("ColorPickerComponent"),
};
