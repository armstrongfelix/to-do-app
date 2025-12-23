H1E = document.querySelector("h1");
H1E.classList.add("myclass1", "myclass2");
H1E.classList.remove("myclass1");
btn = document.querySelector("#btn");

function openclose() {
  H1E.classList.toggle("openclose");
}
btn.addEventListener("click", openclose);
