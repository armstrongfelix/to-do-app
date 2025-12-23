const openbtn = document.querySelector("#openbtn");
const closebtn = document.querySelector("#closebtn");
const modal = document.querySelector("#modal");

function open() {
  modal.show();
}
function close() {
  modal.close();
}

openbtn.addEventListener("click", open);
closebtn.addEventListener("click", close);
