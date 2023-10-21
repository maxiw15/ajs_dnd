import getRandomId from "../js/getRandomId";
import updateLocalStorage from "../js/updateLocalStorage";
import restoreBoardFromLocalStorage from "../js/restoreBoardFromLocalStorage";
import insertAboveTask from "./insertAboveTask";

window.onload = function () {
  restoreBoardFromLocalStorage();
};

const columnsContainer = document.querySelector(".board");

columnsContainer.addEventListener("click", (e) => {

  const clickTarget = e.target;



  const column = clickTarget.closest(".column");
  const addCardLink = column.querySelector(".add-card-link");
  const columnCardsList = column.querySelector(".column-cards");
  const addCardSection = column.querySelector(".add-card-section");
  const textarea = column.querySelector(".textarea");
  const addCardButton = column.querySelector(".add-card-button");
  const cancelCardButton = column.querySelector(".cancel-card-button");

  if (clickTarget === addCardLink) {
    addCardSection.classList.remove("visually-hidden");

    addCardButton.addEventListener("click", () => {
      const cardContent = textarea.value.trim();

      if (cardContent) {
        const cardId = getRandomId();
        const cardTemplate = `
            <div class="card" draggable="true" data-card-id="${cardId}">
            <button type="button" class="delete-card-button">&#x2715;</button>
              <p class="card-text">${cardContent}</p>
            </div>
          `;

        columnCardsList.insertAdjacentHTML("beforeend", cardTemplate);

        updateLocalStorage();

        textarea.value = "";
        addCardSection.classList.add("visually-hidden");
      }
    });

    cancelCardButton.addEventListener("click", () => {
      textarea.value = "";
      addCardSection.classList.add("visually-hidden");
    });
  }

  const deleteCardButtons = column.querySelectorAll(".delete-card-button");

  deleteCardButtons.forEach((button) => {
    if (clickTarget === button) {
      const card = button.closest(".card");
      card.remove();

      updateLocalStorage();
    }
  });
});

let actualElement;

// const body = document.querySelector('body');

columnsContainer.addEventListener("dragstart", (e) => {
  actualElement = e.target;

  actualElement.classList.add("is-dragging");

  const droppables = document.querySelectorAll(".column-cards");

  droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();

      const bottomCard = insertAboveTask(zone, e.clientY);
      const curCard = document.querySelector(".is-dragging");

      if (!bottomCard) {
        zone.appendChild(curCard);
      } else {
        zone.insertBefore(curCard, bottomCard);
      }

      updateLocalStorage();
    });
  });
});

columnsContainer.addEventListener("dragend", () => {
  actualElement.classList.remove("is-dragging");
});
