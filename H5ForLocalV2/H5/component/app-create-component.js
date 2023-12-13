import { ref } from "../lib/vue@3.3.4.esm-browser.js";
import { ElMessage, ElMessageBox } from "element-plus";
import MenuComponent from "./menu-component.js";
import CanvasDraftThumbnailComponent from "./canvas-draft-thumbnail-component.js";
import strokeHistoryTable from "../db/controller/strokeHistory.js";

export default {
  components: {
    MenuComponent,
    CanvasDraftThumbnailComponent,
  },
  data() {
    return { draftItems: [] };
  },
  setup() {
    const items = ref([]);
    return { items };
  },

  methods: {
    onChangeBackgroundImage(e) {
      if (e && e.id) {
        this.$router.push({ name: "home", query: { id: e.id } });
      } else {
        this.$router.push({ name: "home" });
      }
    },
    deleteFn(e, $event) {
      if (e && e.id) {
        ElMessageBox({
          title: "提示",
          message: "是否删除此草稿？",
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }).then(async () => {
          await strokeHistoryTable.delete(e.id);
          this.draftItems = await strokeHistoryTable.select();
        });
      }
    },
  },
  beforeMount() {},
  async created() {
    this.draftItems = await strokeHistoryTable.select();
  },
  mounted() {
    document.getElementById("app").classList.add("create-page");
  },
  unmounted() {
    document.getElementById("app").classList.remove("create-page");
  },

  template: document.getElementById("AppCreateComponent"),
};
