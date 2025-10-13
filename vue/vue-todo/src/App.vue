<script setup>
import { ref, computed, watch } from 'vue'
import TodoItem from './components/TodoItem.vue'
import TodoInput from './components/TodoInput.vue'

// state
const todos = ref(JSON.parse(localStorage.getItem('todos') || '[]'))

// add new todo
function addTodo(text) {
  if (text.trim() === '') return
  todos.value.push({ id: Date.now(), text, done: false })
}

// remove a todo
function removeTodo(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}

// toggle done
function toggleTodo(id) {
  const t = todos.value.find(t => t.id === id)
  if (t) t.done = !t.done
}

// persist todos to localStorage
watch(todos, (val) => {
  localStorage.setItem('todos', JSON.stringify(val))
}, { deep: true })

// computed counts
const total = computed(() => todos.value.length)
const completed = computed(() => todos.value.filter(t => t.done).length)
</script>

<template>
  <main class="app">
    <h1>📝 Vue To-Do</h1>

    <TodoInput @add-todo="addTodo" />

    <ul class="list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @remove="removeTodo"
        @toggle="toggleTodo"
      />
    </ul>

    <p v-if="total">✅ {{ completed }}/{{ total }} completed</p>
    <p v-else>No todos yet!</p>
  </main>
</template>

<style scoped>
.app {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
}
.list {
  list-style: none;
  padding: 0;
}
</style>
