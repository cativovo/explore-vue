<script setup lang="ts">
import { ref, watch } from "vue";
import List, { Todo, Todos } from "./components/List.vue";

const KEY = "todos";

function getTodos(): Todos {
  const todosJson = localStorage.getItem(KEY);
  const todos: Todos = new Map();

  if (!todosJson) {
    return todos;
  }

  const parsed: Todo[] = JSON.parse(todosJson);

  for (const todo of parsed) {
    todos.set(todo.id, todo);
  }

  return todos;
}

function saveTodos(todos: Todos) {
  const todosArr: Todo[] = [...todos.values()];
  const todoJson = JSON.stringify(todosArr);
  localStorage.setItem(KEY, todoJson);
}

function generateId(): string {
  const min = 1;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min) + min);
  let id = randomNumber.toString();
  return id.padStart(max.toString().length);
}

const todos = ref<Todos>(getTodos());

function handleSubmit(e: Event) {
  if (!(e.target instanceof HTMLFormElement)) {
    return;
  }

  const target = e.target as typeof e.target & {
    content: HTMLInputElement;
  };
  const content: string = target.content.value;
  if (content.trim() === "") {
    return;
  }

  const id = generateId();
  const todo = {
    id,
    content,
    done: false,
  };
  todos.value.set(id, todo);

  e.target.reset();
}

function deleteTodo(id: string) {
  todos.value.delete(id);
}

function completeTodo(id: string, done: boolean) {
  const todo = todos.value.get(id);
  if (!todo) {
    return;
  }

  todo.done = done;
  todos.value.set(id, todo);
}

watch(
  todos,
  () => {
    saveTodos(todos.value);
  },
  { deep: true },
);
</script>

<template>
  <h1>ToDo List</h1>
  <form @submit.prevent="handleSubmit">
    <input type="text" name="content" />
    <button type="submit">submit</button>
  </form>
  <List :todos="todos" @delete="deleteTodo" @complete="completeTodo" />
</template>
