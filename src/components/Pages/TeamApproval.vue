<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <app-approval  :prop_team_id="$route.params.teamId"></app-approval>
      <app-footer></app-footer>
    </v-layout>
  </v-content>
</template>


<script>
  import Authentication from '@/components/pages/Authentication'
  import Axios from 'axios'
  import APIurlConfig from '../../apiConfig'
  const apiURL = APIurlConfig.API_URL
  export default {
    data() {
      return {
        user: {
          username: this.$cookie.get('username'),
          password: '',
          emp_id: ''
        }
      }
    },
    props: {
      source: String
    },
    methods: {


    }
  }

</script>
