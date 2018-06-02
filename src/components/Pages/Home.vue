<template>
  <v-app>
  <v-content>
   <v-layout>
      <app-header></app-header>
        <v-container >     
           <v-list   class="elevation-1 currentAttendance m-1">
             <v-layout row wrap header >
              <v-flex xs3>
                 Date
              </v-flex> 
              <v-flex xs3>
                In Time
              </v-flex>
              <v-flex xs3>
                Out time
              </v-flex>
              <v-flex xs3>
                Hours Worked Today
              </v-flex> 
               </v-layout>   

            <v-layout row  wrap content>
              <v-flex xs3>
                {{currentDate}}
              </v-flex> 

              <v-flex xs3 wrap>
                <div wrap>
                  <p v-if="disableCheckin">{{checkInTime}}</p>                 
                  <v-btn  round  small v-else v-on:click="markAttendance" color="green lighten-1 white--text" :disabled="disableCheckin" ><v-icon left dark>directions_run</v-icon> Check In</v-btn>
                </div>
              </v-flex>

              <v-flex xs3 wrap>
                <div>
                  <p v-if="disableCheckout"> {{checkoutTime}}</p>
                  <v-btn  round small v-else v-on:click="checkout" color="green lighten-1 white--text"  :disabled="disableCheckout" > <v-icon left dark>directions_run</v-icon> Check Out</v-btn>
                </div>
              </v-flex>
              <v-flex xs3>
              {{hourWorked}}
              </v-flex>  
            </v-layout>              
          </v-list>         
       
          <app-summary :prop_emp_id="this.$cookie.get('id')" :prop_emp_no="this.$cookie.get('emp_id')"></app-summary>

        </v-container>
  <app-footer></app-footer>
</v-layout>
</v-content>
  </v-app>
</template>
<script>
import Axios from 'axios'
import moment from 'moment'
import Authentication from '@/components/pages/Authentication'
import APIurlConfig from '../../apiConfig'
const apiURL =  APIurlConfig.API_URL // 'http://localhost:3001'
export default {
  data () {
    return {
      validated : 1,
      loginPage : false, 
      attendances: [],
      disableCheckout:false,
      disableCheckin:false,
      attendance_id :'', 
      currentAttendance: {},
      date: '',
      menu:false,
      currentDate :moment().format('MMMM Do YYYY')
    }
  },
  computed: {
     checkInTime () {
       if(this.currentAttendance)
       return moment(this.currentAttendance.in_time).format('h:mm:ss a');
       return ''
     },
      checkoutTime () {
       if(this.currentAttendance)
       return moment(this.currentAttendance.out_time).format('h:mm:ss a');
       return ''
     },
     hourWorked(){
       if(this.currentAttendance)
        return this.convertMinToHour((moment(this.currentAttendance.out_time).diff(moment(this.currentAttendance.in_time), 'minutes')));
       return '' 
    }
  },
  mounted () {
    this.checkAttendance()
  },
  methods: {
    getAllUsers (context) {
      Axios.get(`${apiURL}/api/v1/attendance`, {
        headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
        }
      }).then(({data}) => (this.attendances = data))
    },
    markAttendance (context) {
      Axios.post(`${apiURL}/api/v1/attendance`, {emp_id: this.$cookie.get('emp_id'),user_id: this.$cookie.get('id')}, {
        headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
        }
      }).then(({data}) => (  this.disableCheckin = true,this.currentAttendance=data.attendance
      ));
    },
    
    convertMinToHour(minutes){
      var hours = Math.floor( minutes / 60);          
      var minutes = minutes % 60;
      return  hours+'.'+minutes
    },


    checkAttendance (context) {
      Axios.get(`${apiURL}/api/v1/attendance/check`, {
        headers: {
        'Authorization': Authentication.getAuthenticationHeader(this)
        },
        params: {
            emp_id: this.$cookie.get('emp_id'),            
        }
      }).then(({data}) => {
         if( data && data.length > 0){
          this.currentAttendance = data[0] ;
          console.log(this.currentAttendance); 
          this.attendance_id = this.currentAttendance._id;
          this.disableCheckin = this.currentAttendance._id ? true : false;
          this.disableCheckout = this.currentAttendance.out_time ? true : false;
         }       
      })
    },

    checkout (context) {
      console.log(this.currentAttendance);
      Axios.put(`${apiURL}/api/v1/attendance/checkout`, {emp_id: this.$cookie.get('emp_id') ,attendance_id : this.currentAttendance._id}, {
        headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
        }
      }).then(({data}) => (this.disableCheckout = true ))
    }

  }
}
</script>

<style lang="scss">
.currentAttendance{
  padding:15px !important; 
  background: white;
}
.header{
 font-weight: bold;
 font-size: 13px;
 border-bottom: 1px solid rgba(0,0,0,.12);
}
.content{
  padding-top: 1rem;
  font-size: 12px;
}
</style>