<template>
  <v-content>
   <v-layout>
      <app-header></app-header>
        <v-container >        
          <app-summary :prop_emp_id="$route.params.id" :prop_emp_no="$route.params.emp_no"></app-summary>
        </v-container>
  <app-footer></app-footer>
</v-layout>
</v-content>
</template>
<script>

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