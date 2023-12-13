import { ref } from "../lib/vue@3.3.4.esm-browser.js";

export default {
  data() {
    return {
      isCreatePage: false,
      isHomePage: false,
    };
  },

  setup() {
    const items = ref([]);
    return { items };
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
  created() {
    this.isCreatePage = this.$route.name === "create";
    this.isHomePage = this.$route.name === "home";
  },
  template: document.getElementById("MenuComponent"),
};
