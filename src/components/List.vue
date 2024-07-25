<script setup lang="ts">
export type Todo = {
  id: string;
  content: string;
  done: boolean;
};

export type Todos = Map<Todo["id"], Todo>;

type ListProps = {
  todos: Todos;
};

type ListEmits = {
  delete: [id: string];
  complete: [id: string, done: boolean];
};

const props = defineProps<ListProps>();
const emit = defineEmits<ListEmits>();

function deleteTodo(id: string) {
  emit("delete", id);
}

function completeTodo(e: Event, id: string) {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  emit("complete", id, target.checked);
}
</script>

<template>
  <ul>
    <li v-for="(todo, i) in props.todos.values()" :key="todo.id">
      <input
        type="checkbox"
        :checked="todo.done"
        @change="completeTodo($event, todo.id)"
        :data-test="`checkbox-${i}`"
      />
      <span>{{ todo.content }}</span>
      <button @click="deleteTodo(todo.id)" :data-test="`delete-button-${i}`">
        delete
      </button>
    </li>
  </ul>
</template>
