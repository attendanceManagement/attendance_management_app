<template>

      <!-- div md8 -->
      <v-container>
        <h3>Admin Approal</h3>
        <v-dialog v-model="viewLeaveDialog" persistent max-width="800px" transition="dialog-bottom-transition">
          <v-card tile>
           <v-toolbar card dark color="primary">
              <v-btn icon @click.native="viewLeaveDialog = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Leaves</v-toolbar-title>
              <v-spacer></v-spacer>             
            </v-toolbar>
            <v-container fluid grid-list-md wrap elevation-3>          
              <v-text-field  label="Start Date"  :value='startDate' prepend-icon="event" readonly></v-text-field>
              <v-text-field  label="End Date" :value="endDate"  prepend-icon="event" readonly></v-text-field>
              <v-flex d-flex xs12>
                <v-text-field label="Reason" prepend-icon="event" :multi-line=true readonly :row-height=5 v-model="currentLeave.desc" :no-resize=true
                rue rows=2></v-text-field>
              </v-flex>
               <v-btn  :loading="loadingLeave"   :disabled="loadingLeave" v-if="!currentLeave.approve_status" round @click="approve(currentLeave._id,currentLeave.emp_no,currentLeave.approve_status,currentLeave)" outline color="primary">Approve</v-btn>
                    <v-chip  v-else color="teal" text-color="white">
                      <v-avatar>
                        <v-icon>check_circle</v-icon>
                      </v-avatar>
                      Approved
                    </v-chip>
            </v-container>
          </v-card>
        </v-dialog>

        <v-progress-linear  v-if="approvalLoading" height="10" style="margin-bottom:0" :indeterminate="true"></v-progress-linear>

        <v-tabs v-model="active" slider-color="yellow">
          <v-tab :key="`Regularize`" ripple>
            Regularize
          </v-tab>

          <v-tab :key="`Leaves`" ripple>
            leave
          </v-tab>


          <v-tab-item :key="`Regularize`">
            <v-data-table :headers="headers" :items="approvalList" :pagination.sync="pagination" item-key="name" class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.emp_no }}</td>
                <td>{{ props.item.username }}</td>
                <td>{{ format(props.item.date) }}</td>
                 <td>{{ props.item.reason }}</td>
                <td class="text-xs-center">               
                   <v-btn   v-if="!props.item.approve_status" v-on:click="markAttendance((props.item.emp_no),(props.item.date),(props.item.checkin), (props.item.checkout),(props.item._id),( props.item.user_id))" round outline color="primary">Approve</v-btn>
                  <v-chip  v-else color="teal" text-color="white">
                      <v-avatar>
                        <v-icon>check_circle</v-icon>
                      </v-avatar>
                      Approved
                    </v-chip>
                </td>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item :key="`Leaves`">
            <v-list two-line>
              <v-subheader>leaves</v-subheader>
              <template v-for="(leave, index) in leaves">
                <v-list-tile :key="leave._id">
                  <v-list-tile-avatar>
                    <span class="white--text headline">{{leave.username.charAt(0).toUpperCase()}}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title> {{leave.username}} </v-list-tile-title>
                    <v-list-tile-sub-title>Leave from {{format(leave.start_date)}} to {{format(leave.end_date)}}</v-list-tile-sub-title>
                    <v-list-tile-sub-title v-html="leave.desc"></v-list-tile-sub-title>
                  </v-list-tile-content>
                  
                  <v-list-tile-action>
                      <v-btn  :loading="loadingLeave"   :disabled="loadingLeave" v-if="!leave.approve_status" round @click="approve(leave._id,leave.emp_no,leave.approve_status,leave)" outline color="primary">Approve</v-btn>
                    <v-chip  v-else color="teal" text-color="white">
                      <v-avatar>
                        <v-icon>check_circle</v-icon>
                      </v-avatar>
                      Approved
                    </v-chip>
                 </v-list-tile-action>
                  <v-list-tile-action>
                    <v-btn outline small fab color="indigo" @click="viewLeaveDetails(leave)">
                      <v-icon>edit</v-icon>
                    </v-btn>                 
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider v-if="index + 1 < leaves.length" :key="index"></v-divider>
              </template>
            </v-list>
          </v-tab-item>

        </v-tabs>

      </v-container>
 
</template>
<script>
  import Axios from 'axios'
  import moment from 'moment'
  import Authentication from '@/components/pages/Authentication'
  import APIurlConfig from '../../apiConfig'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  import DateOnly from 'dateonly'
  export default {
    props: [
            'prop_team_id'
        ],
    data() {
      return {
        approvalList: [],
        loginPage: false,
        viewLeaveDialog: false,
        currentLeave:{},
        loadingLeave:false,
        approvalLoading:false,
        leaveDialog:false,   
        loadingRegularize : false,
        leaves: [],
        active: null,
        pagination: {
          sortBy: 'date'
        },
        headers: [{
            text: 'Emp Id',
            align: 'left',
            sortable: false,
            value: 'username'
          },
             {
            text: 'User Name',
            align: 'left',
            sortable: false,
            value: 'date'
          },
          {
            text: 'Date',
            align: 'left',
            sortable: false,
            value: 'date'
          },
          {
            text: 'Reason',
            align: 'left',
            sortable: false,
            value: 'date'
          },
          {
            text: ' Approvals',
            align: 'center',
            value: 'Action'
          }
        ]
      }
    },
    mounted() {       
      if(this.prop_team_id){
        this.getAllTeamsLeaves()
        this.getAllTeamRegularize()  
      }else{
        this.getAllLeave()
        this.getAllRegularize()   
      }
     
    },
    computed:{
      startDate(){
        var attendanceDate = new DateOnly(this.currentLeave.start_date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      },
      endDate(){
        var attendanceDate = new DateOnly(this.currentLeave.end_date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      }
    },

    methods: {
      formatYear(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      },
      getAllRegularize(context) {
        this.approvalLoading =true,
        Axios.get(`${apiURL}/api/v1/attendance/regularize`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
        this.approvalLoading = false,
        this.approvalList = data          
        ))
      },

   viewLeaveDetails(leave){
   this.currentLeave = leave,
   this.viewLeaveDialog = true
   },
   getAllTeamRegularize(context) {
     this.approvalLoading =true,
        Axios.get(`${apiURL}/api/v1/team/regularize`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },params: {
            team_id: this.prop_team_id
          }
        }).then(({
          data
        }) => (
          this.approvalLoading =false,
          this.approvalList= data
        ))
      },    
  getAllTeamsLeaves(context) {
    this.approvalLoading =true,
    Axios.get(`${apiURL}/api/v1/attendance/leave/team`, {
      headers: {
        'Authorization': Authentication.getAuthenticationHeader(this)
      },params: {
            team_id: this.prop_team_id
          }
    }).then(({
      data
    }) => (
    this.approvalLoading =false,
   this.leaves = data
    ))
  },
       approve(leave_id,emp_no,status,leave) {
         this.loadingLeave = true,
        Axios.post(`${apiURL}/api/v1/attendance/leave/approve`,{'emp_no':emp_no},{
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },params: {
          id: leave_id
          }
        }).then(({
          data
        }) => (
         // this.leaves = data  
        this.loadingLeave = false,      
        this.updateLeavesStatus(leave_id)
        
        ))
      },
      updateLeavesStatus(leave_id){
        console.log(this.leaves);
        const index = this.leaves.findIndex(x => x._id == leave_id);         
         const dummy =  Object.assign({},this.leaves);
         dummy[index].approve_status = true
        //this.leaves=  Object.assign({},dummy);        
      },

      getAllLeave(context) {
        Axios.get(`${apiURL}/api/v1/attendance/leave`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.leaves = data
        ))
      },

      format(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      },
      markAttendance(emp_id, date, inTime, outTime,id,user_id) {
        var attendanceDate = new DateOnly(date);
        const date1 = attendanceDate.toDate();
        this.loadingRegularize = true,
        Axios.post(`${apiURL}/api/v1/attendance`, {
          emp_id: emp_id,
          date: inTime,
          in_time: inTime,
          out_time: outTime,
          regularize_id: id,
          user_id: user_id
        }, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (this.disableCheckin = true, this.loadingRegularize =false, this.currentAttendance = data.attendance));
      },
      format(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      },
      toggleAll() {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      handleUsers() {
        console.log(this.usersList)
      }
    }
  }

</script>
