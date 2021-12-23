<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      temporary
      v-show="isMobile"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          @click="logout(item.title)"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      fixed
      app
      dense
    >
      <v-app-bar-nav-icon
      v-show="isMobile"
      @click.stop="drawer = !drawer" />

      <v-btn text @click="goHome">
      <v-toolbar-title v-text="title" />
      </v-btn>
      <v-spacer />
      <v-btn v-for="item in items"
      :key="item.title" text      
      v-show="!isMobile"
      :to="item.to"
      @click="logout(item.title)">
        <v-icon class="pr-1">{{item.icon}}</v-icon>
        <span>{{item.title}}</span>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer
      height="30"
      app
      style="z-index"
    >
      <span >&copy; {{ new Date().getFullYear() }} Hamid Solih</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'Quizzy',
      drawer: false,
      isMobile: false
    }
  },
  computed:{
    user(){
      return this.$store.getters.getUser;
    },
    items(){
      if(this.user===null){
        return [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        }, 
        {
          icon: 'mdi-account',
          title: 'Sign Up',
          to: '/signup'
        },
        {
          icon: 'mdi-login',
          title: 'Login',
          to: '/login'
        }
        ]
      }
      else{
        return [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'My Quizzes',
          to: '/quizzes'
        },
        {
          icon: 'mdi-pencil',
          title: 'Create Quiz',
          to: '/create'
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
        }          
        ]
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
  },
  beforeCreate(){
    this.$store.dispatch('setPublicQuizzes');
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 600
    },
    logout(title){
      if(title === 'Logout'){
        this.$router.go();
        this.$store.dispatch('setUser',null);
      }
    },
    goHome(){
      this.$router.push('/');
    }
  },
  created() {
      window.addEventListener('beforeunload', function() {
         this.$router.push('/')
      })
    },
}
</script>
<style scoped>
.z-index{
  width: 100%;
  z-index: 20;
}
</style>