
export default {
  components: {},
  data() {
    return {
      isShow: false,
      lineWidthPicker: 20,
      lineWidthItems: [],
      lineWidthDefaultPicker: 20,
      lineWidthMax: 60,
      lineWidthMin: 10,
    };
  },
  methods: {
    onShowPicker() {
      this.isShow = !this.isShow;
      this.ColorPickerComponent.hide();
    },
    onChangePicker(v) {
      this.lineWidthPicker = parseInt(v, 10);
      this.CanvasLayerComponent.lineWidthPicker = this.lineWidthPicker;
    },
    hide() {
      this.isShow = false;
    },
  },
  created() {
    for (let i = this.lineWidthMin; i <= this.lineWidthMax; i = i + 2) {
      this.lineWidthItems.push(i);
    }
  },
  mounted() {
    this.CanvasLayerComponent = this.$parent.$refs.CanvasLayerComponent;
    this.ColorPickerComponent = this.$parent.$refs.ColorPickerComponent;
  },
  template: document.getElementById("PenPickerComponent"),
};
