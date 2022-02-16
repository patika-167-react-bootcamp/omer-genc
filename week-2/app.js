const initialState = {
  users: [],
  transactions: [],
};

// REDUCER
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return addUserAction(state, action);
    case 'MONEY_TRANSFER':
      return moneyTransferAction(state, action);
    default:
      return state;
  }
};

// STORE
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};

const store = createStore(reducer);

store.subscribe(renderUserList);
store.subscribe(renderHisory);
store.subscribe(renderPanelInputs);

const addUser = (form, event) => {
  event.preventDefault();

  // Retrun an array of all the input elements in the form
  const inputs = [...form.querySelectorAll('input')];

  // return {name,balance}
  const value = inputs.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {});

  value.balance = Number(value.balance);
  value.id = id();
  // Add user to the store
  store.dispatch({ type: 'ADD_USER', payload: value });
  form.reset();
};

const moneyTransfer = (form, event) => {
  event.preventDefault();
  const inputs = [...form.querySelectorAll('select')];
  const value = inputs.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {});

  value.balance = Number(form.querySelector('input').value);
  value.id = id();

  store.dispatch({ type: 'MONEY_TRANSFER', payload: value });
};

// DOM
const addUserForm = document.getElementById('add-user-form');
addUserForm.addEventListener('submit', (event) => addUser(addUserForm, event));

const moneyTransferForm = document.getElementById('money-transfer-form');
moneyTransferForm.addEventListener('submit', (event) =>
  moneyTransfer(moneyTransferForm, event)
);

// RENDER
function renderUserList() {
  const { users } = store.getState();
  const html = users.map(
    (user, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${user.userName}</td>
      <td>${user.balance}</td>
    </tr>
    `
  );
  const userList = document.getElementById('user-list');
  userList.innerHTML = html.join('');
}

function renderPanelInputs() {
  const { users } = store.getState();
  const html = users.map(
    (user) => `
    <option value="${user.id}">${user.userName}</option>
    `
  );

  const form = document.getElementById('money-transfer-form');
  const selects = [...form.getElementsByTagName('select')];

  selects.forEach((select) => {
    select.innerHTML = html.join('');
  });
}

function renderHisory() {
  // get the history
  const { transactions } = store.getState();

  // create html
  const html = transactions.map(
    (item) => `
      <tr>
        <td>${item.typeInfo}</td>
        <td>${item.detail}</td>
      </tr>
    `
  );
  const transactionsList = document.getElementById('transactions-list');
  transactionsList.innerHTML = html.join('');
}

function id() {
  // creates a unique ID
  return Math.ceil(Math.random() * 100000 - 1);
}

function addUserAction(state, action) {
  // Destructuring payload
  const { userName, balance } = action.payload;
  // Destructuring state
  const { users, transactions } = state;
  // Add new user to the users array
  users.push(action.payload);
  // Add new transaction to the transactions array
  transactions.push({
    type: 'ADD_USER',
    typeInfo: 'User added',
    detail: `${userName} added with balance ${balance}`,
  });
  // Return new state
  return { transactions, users };
}

function moneyTransferAction(state, action) {
  console.log(action.payload);
  let { balance, receiverID, senderID } = action.payload;
  const { users, transactions } = state;
  const sender = users.find((user) => user.id == senderID);
  const receiver = users.find((user) => user.id == receiverID);

  if (senderID === receiverID) {
    transactions.push({
      type: 'ERROR',
      typeInfo: 'Error / same user',
      detail: `${sender.userName} try to send ${balance} to ${receiver.userName} `,
    });

    return { users, transactions };
  }

  if (sender.balance < balance) {
    transactions.push({
      type: 'ERROR',
      typeInfo: 'Error / insufficient balance',
      detail: `${sender.userName} try to send ${balance} to ${receiver.userName}  `,
    });

    return { users, transactions };
  }

  sender.balance -= balance;
  receiver.balance += balance;

  transactions.push({
    type: 'MONEY_TRANSFER',
    typeInfo: 'Money transfer',
    detail: `${sender.userName} send ${balance} to ${receiver.userName}  `,
  });

  return { users, transactions };
}
