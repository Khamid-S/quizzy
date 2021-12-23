<template>
    <div>
        <v-container class="pa-0">
            <v-container class="d-flex align-center justify-center"
            v-if="!titleComplete">
                <v-textarea
                label="Title"
                v-model="title"
                auto-grow
                outlined
                hide-details
                @keydown.enter.prevent="titleSet(true)"
                rows="1"
                row-height="15"
                autofocus
                ></v-textarea>
                <v-btn
                    @click="titleSet(true)"
                    class="mx-2"
                    height="56"
                    >
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-container>

            <v-container class="d-flex align-center justify-space-between
            flex-wrap" v-if="titleComplete">
            <button
            disabled>
                <span class="text--bold">Title:</span> {{title}}
            </button>
            <v-btn min-width="56" min-height="54"
            class="mx-2"
            elevation="1"
            @click="titleSet(false)">
                <v-icon>
                    mdi-pencil
                </v-icon>
            </v-btn>    
            </v-container>
            <Dialog :title="title"/>

            <v-container/>

        </v-container>
    </div>
</template>

<script>
import Dialog from '../components/Dialog.vue'
    
    export default {
        data(){
            return{
                title:'',
                isMobile:false,
                titleComplete: false
            }
        },
        components:{
            Dialog
        },
        computed:{
            user(){
            return this.$store.getters.getUser;
            },
            currentQuiz(){
                return this.$store.getters.getCurrentQuiz;
            }
        },
        beforeDestroy () {
            if (typeof window === 'undefined') return
            window.removeEventListener('resize', this.onResize, { passive: true })
        },
        mounted () {
            this.onResize();
            window.addEventListener('resize', this.onResize, { passive: true });
            if(this.user===null){
              this.$router.push('/');
            }

            if(this.currentQuiz!==null){
                this.title = this.currentQuiz.title;
            }
        },
        methods: {
            onResize () {
            this.isMobile = window.innerWidth < 600
            },
            titleSet(check){
                if(check){
                    if(this.title.length === 0 || !this.title.trim()){
                        this.titleComplete = false
                    }
                    else{
                        this.titleComplete = true;
                    }
                }
                else{
                    this.titleComplete = false;
                }
            }
  },
    }
</script>

<style lang="scss" scoped>

</style>