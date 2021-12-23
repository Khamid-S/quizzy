<template>
    <div>
  <v-form ref="form" v-model="valid"
  lazy-validation>
    <v-card class="ma-4 mx-auto pa-4 d-flex flex-column 
    align-center"
    max-width="600">

        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="show1 ? 'text' : 'password'"
            label="Password"
            v-model="password"
            hint="At least 8 characters"
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>

        <v-btn
        :disabled="!valid"
        :loading="loading"
        @click="validate()"
        >
            Login
        </v-btn>


        <v-alert
        :value="alert"
        color="pink"
        dark
        class="mt-2"
        border="top"
        icon="mdi-home"
        transition="scale-transition">
            {{errorMessage}}
        </v-alert>
    </v-card>   
  </v-form>
    </div>
</template>

<script>
  export default {
    data: () => ({
        alert:false,
        loading:false,
        valid: false,
        errorMessage: '',
        password: '',
        email: '',
        emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
        },
        show1: false,
    }),
    methods:{
        validate(){
            this.$refs.form.validate();
            this.$store.dispatch('login',
            {email:this.email, password:this.password});
            this.$store.dispatch('setRequestTime',true);
            this.loading = true;
        },
    },
    computed:{
        user(){
            return this.$store.getters.getUser;
        },
        requestTime(){
            return this.$store.getters.getRequestTime;
        },
        error(){
            return this.$store.getters.getErrorMessage;
        }
    },
    watch:{
        user(value) {
            if(value !== null && value !== undefined){
                this.$router.push('/');
            }
        },
        requestTime(value){
            if(value){
                this.loading = true;
            }
            else this.loading = false;
        },
        error(value){
            if(value){
                this.alert = true;
                this.errorMessage = value;
            }
            else{
                this.alert = false;
                this.errorMessage = value;
            }
        }
    }
  }
</script>