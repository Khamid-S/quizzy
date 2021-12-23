<template>
  <v-container class="d-flex flex-wrap 
  justify-space-between pa-lg-12">
      <v-card grow v-for="(quiz, i) in getQuizzes"
      :key="i"
      width="400px"
      class="ma-4">
        <v-card-title>
          {{quiz.title}}
        </v-card-title>
        <v-card-text>
            <p>By {{quiz.user.email}}</p>
      <div class="text-h6 text--primary">Question 1</div>
      <p class="text--primary">
        {{quiz.questions[0].question}}
      </p>
      <p class="text-h6 text--primary">Answers</p>
      <div class="text--primary">
        <v-list-item v-for="(answer,j) in quiz.questions[0].answers"
        :key="j">
          <v-list-item-content>
            <v-list-item-title>{{answer.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="teal accent-4"
        @click="goToQuiz(quiz)"
      >
        Take this quiz
      </v-btn>
    </v-card-actions>
      </v-card>
  </v-container>
</template>

<script>

export default {
  data(){
    return{

    }
  },
  computed:{
    getQuizzes(){
      return this.$store.getters.getQuizzes;
    },
  },
  methods:{
    goToQuiz(quiz){
      this.$store.dispatch('setCurrentQuiz',quiz);
      this.$router.push('/quiz');
    }
  },
  mounted(){
    this.$store.dispatch('setCurrentQuiz', null);
  }
}
</script>