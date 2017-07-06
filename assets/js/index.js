var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    things: [10, 20, 30]
  },
  methods: {
    callMarcel: function() {
      app.message = "Calling";
    }
  }
})
