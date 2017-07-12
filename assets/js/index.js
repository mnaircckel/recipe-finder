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
    recipes: [],
    loading: false
  },
  methods: {
    searchFoods() {
      this.loading = true
      axios.get('/get_recipes', {
          params: {
            q: this.foodQuery
          }
        })
        .then(function(response) {
          app.recipes = response.data.hits;
          app.loading = false;
        })
        .catch(function(error) {
          app.recipes = [];
          app.loading = false;
          console.log(error);
        });
      this.foodQuery = '';
    }
  }
})
