<script setup>
import { ref } from 'vue'

const text = ref('')
const emit = defineEmits(['add-todo'])

function submit() {
  if (!text.value.trim()) return
  emit('add-todo', text.value)
  text.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="todo-input">
    <input v-model="text" placeholder="Add a new todo" />
    <button type="submit">➕</button>
  </form>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
input {
  flex: 1;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>
