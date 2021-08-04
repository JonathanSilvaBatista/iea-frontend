<template>
  <v-app>
    <router-view />
  </v-app>
  
</template>

<script>

export default {
  name: 'App',
  created() {

    this.$store.dispatch('setUser', {})
    this.$store.dispatch('setTermo', null)
  }
};
</script>

<style> 
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

  #app {
    background-color: #ddd;
    font-family: 'Poppins', sans-serif;
  }

  .v-text-field .v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
    box-shadow: none;
  }

  .dx-datagrid .dx-datagrid-headers .dx-header-filter, .dx-datagrid .dx-datagrid-headers .dx-header-row > td {
    background-color: #f2f2f2;
    font-weight: 400px;
    font-size: 108%;
    color: black;
    font-family: 'Poppins', sans-serif;
  }

  .dx-datagrid-borders .dx-datagrid-rowsview, .dx-datagrid-headers + .dx-datagrid-rowsview {
    font-family: 'Poppins', sans-serif;
  }

  .dx-datagrid .dx-row > td {
    vertical-align: middle !important;
  }

  .global-input-date-time-class{
        display: block;
        width: 100%;
        height: calc(1.5em + .75rem + 2px);
        padding: .375rem .75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        text-align: center;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    .theme-green .vdatetime-popup__header,
    .theme-green .vdatetime-calendar__month__day--selected > span > span,
    .theme-green .vdatetime-calendar__month__day--selected:hover > span > span {
        background: #0A5F55;
    }

    .theme-green .vdatetime-year-picker__item--selected,
    .theme-green .vdatetime-time-picker__item--selected,
    .theme-green .vdatetime-popup__actions__button {
        color: #0A5F55;
    }
</style>
