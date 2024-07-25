import { mount } from "@vue/test-utils";
import App from "./App.vue";
import { Todo } from "./components/List.vue";

function getItem(): string {
  const todos: Todo[] = [];

  for (let i = 0; i < 5; i++) {
    const todo = {
      id: i.toString(),
      content: `content ${i}`,
      done: i % 2 === 0,
    };
    todos.push(todo);
  }

  return JSON.stringify(todos);
}

afterEach(() => {
  for (const child of document.body.children) {
    child.remove();
  }

  vi.resetAllMocks();
});

test("App is rendered properly", () => {
  const getItemMock = vi.fn().mockImplementation(getItem);
  vi.stubGlobal("localStorage", {
    getItem: getItemMock,
  });

  const wrapper = mount(App);
  const form = wrapper.get("form");
  form.get('input[type="text"]');
  form.get('button[type="submit"]');

  const ul = wrapper.get("ul");
  const lis = ul.findAll("li");
  expect(lis).toHaveLength(5);

  expect(wrapper.find("p").exists()).toBe(false);

  expect(getItemMock).toHaveBeenCalledOnce();
});

test("Don't render the list if empty", () => {
  const wrapper = mount(App);
  expect(wrapper.find("ul").exists()).toBe(false);
  expect(wrapper.get("p").text()).toBe("Empty");
});

test("Can add new todo", async () => {
  const getItemMock = vi.fn().mockImplementation(getItem);
  const setItemMock = vi.fn();
  vi.stubGlobal("localStorage", {
    getItem: getItemMock,
    setItem: setItemMock,
  });

  // to trigger submit via button click
  const div = document.createElement("div");
  document.body.appendChild(div);
  const wrapper = mount(App, { attachTo: div });

  const form = wrapper.get("form");
  await form.get('input[type="text"]').setValue("new todo");
  await form.get('button[type="submit"]').trigger("click");

  const ul = wrapper.get("ul");
  const lis = ul.findAll("li");
  expect(lis).toHaveLength(6);

  expect(setItemMock).toHaveBeenCalledOnce();
});

test("Cannot add empty todo", async () => {
  const getItemMock = vi.fn().mockImplementation(getItem);
  const setItemMock = vi.fn();
  vi.stubGlobal("localStorage", {
    getItem: getItemMock,
    setItem: setItemMock,
  });

  // to trigger submit via button click
  const div = document.createElement("div");
  document.body.appendChild(div);
  const wrapper = mount(App, { attachTo: div });

  const form = wrapper.get("form");
  await form.get('input[type="text"]').setValue("");
  await form.get('button[type="submit"]').trigger("click");

  const ul = wrapper.get("ul");
  const lis = ul.findAll("li");
  expect(lis).toHaveLength(5);

  expect(setItemMock).not.toHaveBeenCalled();
});
