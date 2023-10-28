export default class Board {
  restoreBoardFromLocalStorage() {
    const columnsContainer = document.querySelector(".board");

    const boardState = JSON.parse(localStorage.getItem("boardState"));
    //console.log(boardState);

    if (boardState) {
      columnsContainer.innerHTML = "";

      boardState.forEach((column) => {
        const columnId = column.id;
        const columnTitle = column.title;
        const cards = column.cards;

        const columnTemplate = `
        <div class="column" data-column-id="${columnId}">
          <h2>${columnTitle}</h2>

          <ul class="column-cards">
            ${cards
              .map(
                (card) => `
              <li class="card" draggable="true" data-card-id="${card.id}">
              <button type="button" class="delete-card-button">&#x2715;</button>
                <p class="card-text">${card.content}</p>
              </li>
            `
              )
              .join("")}
          </ul>

          <a class="add-card-link">+ Add another card</a>

          <div class="add-card-section visually-hidden">
            <textarea class="textarea"></textarea>
    
            <button type="button" class="add-card-button">Add Card</button>
            <button type="button" class="cancel-card-button"></button>
          </div>
        </div>
      `;

        columnsContainer.insertAdjacentHTML("beforeend", columnTemplate);
      });
    }
  }
  insertAboveTask(zone, mouseY) {
    const notActualElements = zone.querySelectorAll(".card:not(.is-dragging)");
    //console.log(notActualElements);

    let closestCard = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    notActualElements.forEach((elem) => {
      const { top } = elem.getBoundingClientRect();

      const offset = mouseY - top;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestCard = elem;
      }
    });

    return closestCard;
  }
  updateLocalStorage() {
    const columns = document.querySelectorAll(".column");

    const boardState = [];

    columns.forEach((column) => {
      const columnId = column.dataset.columnId;
      const columnTitle = column.querySelector("h2").textContent.trim();

      const cards = [];

      column.querySelectorAll(".card").forEach((card) => {
        const cardId = card.dataset.cardId;
        const cardContent = card.querySelector("p").textContent.trim();

        cards.push({
          id: cardId,
          content: cardContent,
        });
      });

      boardState.push({
        id: columnId,
        title: columnTitle,
        cards: cards,
      });
    });

    localStorage.setItem("boardState", JSON.stringify(boardState));
  }
}
