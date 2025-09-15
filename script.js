const formElement = document.getElementById("main-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount-input");
const transactionList = document.querySelector(".transactions-wrapper");
const totalBalanceDisplay = document.getElementById("balance-display") ; 
const totalIncomeDisplay = document.getElementById("income-value") ; 
const totalExpenseDisplay = document.getElementById("expense-value") ; 

let onLoadTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

const removeTransactions = (listId) => {
    const latestTransactions = onLoadTransactions.filter((element) => element.id !== listId) ; 
     
    localStorage.setItem("transactions", JSON.stringify(latestTransactions)) ; 
    onLoadTransactions = JSON.parse(localStorage.getItem("transactions")) ; 

    updateTransactionsList() ; 
    updateBalanceBox() ; 
}

const currencyFunction = (args) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", 
        currency: "INR", 
    }).format(args) ; 
}

const createTransactionCard = (data) => {
  const newDivElement = document.createElement("div");
  newDivElement.classList.add("card");
  newDivElement.classList.add(data.amount > 0 ? "income" : "expense");

  newDivElement.innerHTML = `
    <span>${data.description}</span>
        <div id="right">
        <p id="amount">${currencyFunction(data.amount)}</p>
        <i class="ri-close-line" id="delete-btn"
        onclick="removeTransactions(${data.id})"></i>
   </div>`;

  return newDivElement;
};

const updateTransactionsList = () => {
  transactionList.innerHTML = "";

  const sortedTransactions = [...onLoadTransactions];

  sortedTransactions.map((value) => {
    const transactionCard = createTransactionCard(value);
    transactionList.appendChild(transactionCard);
  });
};

const updateBalanceBox = () => {
  const totalBalance = onLoadTransactions.reduce(
    (accumulator, objectFromArray) => accumulator + objectFromArray.amount,
    0
  );

  const totalIncome = onLoadTransactions
    .filter((arrayElement) => arrayElement.amount > 0)
    .reduce(
      (accumulator, objectFromArray) => accumulator + objectFromArray.amount,
      0
    );

  const totalExpense = onLoadTransactions
    .filter((arrayElement) => arrayElement.amount < 0)
    .reduce(
      (accumulator, filteredAmount) => accumulator + filteredAmount.amount,
      0
    );

  //Upading The Summary Section Or The UI Here : - 


  totalBalanceDisplay.textContent = currencyFunction(totalBalance) ; 
  totalIncomeDisplay.textContent = currencyFunction(totalIncome) ; 
  totalExpenseDisplay.textContent = currencyFunction(totalExpense) ; 

};


 

const handleForm = (e) => {
  e.preventDefault();

  // taking input from the form .
  let description = descriptionInput.value.trim();
  let amount = parseFloat(amountInput.value);

  onLoadTransactions.splice(0, 0, {
    id: Date.now(),
    amount,
    description,
  });

  localStorage.setItem("transactions", JSON.stringify(onLoadTransactions));

  updateTransactionsList();
  updateBalanceBox();
  formElement.reset();
};

formElement.addEventListener("submit", handleForm);

updateTransactionsList();
updateBalanceBox() ;
