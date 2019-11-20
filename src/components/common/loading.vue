<template>
  <div class="loading">
    <div class="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script type="text/javascript">

  export default {
    data () {
      return {

      }
    },
    methods: {

    }
  }
</script>
<style scoped>
  .loading {
    box-sizing: border-box;
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 25%;
    max-width: 100%;
    height: 100px;
    align-items: center;
    justify-content: center;
  }
  .ball-pulse > div {
    background-color: #108EE9;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
  }
  .ball-pulse > div:nth-child(1) {
    -webkit-animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
  }
  .ball-pulse > div:nth-child(2) {
    -webkit-animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
  }
  .ball-pulse > div:nth-child(3) {
    -webkit-animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
  }
  @-webkit-keyframes scale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; }

    45% {
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
      opacity: 0.7; }

    80% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; } }
  @keyframes scale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; }

    45% {
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
      opacity: 0.7; }

    80% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; } }
</style>
