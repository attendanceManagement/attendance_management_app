<template>
  <v-app>
    <v-content>
      <v-layout>
        <app-header></app-header>
        <!-- div md8 -->
        <v-container>

          <v-dialog v-model="leaveDialog" persistent max-width="800px" transition="dialog-bottom-transition">
            <v-card tile>
              <v-toolbar card dark color="primary">
                <v-btn icon @click.native="leaveDialog = false" dark>
                  <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Leaves</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn v-if="  leave._id" dark flat @click.native="updateLeave()">Save</v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-container fluid grid-list-md wrap elevation-3>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm5 md5>
                      <v-menu ref="startDateMenu" lazy :close-on-content-click="false" v-model="startDateMenu" transition="scale-transition" offset-y
                        full-width :nudge-right="40" min-width="290px" :return-value.sync="leave.startDate">
                        <v-text-field slot="activator" label="Start Date" v-model="leave.startDate" prepend-icon="event" readonly></v-text-field>
                        <v-date-picker v-model="leave.startDate" @input="$refs.startDateMenu.save(leave.startDate)"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex d-flex xs12 sm5 md5>
                      <v-menu ref="endDateMenu" lazy :close-on-content-click="false" v-model="endDateMenu" transition="scale-transition" offset-y
                        full-width :nudge-right="40" min-width="290px" :return-value.sync="endDate">
                        <v-text-field slot="activator" label="End Date" v-model="leave.endDate" :rules="endDateRule" prepend-icon="event" readonly></v-text-field>
                        <v-date-picker v-model="leave.endDate" @input="$refs.endDateMenu.save(leave.endDate)"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    </v-menu>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex d-flex xs12>
                      <v-text-field label="Reason" prepend-icon="event" :multi-line=true  :row-height=5 v-model="leave.desc" :no-resize=true
                        rue rows=2></v-text-field>
                    </v-flex>
                    <v-flex d-flex xs12 sm6 md5>
                      <div class="text-xs-center">
                        <v-chip color="teal" text-color="white">
                          <v-avatar class="teal darken-4">{{leavesAvailable}} </v-avatar>
                          Leaves Available
                        </v-chip>
                      </div>
                      <div class="text-xs-center">
                        <v-chip color="teal" text-color="white">
                          <v-avatar class="teal darken-4">{{sickLeave}} </v-avatar>
                          Sick Leaves Available
                        </v-chip>
                      </div>

                    </v-flex>
                  </v-layout>

                  <v-btn v-if="!leave._id" round v-on:click="applyLeave" color="green lighten-1 white--text" :disabled="!valid">
                    <v-icon left dark>directions_run</v-icon> Apply</v-btn>
                </v-container>
              </v-form>
            </v-card>
          </v-dialog>

          <v-btn color="primary" @click.native="addLeave()" fab dark>
            <v-icon dark>add_circle</v-icon>
          </v-btn>

          <v-progress-linear v-if="dataLoading" height="8" style="margin-bottom:0" :indeterminate="true"></v-progress-linear>

          <v-list two-line wrap class='elevation-3'>
            <v-subheader>leaves</v-subheader>
            <template v-for="(leave, index) in leaves">
              <v-list-tile :key="leave._id">
                <v-list-tile-avatar class="color">
                  <span class="white--text headline">{{leave.username.charAt(0).toUpperCase()}}</span>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title> {{leave.username}} </v-list-tile-title>
                  <v-list-tile-sub-title>Leave from {{format(leave.start_date)}} to {{format(leave.end_date)}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title v-html="leave.desc"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-chip v-if="leave.approve_status" color="teal" text-color="white">
                  <v-avatar>
                    <v-icon>check_circle</v-icon>
                  </v-avatar>
                  Approved
                </v-chip>
                <v-chip v-else color="info" text-color="white">
                  <v-avatar>
                    <v-icon>hourglass_empty</v-icon>
                  </v-avatar>
                  Pending
                </v-chip>
                <v-list-tile-action v-if="!leave.approve_status">
                  <v-btn @click="edit(leave)" outline small fab color="indigo">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < leaves.length" :key="index"></v-divider>
            </template>
          </v-list>


          <v-snackbar :top=true :timeout="999" :color="color" v-model="snackbar">
            {{message}}
          </v-snackbar>
        </v-container>
        <!--/div -->
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
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  import DateOnly from 'dateonly'
  export default {
    data() {
      return {
        valid: false,
        leaveDialog: false,
        snackbar: true,
        dataLoading: false,
        leaves: [],
        message: '',
        color: "success",
        empId: this.$cookie.get('id'),
        startDateMenu: false,
        date: moment().format('YYYY-MM-DD'),
        leave: {
          emp_id: this.$cookie.get('id'),
        },
        endDateMenu: false,
        endDate: null,
        loginPage: false,
        leavesAvailable: 0,
        sickLeave: 0,
        endDateRule: [
          v => !!v || 'date is required',
          v => (v && moment(this.leave.endDate).isSameOrAfter(moment(this.leave.startDate))) ||
          'End Date must be greater than Start Date',
          v => (v && this.verifyEndDate()) || 'no leavs availabe'

        ],
        pagination: {
          sortBy: 'date'
        },
        headers: [{
            text: 'Username',
            align: 'left',
            sortable: false,
            value: 'username'
          },
          {
            text: 'Date',
            align: 'left',
            sortable: false,
            value: 'date'
          },
          {
            text: 'Action',
            align: 'center',
            value: 'Action'
          }
        ]
      }
    },
    mounted() {
      this.getAllLeave(),
        this.getEmpDetails()
    },
    methods: {
      addLeave() {
        this.leave = {
          emp_id: this.$cookie.get('id')
        };
        this.leaveDialog = true;
      },
      edit(leave) {
        leave.startDate = this.formatYear(leave.start_date)
        leave.endDate = this.formatYear(leave.end_date)
        this.leave = leave;
        this.leaveDialog = true;
      },
      getAllLeave(context) {
        this.dataLoading = true,
          Axios.get(`${apiURL}/api/v1/attendance/leave`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            },
            params: {
              emp_id: this.empId
            }
          }).then(({
            data
          }) => (
            this.dataLoading = false,
            this.leaves = data
          ))
      },

      verifyEndDate() {
        const days = moment(this.leave.endDate).diff(moment(this.leave.startDate), 'days') + 1;
        console.log(this.sickleave)
        console.log(this.leavesAvailable == 0 && days <= this.sickLeave)
        return days <= this.leavesAvailable || (this.leavesAvailable == 0 && days <= this.sickLeave);
      },


      getEmpDetails(context) {
        Axios.get(`${apiURL}/api/v1/users/admin`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },
          params: {
            _id: this.empId
          }
        }).then(({
          data
        }) => (
          this.leavesAvailable = data[0].leaves.privilege,
          this.sickLeave = data[0].leaves.sick
        ));
      },

      formatYear(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      },

      updateLeave() {
        Axios.put(`${apiURL}/api/v1/attendance/leave`, this.leave, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.disableCheckin = true,
          this.currentAttendance = data.attendance,
          this.snackbar = true,
          this.color = 'succes',
          this.message = "Appplied Leave succesfully"
        )).catch(({response: {data}}) => {
          this.snackbar = true
          this.color = 'error'
          this.message = "Sorry could not update"
        });
      },

      applyLeave() {
        Axios.post(`${apiURL}/api/v1/attendance/leave`, this.leave, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.disableCheckin = true,
          this.leaves.push(data.leave),
          this.currentAttendance = data.attendance,
          this.snackbar = true,
          this.color = 'succes',
          this.message = "Appplied Leave succesfully"
        )).catch(({response: {data}}) => {
          this.snackbar = true
          this.color = 'error'
          this.message = data.message
        })
      },
      format(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('MMMM Do YYYY');
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
<style>
  .color .avatar {
    background-color: #009688 !important;
    border-color: #009688 !important;
  }

</style>
