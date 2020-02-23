<template>

<div>
   <HeaderComponent></HeaderComponent> 
   <br><br>
   <b-card id="gameCard" header-tag="header">
       <h2 v-if="headerState ==='lose'" id="lose"
       ><i class="fas fa-heart-broken"></i> LOSS ({{profit}})<i class="fas fa-heart-broken"></i></h2>
       <h2 v-if="headerState ==='stalemate'"
       ><i class="fas fa-redo-alt"></i> NO PAYOFF (+{{profit}}) <i class="fas fa-redo-alt"></i></h2>
       <h2 v-if="headerState =='win'" id="win"
       ><i class="fas fa-trophy"></i> WIN (+{{profit}}) <i class="fas fa-trophy"></i></h2>
       <h2 v-if="headerState =='start'"
       ><i class="fas fa-pencil-alt"></i> You marked {{marked}} of 10 possible! <i class="fas fa-pencil-alt"></i></h2>
       <br>
       <table class="table table-bordered">
            <tbody>
                <tr v-for="i in 8" v-bind:key="i">
                    <td class="align-middle"
                        v-for="j in 8"
                        v-bind:key="j"
                        v-on:click="cellClick(((i-1)*8)+j)"
                        v-bind:class="classObject(((i-1)*8)+j)"
                        >
                        {{((i-1)*8)+j}}
                        </td>
                </tr>
            </tbody>
       </table>
    <b-container class="bv-example-row">
        <b-row><b-col>
            <b-button variant="outline-danger" size="md" id="clear" v-on:click="clear"><i class="fas fa-times"></i> CLEAR</b-button>
            <b-input-group size="md" id="numInput" >
                    <template v-slot:prepend>
                        <b-button variant="warning"
                         @click="decBet"
                         ><i class="fas fa-minus"></i></b-button>
                    </template>
                    <b-form-input id="betInput" readonly v-model="watchBet"></b-form-input>
                    <template v-slot:append>
                        <b-button variant="warning"
                         @click="incBet"
                         ><i class="fas fa-plus"></i></b-button>
                    </template>
            </b-input-group>
            <b-button variant="outline-warning" :disabled="UIblocked" size="md" @click="play">PLAY <i class="fas fa-fire-alt"></i></b-button>
            
        </b-col><b-spinner label="Loading..." v-if="UIblocked"></b-spinner></b-row>
    </b-container>
   </b-card>
</div>
</template>
<style>
  #gameCard {
    position: absolute;
    width: 50%;
    left: 50%;
    top: max(39%,362px);
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 10px rgba(0,0,0,0.19), 0 2px 2px rgba(0,0,0,0.23);
  }
  body{
    background-color: rgb(255,235,227, 0.15)!important;
  }
  .table td {
    text-align: center;
    width:10%;
  }
  .selected{
     background-image: url('~@/assets/crossed3.png');
     background-size: 100%;
  }
  .winSelected{
    background-image: url('~@/assets/crossed12win.png');
    background-size: 100%;
  }
  .lost{
    background-image: url('~@/assets/crossed6lose.png');
    background-size: 100%;
  }
  #numInput{
      width: 10rem!important;
      float: left!important;
      margin-right: 0.7rem;
  }
  #clear{
      float: left!important;
      margin-right: 0.7rem;
  }
  #win{
      color:darkorange;
  }
  #lose{
    color:brown;
  }
  h2{
      text-align: center;
  }
  #betInput{
      text-align: center;
      background-color: white!important;
      box-shadow:none !important;
      border:1px solid #ccc !important;
  }
</style>
<script>
//import crossedImage from "../assets/crossed.png";
import axios from 'axios';
const mimimum = 10;
const maximum = 1000;
const sStep = mimimum;
//const bStep = mimimum*10;
export default {

    data: function () {
        return {
            selectedValues:[],
            winnedValues:[],
            bet:100,
            rButtonDown: false,
            state:'start',
            profitValue:0,
            blocked:false
           // crossed: crossedImage
        }
        
    },
    components: {
        HeaderComponent: () => import('./Header.vue')
    },
    mounted() {
        
    },
    methods:{
        cellClick: function(selected){
            this.winnedValues = [];
            this.state = 'start';
            if(this.selectedValues.includes(selected))
            {
                this.selectedValues = this.selectedValues.filter(function(value){
                    return value != selected;
                });
            }
            else
                if(this.selectedValues.length < 10)
                    this.selectedValues.push(selected)
        },
        clear: function(){
            this.state = 'start';
            this.selectedValues = [];
            this.winnedValues = [];
        },
        incBet:function(){
            this.bet = this.bet + sStep > maximum ? this.bet : this.bet + sStep; 
        },
        decBet:function(){
            this.bet = this.bet - sStep < mimimum ? this.bet : this.bet - sStep; 
        },
        play:function(){
            this.blocked = true;
            axios({
          method: 'put',
          url: this.$store.state.endpoints.baseUrl + "/play/",
          headers: {
              Authorization: `Bearer ${this.$store.state.jwt}`,
              'Content-Type': 'application/json'
          },
          data:{
            bet: this.bet,
            selected: this.selectedValues
          }
        })
        .then((response) => {
          //this.$store.commit('setUserMoney',response.data);
          this.winnedValues = response.data.winNumbers;
          this.profitValue = response.data.win;
          switch(Math.sign(this.profitValue)){
              case -1:
                this.state = 'lose'
                break;
              case 0:
                  
                this.state = 'stalemate'
                break;
              case 1:
                this.state = 'win'
                break; 
              default:
                this.state = 'start'
                break;    
          }
          this.renewBalance();
          console.log(response);
          console.log(this.headerState);
        }) 
        },
        renewBalance: function(){
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
          this.blocked = false;
        }) 
        }
        
    },
    computed: {
        classObject: function () {
            return (num) => {
                if(this.selectedValues.includes(num)&& this.winnedValues.includes(num))
                    return 'winSelected'; 
                if(this.selectedValues.includes(num))
                    return 'selected';
                if(this.winnedValues.includes(num)) 
                    return 'lost';   
                return '';   
            }
        },
        watchBet:function(){
            return this.bet;
        },
        headerState:function(){
            return this.state;
        },
        marked:function(){
            return this.selectedValues.length;
        },
        profit:function(){
            return this.profitValue;
        },
        UIblocked:function(){
            return this.blocked;
        }
    }
}
/*
bigIncBet:function(){
           this.bet = this.bet + bStep > maximum ? this.bet : this.bet + bStep;  
           console.log("handle");
        },
        rmDown(){
            this.rButtonDown = true;
            
           // this.downHandler();
            
        },
        downHandler(){
            
            setTimeout(() => {
                if (this.rButtonDown){
                    this.bigIncBet();
                    this.downHandler();   
                }
            }, 1000)
            
        },
        rmUp(){
            this.rButtonDown = false;
            console.log("up");
        } */
</script>
