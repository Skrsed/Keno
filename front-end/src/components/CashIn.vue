<template lang="html">
<div>
  <HeaderComponent></HeaderComponent> 
  <b-card id="walletCard" header-tag="header">
    <template v-slot:header>
          <h3 class="mb-0">CASH IN</h3>
    </template>
    <b-form>
        <b-form-group
          id="input-group-1"
          label-for="input-1"
          :description="'Minimum amount: ' + minVal +'RUB'"
        >
        <b-input-group>
          <template v-slot:prepend>
              <span class="input-group-text"><i class="fas fa-wallet"></i></span>
          </template>
          <b-form-input
            id="input-1"
            v-model="form.amount"
            type="number"
            required
            :min="minVal"
            placeholder="Amount"
          ></b-form-input>
          <b-popover 
           id="popperConent"
           target="input-1" 
           variant="danger"
           placement="bottom"
           ref="popover"
           :disabled ="true"
           :show.sync="showAlert">
              Entered amount is less than the required minimum
          </b-popover>
          <template v-slot:append>
            <b-dropdown :text="dropdown" variant="outline-warning">
                <b-dropdown-item>RUB</b-dropdown-item>
              </b-dropdown>
          </template>
          </b-input-group>
        </b-form-group>    
        <div id="icon-grop">
          <i class="fab fa-cc-visa fa-3x"  v-on:click="pay" ></i>
          <i class="fab fa-cc-paypal fa-3x" v-on:click="pay" ></i>
          <i class="fab fa-cc-mastercard fa-3x" v-on:click="pay"></i>
          <i class="fab fa-bitcoin fa-3x" v-on:click="pay"></i>
          <i class="fab fa-cc-amazon-pay fa-3x" v-on:click="pay"></i> 
        </div>
      </b-form>
  </b-card>
</div>
</template>
<style>
  #walletCard {
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
  .input-group-text {
  border-right: none !important;
  background-color: #ffffff!important;
  color: rgb(255,193,7)!important;
  }
  #input-1{
    border-left: none !important;  
    outline: none;
    box-shadow:none !important;
    border:1px solid #ccc !important;
  }
  #icon-grop i{
    margin-left:10px;
    margin-right:10px;
    transition: .3s;
  }
  #icon-grop i:hover{
    color: rgb(255,193,7)!important;
    transition: .4s;
  }
   #icon-grop{
    text-align: center;
  }
  #popperConent{
    font-size:x-small;
  }
  .popover-body{
    padding: 0.1rem 0.1rem!important;
  }
</style>
<script>
import axios from 'axios'
/*
<!--b-dropdown :text="dropdown" variant="outline-warning">
              <b-dropdown-item>RUB</b-dropdown-item>
            </b-dropdown-->
*/
const minimum = 75;
export default {
  data () {
    return {
      form: {
          amount:'' 
        },
       dropdown: 'RUB',
       minVal: minimum,
       showAlert: false 
    }
  },
  methods: {
    pay () {
      if(this.form.amount >= minimum)
        this.payRequest()
      else
        this.payError()
    },
    payRequest(){
      this.showAlert=false;
      this.$refs.popover.$emit('disable');
      axios({
          method: 'put',
          url: this.$store.state.endpoints.baseUrl + "/increseBalance/",
          headers: {
              Authorization: `Bearer ${this.$store.state.jwt}`,
              'Content-Type': 'application/json'
          },
          data:{
            "increaseBy": this.form.amount
          }
        })
        .then((response) => {
          this.$store.commit('setUserMoney',response.data);
        })
    },
    payError(){
      this.showAlert=true;
      console.log(this.showAlert);
    },

  },
  mounted(){
    this.$refs.popover.$emit('disable');
  },
  components: {
        HeaderComponent: () => import('./Header.vue')
  }
}
</script>