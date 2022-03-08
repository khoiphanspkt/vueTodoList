<template>
  <section class="todoapp container">
    <header class="header">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          autofocus
          id="user-input"
          placeholder="Enter name ..."
          aria-describedby="add-user"
          @keypress.enter="addTodoByEnterKey"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="add-user"
          v-on:click="addTodo"
        >
          Add
        </button>
      </div>
    </header>
    <section class="main">
      <div class="empty" v-show="!todos.length">Empty Item</div>
      <ul class="todo-list">
        <li
          v-for="todo in todos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view d-flex">
            <label
              class="d-flex justify-content-start align-items-center"
              @dblclick="editTodo(todo)"
              >{{ todo.title }}</label
            >
            <div class="btn-group d-flex justify-content-end">
              <button
                class="up btn btn-success"
                @click="btnUpClick(todo)"
                :disabled="todos.indexOf(todo) == 0"
              >
                Up
              </button>
              <button
                class="down btn btn-success"
                @click="btnDownClick(todo)"
                :disabled="
                  todos.length - 1 == todos.indexOf(todo) || todos.length == 1
                "
              >
                Down
              </button>
              <button class="delete btn btn-danger" @click="removeTodo(todo)">
                Delete
              </button>
            </div>
          </div>
          <input
            v-if="todo === editedTodo"
            class="edit"
            type="text"
            v-model="todo.title"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
const STORAGE_KEY = 'todoList'

export default {
  // app initial state
  data: () => ({
    todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    editedTodo: null
  }),

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
      },
      deep: true
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo () {
      const $userInput = document.getElementById('user-input')
      const value = $userInput.value
      this.addItemToList(value)
      $userInput.value = ''
    },

    addItemToList (value) {
      if (!value) {
        return
      }
      this.todos.unshift({
        id: Date.now(),
        title: value
      })
    },

    addTodoByEnterKey (e) {
      const value = e.target.value
      this.addItemToList(value)
      e.target.value = ''
    },

    removeTodo (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    btnUpClick (todo) {
      let from = this.todos.indexOf(todo)
      let to = this.todos.indexOf(todo) - 1
      while (from < 0) {
        from += this.todos.length
      }
      while (to < 0) {
        to += this.todos.length
      }
      if (to >= this.todos.length) {
        return
      }
      this.todos.splice(to, 0, this.todos.splice(from, 1)[0])
    },

    btnDownClick (todo) {
      let from = this.todos.indexOf(todo)
      let to = this.todos.indexOf(todo) + 1
      while (from < 0) {
        from += this.todos.length
      }
      while (to < 0) {
        to += this.todos.length
      }
      if (to < from) {
        to += this.todos.length
      }
      if (to >= this.todos.length) {
        return
      }
      this.todos.splice(to, 0, this.todos.splice(from, 1)[0])
    },

    doneEdit (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    cancelEdit (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    }
  }
}
</script>

<style>
.todoapp {
  padding: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  border: 1px solid #c0c0c0;
  border-radius: 15px;
  width: 100%;
}

.todoapp header {
  width: 100%;
}

.todoapp header .input-group {
  width: 100%;
}

.todoapp header .input-group button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  width: 10%;
}

.todoapp .main {
  margin-top: 15px;
  width: 100%;
  border-top: 1px solid #c0c0c0;
}

.todoapp .main .empty {
  text-align: left;
  width: 100%;
  padding: 20px;
}

.todoapp .main .todo-list {
  list-style: none;
  padding: 0;
}

.todoapp .main .todo-list .todo {
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #c0c0c0;
}

.todoapp .main .todo-list .todo .view {
  width: 100%;
  display: inline-block;
}

.todoapp .main .todo-list .todo.editing {
  width: 100%;
  position: relative;
}

.todoapp .main .todo-list .todo.editing .edit {
  width: 70%;
  display: flex;
  position: absolute;
  top: 15px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.todoapp .main .todo-list .todo.editing .edit:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
  outline: none;
}

.todoapp .main .todo-list .todo .view label {
  margin-bottom: 0;
  width: 80%;
}

.todoapp .main .todo-list .todo .view .btn-group {
  margin-bottom: 0;
}

.todoapp .main .todo-list .todo .view .btn-group button {
  border-radius: 0.25rem !important;
}

.todoapp .main .todo-list .todo .view .btn-group .up {
  margin-right: 10px;
}

.todoapp .main .todo-list .todo .view .btn-group .down {
  margin: 0 10px;
}

.todoapp .main .todo-list .todo .view .btn-group .delete {
  margin-left: 10px;
}
</style>
