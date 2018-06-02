<template>
  <v-content>
    <v-layout>
      <app-header></app-header>       
      <v-container>        
        <h3>Users</h3>
        <v-dialog v-model="dialog2" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable>
          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="dialog2 = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Employe</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat v-if="!employe._id" @click.native="save()">Save</v-btn>
                <v-btn dark flat v-if="employe._id" @click.native="update()">Update</v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <v-list three-line subheader>
              <v-subheader>User Controls</v-subheader>

              <v-divider></v-divider>
              <v-list-tile avatar>
                <v-list-tile-content>               
                  <v-text-field prepend-icon="person" label="Employe Name " v-model="employe.name"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="person_outline" label="Employe Username " v-model="employe.username"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field :disabled="!!employe._id" prepend-icon="person_outline" label="Employe Id " v-model="employe.emp_id"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field   prepend-icon="mail" label="Employe Email " v-model="employe.email"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="phone" label="contact No " v-model="employe.tel_no" required></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="star" label="New Password" v-model="employe.password" required></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="weekend" label="leaves" v-model="employe.leaves.privilege" required></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
                  <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="weekend" label="Sick leaves" v-model="employe.leaves.sick" required></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>                
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-subheader>Role</v-subheader>

              <v-radio-group v-model="employe.role">
                <v-list-tile avatar>
                  <v-list-tile-action>
                    <v-radio name='emp' :value="`employe`"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content for="emp">
                    <v-list-tile-title>Employe</v-list-tile-title>
                    <v-list-tile-sub-title>Can add there attendance and apply leave</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>

                <div v-if="role =='admin'">
                  <v-list-tile avatar>
                    <v-list-tile-action>
                      <v-radio :value="`manager`"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Manager</v-list-tile-title>
                      <v-list-tile-sub-title>Has ability to manage the team </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile avatar>
                    <v-list-tile-action>
                      <v-radio :value="`admin`"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Admin</v-list-tile-title>
                      <v-list-tile-sub-title>Can add Manager</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </div>
              </v-radio-group>
            </v-list>
            <v-list  v-if="employe._id" three-line subheader>
            <v-subheader>Activation</v-subheader>      
            <v-list-tile avatar >
              <v-list-tile-action>
                <v-checkbox               
                v-model="employe.activated.active"
                ></v-checkbox>
              </v-list-tile-action>  
            <v-list-tile-content>
              <v-list-tile-title>Active User</v-list-tile-title>
              <v-list-tile-sub-title> </v-list-tile-sub-title>
            </v-list-tile-content>            
            </v-list-tile>            
            </v-list>         
          </v-card>
        </v-dialog>        
        <v-btn color="primary" fab dark @click="create()">
          <v-icon dark>group_add</v-icon>
        </v-btn>

          <v-card>
            <v-container fluid grid-list-lg>
                <v-layout row>
                    <v-flex xs6>
                        <div>
                            <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="date">
                                <v-text-field slot="activator" label="Picker in menu" v-model="date" prepend-icon="event" readonly></v-text-field>
                                <v-date-picker v-model="date" type='month' no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </div>
                    </v-flex>
                    <v-flex xs6>
                        
                        <v-btn round outline color="green" v-on:click="getAllAttendance()" >Export</v-btn>
                          <a id="download" style="display: none">test</a>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
        
        <v-progress-linear v-if="tableLoading" style="margin-bottom:0" :indeterminate="true"></v-progress-linear>
        <v-data-table :headers="headers" :items="usersList" :pagination.sync="pagination" item-key="name" class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.role.toUpperCase() }}</td>
            <td class="text-xs-center">
              <router-link :to="'attendance/'+props.item._id+'/'+props.item.emp_id " style="text-decoration: none">
                <v-btn  fab outline  color="indigo lighten-1 white--text">
                  <v-icon>content_paste</v-icon>
                </v-btn>
              </router-link>
            </td>
            <td class="text-xs-center">       
                <v-btn  v-on:click="editEmploye(props.item)" outline  fab color="indigo">
                  <v-icon>edit</v-icon>
                </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-container>
      <app-footer></app-footer>
    </v-layout>
  </v-content>
  
</template>
<script>
  import Axios from 'axios'
  import moment from 'moment'
  import Authentication from '@/components/pages/Authentication'
  import APIurlConfig from '../../apiConfig'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  const dailyDuration = 8
  import DateOnly from 'dateonly'
  export default {
    data() {
      return {
        validated: 0,
        usersList: [],
        loginPage: false,
        tableLoading:false,
        date: moment().format('YYYY-MM'),
        menu: false,
        dialog2: false,
        role: this.$cookie.get('role'),
        employe: {
          username: '',
          password: '',
          emp_id: '',
          email: '',
          _id: '',
          tel_no: '',
          leaves: {
           privilege : null
          },
          role: 'employe'
        },
        defaultSate: this.employe,
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
            text: 'Email',
            align: 'left',
            value: 'Action'
          },
            {
            text: 'Role',
            align: 'left',
            value: 'Role'
          },
          {
            text: 'Attendance',
            align: 'center',
            value: 'Action',
            sortable: false,
          },
          {
            text: 'Edit',
            align: 'center',
            value: 'Action',
            sortable: false,
          }
        ]
      }
    },
    mounted() {
      this.getAllUsers(),
      this.getAllRegularize()  
    },
    methods: {
      getAllUsers(context) {
        this.tableLoading=true;
        Axios.get(`${apiURL}/api/v1/users/admin`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.usersList = data,
          this.tableLoading=false,
          this.handleUsers()
        ))
      },

       getAllAttendance(context) {
        Axios.get(`${apiURL}/api/v1/attendance/employe/all`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },
          params: {           
            month: this.date
          }
        }).then(({
          data
        }) => {
            // this.attendanceList = data,
            // console.log(this.attendanceList),
            // this.changeDateFormat(),
            

             var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
        tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
        tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
        tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
        tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
        tab_text = tab_text + "<table border='1px'>";
        tab_text = tab_text + '<tr><td><h1>Time Sheet for month '+ moment(new Date(this.date)).format('MMM YYYY')+'</h1></td></tr>';
        

        //get table HTML code
        for (var k = 0; k < data.length; k++) {
          const user  =data[k].user;
          var attendanceData = this.calculateForMonth(data[k].attendance,data[k].user);
          console.log(attendanceData)
          var attendanceList = attendanceData.attendanceList,
          tab_text = tab_text + '<tr><td><b>Name</b></td> <td>'+user.name+'</td>  <td><b>Emp ID</b></td> <td>'+user.emp_id+'</td></tr>';
          tab_text = tab_text + '<tr><td> <b>Date</b></td><td><b>In Time</b></td><td><b>Out Time</b></td> <td><b>Status</b></td> <td><b>Hours Worked</b></td></tr>';
          
          for (var i = 0; i < attendanceList.length; i++) {
            console.log('*********************************************attendanceList[i].in_time')
            console.log(attendanceList[i].in_time)
         
            tab_text = tab_text + '<td>' + attendanceList[i].date.format('DD-MM-YYYY') + '</td>';
            tab_text = tab_text + '<td>' + this.formatDate(attendanceList[i].in_time) + '</td>';
            tab_text = tab_text + '<td>' + this.formatDate(attendanceList[i].out_time) + '</td>';
            tab_text = tab_text + '<td>' + attendanceList[i].status + '</td>';
            tab_text = tab_text + '<td>' + attendanceList[i].duration + '</td> </tr>';     
          }
           tab_text = tab_text + '<tr><td><b>Total Hour:</b></td> <td>'+attendanceData.totalHours+'</td> <td><b>Total Leaves</b></td> <td>'+ attendanceData.leaveCount+'</td></tr>';
           tab_text = tab_text + '<tr><td></td></tr>';
        }
        tab_text = tab_text + '</table></body></html>';
        console.log(tab_text);
        var data_type = 'data:application/vnd.ms-excel';


        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        //For IE
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
          if (window.navigator.msSaveBlob) {
            var blob = new Blob([tab_text], {
              type: "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'report.xls');
          }
        }
        //for Chrome and Firefox 
        else {
          document.querySelector("#download").setAttribute('href', data_type + ', ' + encodeURIComponent(tab_text));
          document.querySelector("#download").setAttribute('download', 'Report.xls');
          document.getElementById("download").click();
        }   
            console.log(this.attendanceList)
           
          }      
        )
      },

      convertMinToHour(minutes){
        var hours = Math.floor( minutes / 60);          
        var minutes = minutes % 60;
        return  hours+'.'+minutes
      },

      formatDate(date){
       if(date instanceof moment){         
         return date.format('h:mm:ss a');
       }else{
         return 'NA'
       }
      },
      

      calculateForMonth(attendanceList, user) {
        console.log(user)
        var ar = [];
        var leaveCount = 0;
        var totalHours = 0;

        console.log(attendanceList);
        var start = moment(this.date, "YYYY-MM");
        for (var end = moment(start).add(1, 'month'); start.isBefore(end); start.add(1, 'day')) {
          let contains = false;
          for (let i = 0; i < attendanceList.length; i++) {
            const element = attendanceList[i];
           
            var attendanceDate = new DateOnly(element.date);
            element.date = moment(attendanceDate.toDate());
            if (start.isSame(moment(element.date).format('YYYY-MM-DD'), 'day')) {
              //start

              element.date = moment(attendanceDate.toDate());
            element.in_time = moment(element.in_time);
            if (element.out_time) {
              element.out_time = moment(element.out_time)
              console.log(element.in_time);
               console.log(element.out_time);
              element.duration = this.convertMinToHour(element.out_time.diff(element.in_time, 'minutes'));
              //element.out_time = element.out_time.format('h:mm:ss a');
            } else {
              element.out_time = 0;
              element.duration = dailyDuration;             
            }
             totalHours = totalHours + parseFloat(element.duration);
             //element.in_time = element.in_time.format('h:mm:ss a');
            //end

              if (element.leave_status == 'leave') {
                element.status = 'On Leave';
                element.in_time = 'Na'
                element.duration = 'Na'
                element.class = 'leave'
                leaveCount = leaveCount + 1;
              } else {
                element.status = 'present';
                element.date = element.date;
              }
              element.emp_no = user.emp_id,
                ar.push(element);
              contains = true;
              break;
            }
          }
          if (contains == false) {
            ar.push({
              "date": moment(start),
              "in_time": "Na",
              "emp_id": user.emp_id,
              "emp_no": user.emp_id,
              "out_time": "Na",
              "duration": 0,
              "status": "absent"
            });
          }
        }
        return { attendanceList:ar, totalHours:totalHours, leaveCount };
      },

      getAllRegularize(context) {
        Axios.get(`${apiURL}/api/v1/attendance/regularize`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          console.log(data)
        ))
      },

      create() {
        this.dialog2 = true;
        this.employe = {
          username: '',
          password: '',
          emp_id: '',
          email: '',
          _id: '',
          tel_no: '',
          role: 'employe',
          leaves: {
           privilege : null
          },
        };
      },

      editEmploye(emp) {
        delete emp.password;
        this.dialog2 = true;
        this.employe = emp;
      },
      
      save() {
        Axios.post(`${apiURL}/api/v1/signup`, this.employe)
          .then(({
            data: {
              token
            }
          }) => {
            this.getAllUsers();
          }).catch(({
            response: {
              data
            }
          }) => {})
      },

      update(context) {
        Axios.put(`${apiURL}/api/v1/user`, this.employe, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (console.log(data)))
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
