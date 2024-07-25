import List, { Todos } from "./List.vue";
import { mount } from "@vue/test-utils";

const todos: Todos = new Map();

for (let i = 0; i < 5; i++) {
  const id = i.toString();
  const todo = {
    id,
    content: `content ${i}`,
    done: i % 2 === 0,
  };
  todos.set(id, todo);
}

test("List is rendered properly", () => {
  const wrapper = mount(List, {
    props: {
      todos,
    },
  });

  const ul = wrapper.get("ul");
  const lis = ul.findAll("li");
  expect(lis).toHaveLength(5);

  for (const [i, li] of lis.entries()) {
    expect(li.get("input").element.checked).toBe(i % 2 === 0);
    expect(li.get("span").text()).toBe(`content ${i}`);
    li.get("button");
  }
});

test("List is emitting delete event", () => {
  const wrapper = mount(List, {
    props: {
      todos,
    },
  });

  wrapper.get('[data-test="delete-button-0"]').trigger("click");

  const deleteEvent = wrapper.emitted("delete")!;
  expect(deleteEvent).toHaveLength(1);
  expect(deleteEvent[0]).toEqual(["0"]);
});

test("List is emitting complete event", async () => {
  const wrapper = mount(List, {
    props: {
      todos,
    },
  });

  await wrapper.get('[data-test="checkbox-0"]').trigger("change");
  await wrapper.get('[data-test="checkbox-1"]').trigger("change");

  const completeEvent = wrapper.emitted("complete")!;
  expect(completeEvent).toHaveLength(2);
  expect(completeEvent[0]).toEqual(["0", true]);
  expect(completeEvent[1]).toEqual(["1", false]);
});
