<template>
  <v-container class="d-flex flex-wrap pa-lg-12">
      <v-card grow v-for="(quiz, i) in myQuizzes"
      :key="i"
      max-width="500"
      min-width="10%"
      class="ma-4">
        <v-card-title>
          {{quiz.title}}
        </v-card-title>
        <v-card-text>
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
        @click="modifyQuiz(quiz)"
      >
        Modify
      </v-btn>
      <v-btn
        text
        color="teal accent-4"
        @click="deleteQuiz(quiz)"
      >
        Delete
      </v-btn>
    </v-card-actions>
      </v-card>
  </v-container>
</template>

<script>
    export default {
        computed:{
            myQuizzes(){
                return this.$store.getters.getMyQuizzes;
            },
            user(){
              return this.$store.getters.getUser;
            },
        },
        beforeMount(){
            this.$store.dispatch('setMyQuizzes');
        },
        mounted(){
            if(this.user===null){
              this.$router.push('/');
            }
            this.$store.dispatch('setCurrentQuiz', null);
        },
        methods:{
          deleteQuiz(quiz){
            this.$store.dispatch('deleteQuiz', quiz);
          },
          modifyQuiz(quiz){
            this.$store.dispatch('setCurrentQuiz',quiz);
            this.$router.push('/create');
          }
        }
    }
</script>

<style lang="scss" scoped>

</style>