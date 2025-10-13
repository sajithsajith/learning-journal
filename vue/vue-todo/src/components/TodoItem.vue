<script setup>
const props = defineProps({
  todo: Object
})
const emit = defineEmits(['remove', 'toggle'])
</script>

<template>
  <li class="todo-item">
    <input type="checkbox" :checked="todo.done" @change="emit('toggle', todo.id)" />
    <span :class="{ done: todo.done }">{{ todo.text }}</span>
    <button @click="emit('remove', todo.id)">❌</button>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.done {
  text-decoration: line-through;
  color: gray;
}
button {
  margin-left: auto;
}
</style>
