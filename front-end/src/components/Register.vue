<template lang="html">
<b-card id="registerCard" header-tag="header">
  <template v-slot:header>
        <h3 class="mb-0">Sign up</h3>
  </template>
  <b-form>
    <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
        description="What should we call you?"
      >
    <b-form-input
        id="input-1"
        v-model="form.username"
        type="text"
        required
        placeholder="Enter your username"
      ></b-form-input>
    </b-form-group>
      <b-form-group
        id="input-group-1"
        label="Email:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>
      
        <b-alert show variant="danger" v-show="errors">{{alert}}</b-alert>
        <b-button id="submitButton" type="reset" variant="outline-warning" v-on:click="register">SIGN UP</b-button>
        <span id="formText"><br><br>Already have an account? <b-link :to="{ path: 'signin' }">Sign in!</b-link></span>
      
    </b-form>
</b-card>
</template>
<style>
  #registerCard {
    position: absolute;
    width: 50%;
    left: 50%;
    top: 39%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 10px rgba(0,0,0,0.19), 0 2px 2px rgba(0,0,0,0.23);
  }
  #submitButton{
    width: 39%;
  }
  body{
    background-color: rgb(255,235,227, 0.15)!important;
  }
  #formText{
    float:right;
  }
</style>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
          email: '',
          password: '',
          username:'',
        },
      errors: false,
      alert:""
    }
  },
  methods: {
    register () {
      this.errors = false;
      const payload = {
        name: this.form.username,
        email: this.form.email,
        password: this.form.password
      }
      console.log(payload);
      axios.post(this.$store.state.endpoints.baseUrl + '/auth/register/', payload)
        .then((response) => {
          this.$store.commit('updateToken', response.data.token)
          // get and set auth user
          
          const base = {
            baseURL: this.$store.state.endpoints.baseUrl,
            headers: {
              Authorization: `Bearer ${this.$store.state.jwt}`,
              'Content-Type': 'application/json'
            }
          }
          console.log(base);
          // Even though the authentication returned a user object that can be
          // decoded, we fetch it again. This way we aren't super dependant on
          // JWT and can plug in something else.
          const axiosInstance = axios.create(base)
          axiosInstance({
            url: "/auth/user/",
            method: "get",
            params: {},
          })
            .then((response) => {
              this.$store.commit("setAuthUser",
                {authUser: response.data, isAuthenticated: true}
              )
              this.$router.push({path: '/'})
            })

        })
        .catch((error) => {
          
          console.log(error.response.data); 
          
          this.alert = error.response.data;
          this.errors = true;
          //console.debug(error);
         // console.dir(error);
        })
    }
  }
}
</script>