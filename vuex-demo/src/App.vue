<template>
  <div id="app">
    {{$store.state.age}}
    <button @click="change">aaa</button>
    <button @click="change1">bbb</button>
   a: {{$store.state.a.age}}
    b:{{$store.state.a.b.age}}

    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
export default {
  name: "App",

  created() {
    console.log("t", this);
  },
  methods: {
    change() {
      this.$store.commit("synChange", 10);
    },
    change1() {
      this.$store.dispatch("asynChange", 101);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
