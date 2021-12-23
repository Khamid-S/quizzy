import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Quizzes from '../views/Quizzes.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Quiz from '../views/Quiz.vue'
import Create from '../views/Create.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/quizzes',
    name: 'My Quizzes',
    component: Quizzes
  },
  {
    path: '/create',
    name: 'Create Quiz',
    component: Create
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
