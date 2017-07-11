var app = new Vue({
  el: '#app',
  data: {
    dashItems: [{
        title: 'Home',
        icon: 'dashboard'
      },
      {
        title: 'About',
        icon: 'question_answer'
      }
    ],
    foodQuery: '',
    recipes: []
  },
  methods: {
    searchFoods() {
      axios.get('/get_recipes', {
          params: {
            q: this.foodQuery
          }
        })
        .then(function (response) {
          app.recipes = response.data.hits;
        })
        .catch(function (error) {
          app.recipes = []
          console.log(error);
        });
    }
  }
})
