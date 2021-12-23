<template>
    <div class="mb-5">
        <v-alert
          :value="isError"
          color="pink"
          dark
          border="top"
          icon="mdi-home"
          transition="scale-transition"
        >
          {{errorMessage}}
        </v-alert>
        <v-container class="d-flex flex-wrap">
            <v-card v-for="(question,i) in questions"
            :key="i"
            max-width="500"
            min-width="200"
            class="ma-4 relative">
                <v-card-text>
                    <div class="text-h6 text--primary">Question {{i+1}}</div>
                    <p class="text--primary">
                      {{question.question}}
                    </p>
                    <p class="text-h6 text--primary">Answers</p>
                    <div class="text--primary">
                      <v-list-item-group
                          color="primary">
                          <v-list-item v-for="answer in question.answers"
                          :key="answer.id" :class="isCorrect(question.correctId, answer.id)">
                            <v-list-item-content>
                              <v-list-item-title v-text="answer.text"
                              class="customButton"/>
                            </v-list-item-content>
                          </v-list-item>
                      </v-list-item-group>
                    </div>
                </v-card-text>
                <v-btn absolute fab icon
                small class="edit"
                @click="openEdit(question,i)">
                    <v-icon>
                        mdi-pencil
                    </v-icon>
                </v-btn>
                <v-btn absolute fab icon
                small class="close"
                @click="deleteQuestion(i)">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-card>
        </v-container>
    <v-dialog
    max-width="100%"
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-container>
        <v-btn
          v-bind="attrs"
          v-on="on"
          @click="isError = false"
        >
            Add Question
        </v-btn>
        </v-container>
      </template>
      <v-card>
        <v-toolbar
        >
          <v-btn
            icon
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Question</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              text
              @click="saveQuestion"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-alert
          :value="isError"
          color="pink"
          dark
          border="top"
          icon="mdi-home"
          transition="scale-transition"
        >
          {{errorMessage}}
        </v-alert>


        <v-container class="d-flex
        " v-if="!questionComplete">
            <v-textarea
            v-model="question"
            auto-grow
            label="Question"
            outlined
            rows="1"
            @keydown.enter.prevent="questionComplete=true"
            :messages="message"
            row-height="15"
            autofocus
            ></v-textarea>
            <v-btn min-width="56" min-height="54"
            class="mx-2"
            elevation="1"
            @click="questionComplete = true">
                <v-icon>
                    mdi-check-bold
                </v-icon>
            </v-btn>    
        </v-container>

        <v-container class="d-flex align-center justify-space-between
        flex-wrap questions" v-if="questionComplete">
            <button
            disabled>
                Question: {{question}}
            </button>
            <v-btn min-width="56" min-height="54"
            class="mx-2"
            elevation="1"
            @click="questionComplete = false">
                <v-icon>
                    mdi-pencil
                </v-icon>
            </v-btn>    
        </v-container>

        <v-card
        elevation="0">
        <v-container class="d-flex align-center 
        justify-space-between flex-wrap"
        v-for="(answer,i) in answers"
        :key="i"
        :class="isCorrect(correctId, i)">
            <button>
                Answer {{i+1}}: {{answer}}
            </button>
            <div>
            <v-btn min-width="56" min-height="54"
            class="mx-2"
            elevation="1"
            :disabled="answerEdit"
            @click="setCorrectId(i)">
                <v-icon v-if="isMobile">
                    mdi-check-all
                </v-icon>
                <span v-if="!isMobile">
                    Correct
                </span>
            </v-btn>    
            <v-btn min-width="56" min-height="54"
            class="mx-2"
            elevation="1"
            :disabled="answerEdit"
            @click="removeAnswer(i)">
                <v-icon>
                    mdi-close
                </v-icon>
            </v-btn>    
            </div>
        </v-container>
        </v-card>

        <v-container
        v-show="!answerEdit">
            <v-btn @click="addAnswer">
                add an answer
            </v-btn>
        </v-container>

        <v-fade-transition>
        <v-container class="d-flex align-center
        " v-if="answerEdit">
            <v-textarea
            v-model="answers[answerCount]"
            auto-grow
            label="Answer"
            outlined
            hide-details
            @keydown.enter.prevent="answerEdit=false"
            rows="1"
            autofocus
            row-height="15"
            ></v-textarea>
            <v-btn min-width="56" min-height="54"
            class="mx-2"
            elevation="1"
            @click="answerEdit=false">
                <v-icon>
                    mdi-check-bold
                </v-icon>
            </v-btn>    
        </v-container>
        </v-fade-transition>

        
        </v-card>
    </v-dialog>
    <v-btn block large
    class="save-button dark primary"
    @click="saveToBase"
    width="90%">
        Save quiz
    </v-btn>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                message: 'press double check to mark the correct answer',
                questions:[],
                answerCount:-1,
                answers:[],
                answerEdit:false,
                dialog: false,
                question: '',
                questionComplete: false,
                correctId: null,
                checked: false,
                isMobile: false,
                isError: false,
                errorMessage: '',
                editing: false,
                questionId: null,
                modifyPage: false,
                quizId: null
            }
        },
        props:{
            title: String
        },
        computed:{
            user(){
                return this.$store.getters.getUser;
            },
            currentQuiz(){
                return this.$store.getters.getCurrentQuiz;
            }
        },
        methods:{
            addAnswer(){
                this.answerEdit=true;
                this.answerCount++;
                this.answers.push('');
            },
            removeAnswer(i){
                this.answers.splice(i,1);
                this.answerCount--;
                if(i==this.correctId){
                    this.correctId=null;
                }else{
                    this.correctId--;
                }
                
            },
            closeDialog(){
                this.dialog = false;
                this.answerCount=-1;
                this.answers=[];
                this.answerEdit=false;
                this.question= '';
                this.questionComplete= false;
                this.correctId=null;
            },
            saveQuestion(){
                if(this.check()){
                const finalAnswers = [];
                this.answers.forEach((answer, index) => {
                    finalAnswers.push({
                        text: answer,
                        id: index
                    });
                });
                const question = {
                    question: this.question,
                    answers: finalAnswers,
                    correctId: this.correctId,
                };
                if(this.editing){
                    this.questions[this.questionId]= question;
                    this.editing=false;
                }
                else{
                    this.questions.push(question);
                }
                this.closeDialog();
                }
                else{
                    this.isError= true;
                    if(this.question.length === 0 || !this.question.trim()){
                        this.errorMessage = 'Please enter the question'
                    }
                    else if(this.answers.length < 2){
                        this.errorMessage = 'Question should have at least two answers';
                    }
                    else if(this.correctId===null){
                        this.errorMessage = 'Please specify the correct answer'
                    }
                }                
            },
            check(){
                let correct = true;

                if(this.answers.length > 1 &&
                this.correctId!==null && this.question !== ''){
                    this.checked = true;
                    this.isError= false;
                    correct = true;
                }
                else{
                    this.checked = false;
                    correct= false;
                }
                this.answers.forEach((answer, index)=>{
                    if(answer.length === 0 || !answer.trim()){
                        this.errorMessage = "Answers cannot be empty";
                        correct= false;
                    }
                    if(this.answers.find((element ,index1)=>{
                        if(element === answer && index!==index1){
                            return true;
                        }
                        else return false;
                    })==answer){
                        this.errorMessage = "There should not be same answers";
                        correct= false;
                    }
                });
                return correct;
            },
            isCorrect(correctId, i){
                if(i==correctId){
                    return 'success'
                }
                else return ''
            },
            setCorrectId(i){
                this.correctId = i;
            },
            onResize () {
                this.isMobile = window.innerWidth < 600;
                if(this.isMobile){
                    this.message = "Press double check to mark the correct answer";
                }
                else{
                    this.message = 'Do not forget to specify correct answer'
                }
            },
            openEdit(question,i){
                this.editing = true;
                this.questionId= i;
                this.question = question.question;
                question.answers.forEach(answer => {
                    this.answers.push(answer.text);
                })
                this.correctId = question.correctId;
                this.dialog = true;
                this.answerCount = question.answers.length-1;
            },
            deleteQuestion(i){
                this.questions.splice(i,1);
            },
            saveToBase(){
                let quiz = {}
                if(this.questions.length>0 && !this.modifyPage){
                quiz = {
                    isPublic: true,
                    user: this.user,
                    title: this.$props.title,
                    questions: this.questions
                }
                this.$store.dispatch('saveQuiz', quiz);
                this.closeDialog();
                this.$router.push('/');
                }
                else if(this.title.length === 0 || !this.title.trim()){
                    this.isError= true;
                    this.errorMessage = "Please specify the title"
                }
                else{
                    this.isError = true;
                    this.errorMessage = "Please add at least one question";
                }
                if(this.modifyPage){
                                    quiz = {
                    isPublic: true,
                    user: this.user,
                    title: this.$props.title,
                    questions: this.questions
                }
                    this.closeDialog();
                    this.$router.push('/');
                    quiz.id = this.quizId;
                    this.$store.dispatch('updateQuiz', quiz);
                }
            }
        
        },
        beforeDestroy () {
            if (typeof window === 'undefined') return
            window.removeEventListener('resize', this.onResize, { passive: true })
        },
        mounted () {
            this.onResize();
            window.addEventListener('resize', this.onResize, { passive: true });

            if(this.currentQuiz!==null){
                this.questions=this.currentQuiz.questions;
                this.modifyPage = true;
                this.quizId = this.currentQuiz.id;
            }
        },
        watch:{
            question(){
                this.check();
            }
        }
    }
</script>

<style lang="scss" scoped>
.answer{
    display: inline;
    text-transform: none;
}
.questions{
    width: 100%;
}
.relative{
    position: relative;
}
.edit{ 
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%,25%);
}
.close{
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(0,25%);
}
.save-button{
    position: fixed;
    transform: translateY(-70%);
    bottom: 0;
    left: 0;
    z-index: 20;
}
</style>