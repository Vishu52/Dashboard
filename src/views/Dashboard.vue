<template>
    <div>
      <h1>Dashboard</h1>
      <div v-if="data">
        <ul>
          <li v-for="item in data" :key="item.title">{{ item.title }}: {{ item.intensity }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: null
      };
    },
    created() {
      axios.get('http://127.0.0.1:5000/api/data')
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    }
  };
  </script>
  
  <style>
  /* Add styles specific to the dashboard here */
  </style>
  