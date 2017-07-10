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
    songs: [],
    songSearchText: ''
  }
})
