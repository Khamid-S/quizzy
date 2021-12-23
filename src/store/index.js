import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  quizzes:[],
  user: null,
  requestTime: false,
  errorMessage: '',
  currentQuiz: null,
  myQuizzes: [],
  },
  mutations: {
    setUser(state, user){
      state.user = user;
    },
    setRequestTime(state, bool){
      state.requestTime = bool;
    },
    setErrorMessage(state, message){
      state.errorMessage = message;
    },
    setCurrentQuiz(state, quiz){
      state.currentQuiz = quiz;
    },
    addQuiz(state, quiz){
      state.quizzes.push(quiz);
    },
    setMyQuizzes(state, myQuizzes){
      state.myQuizzes = myQuizzes;
    },
    setQuizzes(state, quizzes){
      state.quizzes = quizzes;
    },
  },
  actions: {
    deleteQuiz({commit},quiz){
      firebase.database().ref('/users/'+quiz.user.uid+"/"+quiz.id).remove();
      


      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/').child(userId).once('value').then((data)=>{
        const quizzes = [];
        const obj = data.val();
        for (let key in obj){
          quizzes.push({
            isPublic: obj[key].isPublic,
            questions: obj[key].questions,
            title: obj[key].title,
            user: obj[key].user,
            id: key
          })
        }
        commit('setMyQuizzes', quizzes);
      })

      firebase.database().ref('/users/').once('value').then((data)=>{
        const user = data.val();
        const quizzes = [];
        for (let userkey in user){
          const obj = user[userkey];
          for (let key in obj){
            quizzes.push({
              isPublic: obj[key].isPublic,
              questions: obj[key].questions,
              title: obj[key].title,
              user: obj[key].user,
              id: key
            })
          }
        }
        
        commit('setQuizzes', quizzes);
      })
    },
    signUserUp ({commit}, payload){
      commit('setRequestTime',true);
      firebase.auth().createUserWithEmailAndPassword(payload.email,payload.password)
      .then(
        response => {
          const newUser = {
            id: response.user.uid,
            email: response.user.email
          }
          commit('setUser', newUser);
          commit('setErrorMessage', '');
        }
      )      
      .catch(
        error => {
          commit('setErrorMessage',error.message);
          commit('setRequestTime',false);
        }
      )
    },
    login({commit}, payload){
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        response =>{
          const user = {
            uid: response.user.uid,
            email: response.user.email,
          }
          commit('setUser',user);
          commit('setErrorMessage', '');
        }
      )
      .catch(
        error => {
          commit('setErrorMessage',error.message);
          commit('setRequestTime',false);
        }
      )

    },
    setCurrentQuiz({commit}, quiz){
      commit('setCurrentQuiz',quiz);
    },
    saveQuiz({commit},quiz){
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/'+ userId).push(quiz);
      commit('addQuiz',quiz);
    },
    setUser({commit},user){
      firebase.auth().signOut();
      commit('setUser',user);
    },
    setMyQuizzes({commit}){
      let userId;
      if(firebase.auth().currentUser){
        userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/').child(userId).once('value').then((data)=>{
          const quizzes = [];
          const obj = data.val();
          for (let key in obj){
            quizzes.push({
              isPublic: obj[key].isPublic,
              questions: obj[key].questions,
              title: obj[key].title,
              user: obj[key].user,
              id: key
            })
          }
          commit('setMyQuizzes', quizzes);
        })
        }
      
    },
    setPublicQuizzes({commit}){
      firebase.database().ref('/users/').once('value').then((data)=>{
        const user = data.val();
        const quizzes = [];
        for (let userkey in user){
          const obj = user[userkey];
          for (let key in obj){
            quizzes.push({
              isPublic: obj[key].isPublic,
              questions: obj[key].questions,
              title: obj[key].title,
              user: obj[key].user,
              id: key
            })
          }
        }
        
        commit('setQuizzes', quizzes);
      })
    },
    setRequestTime({commit}, bool){
      commit('setRequestTime', bool);
    },
    updateQuiz({commit},quiz){
        const userId = firebase.auth().currentUser.uid;
        // A post entry.
        var newQuiz = {
          title: quiz.title,
          questions: quiz.questions,
          isPublic: quiz.isPublic,
          user: quiz.user
        };
            
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/users/' + userId + "/" + quiz.id] = newQuiz;
      
        firebase.database().ref().update(updates);

      firebase.database().ref('/users/').child(userId).once('value').then((data)=>{
        const quizzes = [];
        const obj = data.val();
        for (let key in obj){
          quizzes.push({
            isPublic: obj[key].isPublic,
            questions: obj[key].questions,
            title: obj[key].title,
            user: obj[key].user,
            id: key
          })
        }
        commit('setMyQuizzes', quizzes);
      })

      firebase.database().ref('/users/').once('value').then((data)=>{
        const user = data.val();
        const quizzes = [];
        for (let userkey in user){
          const obj = user[userkey];
          for (let key in obj){
            quizzes.push({
              isPublic: obj[key].isPublic,
              questions: obj[key].questions,
              title: obj[key].title,
              user: obj[key].user,
              id: key
            })
          }
        }
        
        commit('setQuizzes', quizzes);
      })
    }
  },
  modules: {
  },
  getters: {
    getQuizzes: (state)=>{
      return state.quizzes;
    },
    getUser: (state) =>{
      return state.user;
    },
    getRequestTime: (state) =>{
      return state.requestTime;
    },
    getErrorMessage: (state) =>{
      return state.errorMessage
    },
    getCurrentQuiz: (state)=>{
      return state.currentQuiz;
    },
    getMyQuizzes: (state)=>{
      return state.myQuizzes;
    },
  }
})
