import type { Name } from "./types.js";

function addName(name: string): void {
  const nameTrim: string = name.trim();
  if (nameTrim === "") {
    throw new Error("Имя не может быть пустым!");
  }
  if (names.some((elem) => elem.name === nameTrim)) {
    throw new Error("Такое имя уже есть");
  }
  const newName: Name = {
    name: nameTrim,
  };
  names.push(newName);
  save("names", names);

  renderLine(nameTrim);
}

function save(variable: string, value: unknown): void {
  const parsedValue = JSON.stringify(value);
  localStorage.setItem(variable, parsedValue);
}

function deleteName(name: string): void {
  const idx: number = names.findIndex((elem) => elem.name === name);
  if (idx === -1) {
    throw new Error("Имя не найдено при удалении!");
  }
  names.splice(idx, 1);
  save("names", names);

  deleteLine(`delete-${name}`);
}

// --- Рендер ---

const names: Name[] = JSON.parse(localStorage.getItem("names") ?? "[]");

const addNameInputNode = document.querySelector("input") as HTMLInputElement;
const addBtnNode = document.querySelector("#add-btn") as HTMLButtonElement;
addBtnNode?.addEventListener("click", () => {
  addName(addNameInputNode?.value);
});
const namesTableNode = document.querySelector(".names-table") as HTMLElement;
names.forEach((name) => {
  renderLine(name.name);
});

function renderLine(name: string): void {
  const div = document.createElement("div") as HTMLDivElement;
  div.classList.add("names-line");
  const span = document.createElement("span") as HTMLSpanElement;
  span.textContent = name;
  div.appendChild(span);
  const btn = document.createElement("button") as HTMLButtonElement;
  btn.textContent = "✕";
  btn.id = `delete-${name}`;
  btn.addEventListener("click", () => {
    deleteName(name);
  });
  div.appendChild(btn);
  namesTableNode.appendChild(div);
}

function deleteLine(delId: string) {
  const childElement = document.getElementById(delId);
  if (childElement && childElement.closest("div")) {
    childElement.closest("div")!.remove();
  }
}
