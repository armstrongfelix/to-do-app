const dialog = document.getElementById("modal");
const openButton = document.getElementById("open-modal-btn");
const closeButton = document.getElementById("close-modal-btn");

openButton.addEventListener("click", () => {
  dialog.openModa();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});
