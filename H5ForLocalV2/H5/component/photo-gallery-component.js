import { ref } from "../lib/vue@3.3.4.esm-browser.js";

export default {
  data() {
    return {
      isFoldUp: false,
      currentImage: null,
    };
  },

  methods: {
    onChangeBackgroundImage(item) {
      this.currentImage = item;
      if (this.CanvasLayerComponent) {
        this.CanvasLayerComponent.currentImage = item;
      }
    },
    onFoldUp() {
      this.isFoldUp = !this.isFoldUp;
    },
  },

  setup() {
    const food = [
      { src: "images/food/burger.svg" },
      { src: "images/food/cake.svg" },
      { src: "images/food/candy.svg" },
      { src: "images/food/carrot.svg" },
      { src: "images/food/cheese.svg" },
      { src: "images/food/chicken-leg.svg" },
      { src: "images/food/coffee.svg" },
      { src: "images/food/drink.svg" },
      { src: "images/food/egg.svg" },
      { src: "images/food/face.svg" },
      { src: "images/food/ice-cream.svg" },
      { src: "images/food/lemon.svg" },
      { src: "images/food/watermelon.svg" },
      { src: "images/food/pineapple.svg" },
    ];
    const animal = [
      { src: "images/animal/bird.svg" },
      { src: "images/animal/deer.svg" },
      { src: "images/animal/flamingo.svg" },
      { src: "images/animal/fox.svg" },
    ];
    const tree = [
      { src: "images/tree/branch.svg" },
      { src: "images/tree/cactus-2.svg" },
      { src: "images/tree/cactus.svg" },
      { src: "images/tree/leaf.svg" },
      { src: "images/tree/leaves.svg" },
      { src: "images/tree/potted-cactus.svg" },
      { src: "images/tree/tree-2.svg" },
      { src: "images/tree/tree.svg" },
    ];
    const other = [
      { src: "images/other/animal-ant.svg" },
      { src: "images/other/animal-bug.svg" },
      { src: "images/other/corn.svg" },
      { src: "images/other/pizza.svg" },
      { src: "images/other/animal-aquarium.svg" },
      { src: "images/other/animal-cow.svg" },
      { src: "images/other/donut.svg" },
      { src: "images/other/planet.svg" },
      { src: "images/other/animal-bat.svg" },
      { src: "images/other/animal-crab.svg" },
      { src: "images/other/fries.svg" },
      { src: "images/other/rice.svg" },
      { src: "images/other/animal-bird.svg" },
      { src: "images/other/animal-frog.svg" },
      { src: "images/other/grape.svg" },
      { src: "images/other/soft-drink.svg" },
      { src: "images/other/animal-bug-2.svg" },
      { src: "images/other/animal-pet-2.svg" },
      { src: "images/other/ice-cream.svg" },
      { src: "images/other/space.svg" },
      { src: "images/other/animal-bug-3.svg" },
      { src: "images/other/animal-pet.svg" },
      { src: "images/other/lollipop.svg" },
      { src: "images/other/spaceship.svg" },
      { src: "images/other/animal-bug-4.svg" },
      { src: "images/other/apple.svg" },
      { src: "images/other/pizza-2.svg" },
      { src: "images/other/strawberry.svg" },
    ];
    const items = ref([].concat(food, animal, tree, other));
    return { items };
  },

  mounted() {
    this.CanvasLayerComponent = this.$parent.$refs.CanvasLayerComponent;
  },
  template: document.getElementById("PhotoGalleryComponent"),
};
