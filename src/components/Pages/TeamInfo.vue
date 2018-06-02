<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <v-container>
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
          </v-card>
        </v-dialog>  
         <router-link :to="'../teamApproval/'+$route.params.teamId " style="text-decoration: none">
                <v-btn round outline  color="info lighten-1 white--text">
                  <v-icon small left>chrome_reader_mode</v-icon> Leaves Approvals
                </v-btn>
              </router-link>
            <v-data-table :headers="headers" :items="usersList" item-key="name" class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.email }}</td>
                <td class="text-xs-center">
                  <router-link :to="'../attendance/'+props.item._id+'/'+props.item.emp_id " style="text-decoration: none">
                    <v-btn  round outline  color="info lighten-1 white--text">
                      <v-icon small left>chrome_reader_mode</v-icon> Attendance
                    </v-btn>
                  </router-link>
                </td>
                <td class="text-xs-center">
                 <v-btn  v-on:click="editEmploye(props.item)" outline small fab color="indigo">
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
  const apiURL = APIurlConfig.API_URL
  export default {
    data() {
      return {
        validated: 1,
        usersList: [],
        dialog2: false,
        role: this.$cookie.get('role'),
        loginPage: this.$route.params,
           employe: {
          username: '',
          password: '',
          emp_id: '',
          email: '',
          _id: '',
          tel_no: '',
          leaves:{
           privilege:null
          },
          role: 'employe'
        },
        headers: [{
            text: 'Username',
            align: 'left',
            sortable: false,
            value: 'username'
          },
          {
            text: 'Email',
            align: 'center',
            value: 'Action'
          },
          {
            text: 'Action',
            align: 'center',
            value: 'Action'
          },
          {
            text: 'Action2',
            align: 'center',
            value: 'Action'
          }
        ]
      }
    },
    mounted() {
      this.getAllUsers();
    },
    methods: {

 editEmploye(emp) {
        delete emp.password;
        this.dialog2 = true;
        this.employe = emp;
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
      getAllUsers(context) {
        Axios.get(`${apiURL}/api/v1/manage/team/members`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },
          params: {
           team_id:this.$route.params.teamId,
          }
        }).then(({
          data
        }) => (
          this.usersList = data        
        ))
      },

    }
  }

</script>
