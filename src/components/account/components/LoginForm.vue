<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          class="form-control"
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          v-model="userData.username"
        >
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          class="form-control"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          v-model="userData.password"
        >
      </div>

      <input type="submit" value="Submit">
    </form>
  </div>
</template>


<script>
  export default {
    props: {
      working: {
        type: Boolean,
        required: true
      },
      onSubmit: {
        type: Function,
        required: true
      },
      userData: {
        type: Object,
        required: true
      }
    }
  };
</script>


<style>
</style>
