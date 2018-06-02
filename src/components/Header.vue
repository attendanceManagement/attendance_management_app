<template>
  <div>
    <v-dialog v-model="profileDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar card dark color="primary">
          <v-btn icon @click.native="profileDialog = false" dark>
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
          <v-subheader>Profile Info</v-subheader>
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
        </v-list>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
    <header class="l-header-container">
      <v-navigation-drawer fixed  v-model="drawer" app>
        <v-list>
          <v-list-tile @click="goToLink(`/`)">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>         
                <v-list-tile-title>Home</v-list-tile-title>         
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="goToLink(`/leave`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>Leave</v-list-tile-title>             
            </v-list-tile-content>
          </v-list-tile>       

          <v-list-tile v-if="role =='admin'" @click="goToLink(`/approvals`)">
            <v-list-tile-action>
              <v-icon>featured_play_list</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>Approvals </v-list-tile-title>         
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="role =='admin' || role == 'manager'" @click="goToLink(`/teams`)">
            <v-list-tile-action>
              <v-icon>group_work</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>              
                <v-list-tile-title>Teams</v-list-tile-title>            
            </v-list-tile-content>
          </v-list-tile>



            <v-list-tile v-if="role =='admin'" @click="goToLink(`/adminView`)">
              <v-list-tile-action>
                <v-icon>person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>AdminView</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

        </v-list>
      </v-navigation-drawer>

      <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Application</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-menu bottom offset-y>
            <v-btn icon large slot="activator">
              <v-icon>settings</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="profileDialog = true">
                <v-list-tile-title>
                  <v-icon>account_circle</v-icon> Profile</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="submitSignout()">
                <v-list-tile-title>
                  <v-icon>input</v-icon> Log out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>      
      </v-toolbar>     
    </header>
  </div>
</template>


<script>
  import Authentication from '@/components/pages/Authentication'
  import Axios from 'axios'
  import router from '@/router'
  import APIurlConfig from '../apiConfig'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  export default {
    data() {
      return {
        search: '',
        status: '',
        employe: {},
        profileDialog: false,
        drawer: null,
        role: this.$cookie.get('role'),

      }
    },
    mounted() {
      this.getEmpDetails()
    },
    methods: {
      submitSignout() {
        Authentication.signout(this, '/login')
      },
      getEmpDetails(context) {
        Axios.get(`${apiURL}/api/v1/users/admin`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },
          params: {
            _id: this.$cookie.get('id')
          }
        }).then(({
          data
        }) => (
          this.employe = data[0]
        ));
      },
     
      goToLink(url){
        router.push(url)
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

    },
    props: {
      source: String
    }
  }

</script>

<style lang="scss">
  @import "./../assets/styles";

</style>
