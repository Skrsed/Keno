<template>
<div>
  <b-navbar id="nav" toggleable="lg" type="light" variant="faded">
    <b-navbar-brand v-on:click="toGame" style="cursor: pointer;" >KENO</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item right v-on:click="toWallet">
          {{ userMoney }}
          <img :src="coins" width="25">
        </b-nav-item>
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <em>{{ userName }}</em>
          </template>
          <b-dropdown-item v-on:click="toWallet">Cash in</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item v-on:click="logout" >Sign out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>
<style>
#nav{
      padding: 10px 50px 0px 60px;
    }
</style>
<script>
import coinsSrc from "../assets/coins.png";
import axios from 'axios';

export default {
    data: function () {
        return {
            coins: coinsSrc,
        }
    },
    computed: {

      userName: function()
      { 
        return this.$store.state.authUser
      },
      userMoney: function(){
        return this.$store.state.userMoney
      }
     // userMoney: "unknown"
    },
    methods:{
      getMoney: function(){
        axios({
          method: 'get',
          url: this.$store.state.endpoints.baseUrl + "/cash/",
          headers: {
              Authorization: `Bearer ${this.$store.state.jwt}`,
              'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          this.$store.commit('setUserMoney',response.data);
        }) 
     },
     logout: function(){
       this.$store.commit('removeToken');
       this.$store.commit('unsetAuthUser');
       this.$router.push({path: '/signin'})
     },
     toWallet: function(){
       this.$router.push({path:"/cashin"})
     },
     toGame:function(){
       this.$router.push({path:"/"})
     }
    },
    mounted(){
      if(this.$store.state.isAuthenticated){
        this.getMoney();  
      }
      else{
        this.$router.push({name: 'signin'})
      }       
    }
}
</script>