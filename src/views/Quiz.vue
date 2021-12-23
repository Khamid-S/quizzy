<template>
    <div>
        <v-container
        class="pa-0"
        v-for="question in currentQuiz.questions"
        :key="currentQuiz.questions.indexOf(question)">
        <v-slide-x-transition hide-on-leave>
            <div v-if="currentQuiz.questions.indexOf(question) == questionIndex && !finished && !showResult">
        <v-card-title>
          {{currentQuiz.title}}
        </v-card-title>
        <v-card-text>
      <div class="text-h6 text--primary">Question {{questionIndex+1}}</div>
      <p class="text--primary">
        {{currentQuiz.questions[questionIndex].question}}
      </p>
      <p class="text-h6 text--primary">Answers</p>
      <div class="text--primary">
        <v-list-item-group
            v-model="answerBox[questionIndex]"
            color="primary">
            <v-list-item v-for="(answer,i) in shuffledAnswers[questionIndex].answers"
            :key="answer.id" 
            @click="addAnswer(answer.id,i)">
              <v-list-item-content>
                <v-list-item-title v-text="answer.text"
                class="customButton"/>
              </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="lastQuestion"
      v-show="questionIndex>0">
          <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer/>
      <v-btn @click="nextQuestion"
      v-show="questionIndex<currentQuiz.questions.length-1">
          <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
      <v-btn @click="finish"
      v-show="questionIndex==currentQuiz.questions.length-1">
          Finish quiz
      </v-btn>
    </v-card-actions>
    </div>
        </v-slide-x-transition>
        <v-slide-x-transition hide-on-leave>
            <div v-if="currentQuiz.questions.indexOf(question) == questionIndex && finished && !showResult">
        <v-card-title>
          {{currentQuiz.title}}
        </v-card-title>
        <v-card-text>
      <div class="text-h6 text--primary">Question {{questionIndex+1}}</div>
      <p class="text--primary">
        {{currentQuiz.questions[questionIndex].question}}
      </p>
      <p class="text-h6 text--primary">Answers</p>
      <div class="text--primary">

            <v-list-item v-for="answer in shuffledAnswers[questionIndex].answers"
            :class="resultAnswer(answer)"
            :key="answer.id" >
              <v-list-item-content>
                <v-list-item-title v-text="answer.text"
                class="customButton"/>
              </v-list-item-content>
            </v-list-item>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="lastQuestion"
      v-show="questionIndex>0">
          <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer/>
      <v-btn @click="nextQuestion"
      v-show="questionIndex<currentQuiz.questions.length-1">
          <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    <v-btn @click="showResultSheet"
      v-show="questionIndex==currentQuiz.questions.length-1">
          See Result Sheet
      </v-btn>
    </v-card-actions>
    </div>
        </v-slide-x-transition>
    </v-container>
    <v-container>
        <v-slide-x-transition>
            <div v-if="showResult">
                <v-list disabled>
                    <v-subheader>Result Sheet</v-subheader>
                    <v-list-item-group
                      color="primary"
                    >
                      <v-list-item
                        v-for="(question, i) in currentQuiz.questions"
                        :key="i"
                      >
                        <v-list-item-content
                        :class="resultColor(answers[i])">
                          <v-list-item-title>
                              {{i+1}}) {{text(i)}}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                    <v-list-item-subtitle>
                        Correct: {{correctAnswerCount}}/{{answers.length}}
                    </v-list-item-subtitle>
                </v-list>
            </div>
        </v-slide-x-transition>
    </v-container>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                questionIndex:0,
                answerBox: [],
                answers:[],
                finished: false,
                shuffledAnswers: [],
                showResult: false,
                correctAnswerCount: 0
            }
        },
        methods:{
            lastQuestion(){
                this.questionIndex--;
            },
            nextQuestion(){
                this.questionIndex++;
            },
            shuffle(array) {
                let resultQuestions = [];
                array.forEach(question=>{
                    let result = [];
                    let that = question.answers.slice();
                    question.answers.forEach(function () {
                        result.push(that.splice(Math.floor(Math.random() * that.length), 1)[0]);
                });
                    resultQuestions.push({
                        question: question.question,
                        answers: result,
                        correctId: question.correctId
                    })
                });
                return resultQuestions;
            },
            finish(){
                this.questionIndex = 0;
                this.finished = true;
            },
            addAnswer(answerId,i){
                if(this.answerBox[this.questionIndex]===i){
                    this.answerBox[this.questionIndex]=undefined;
                }
                else{
                    this.answerBox[this.questionIndex]=i;
                }
                if(this.answerBox[this.questionIndex]===i){
                const answer = {
                    givenAnswer: answerId,
                    correctAnswer: this.shuffledAnswers[this.questionIndex].correctId
                }
                this.answers[this.questionIndex] = answer;
                }
                else{
                    const answer = {
                    givenAnswer: undefined,
                    correctAnswer: this.shuffledAnswers[this.questionIndex].correctId
                };
                this.answers[this.questionIndex] = answer
                }
            },
            resultAnswer(answer){
                if(answer.id==this.answers[this.questionIndex].correctAnswer&&this.answers[this.questionIndex].correctAnswer==this.answers[this.questionIndex].givenAnswer){
                    return 'success';
                }
                if(answer.id==this.answers[this.questionIndex].givenAnswer){
                    return 'error';
                }
                if(answer.id==this.answers[this.questionIndex].correctAnswer){
                    return 'blue';
                }
            },
            showResultSheet(){
                this.answers.forEach(answer=>{
                    if(answer.correctAnswer==answer.givenAnswer){
                        this.correctAnswerCount++;
                    }
                })
                this.showResult = true;
            },
            resultColor(answer){
                if(answer.givenAnswer===answer.correctAnswer){
                    return 'success'
                }
                else{
                    return 'error'
                }
            },
            text(i){
                if(this.answers[i].givenAnswer!==undefined&&this.currentQuiz){
                    return this.currentQuiz.questions[i].answers[this.answers[i].givenAnswer].text
                }
                else {
                    return ''
                }
            }
        },

        computed:{
            currentQuiz(){
                return this.$store.getters.getCurrentQuiz;
            },
        },
 
        created(){
            if(!this.currentQuiz){
                this.$router.push('/');
            }
            
            this.currentQuiz.questions.forEach((question) => {
                this.answerBox.push('');
                this.answers.push({
                    givenAnswer: undefined,
                    correctAnswer: question.correctId
                })
            });
            this.shuffledAnswers = this.shuffle(this.currentQuiz.questions);
        },
        beforeDestroy(){
            this.$store.dispatch('setCurrentQuiz',null);
        }
    }
</script>

<style scoped>
.customButton{
    display: inline;
    line-height: 25px;
    text-transform: none;
    font-size: 16px;
    width: 100%;
    white-space: normal !important;
    -webkit-line-clamp: unset;
}

</style>