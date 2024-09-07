import { useState } from "react";

let initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, SetShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  function HandleOC() {
    SetShowAddFriend(!showAddFriend);
  }
  function HandleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    SetShowAddFriend(!showAddFriend);
  }

  const [selectedFriend, setSelectedFriend] = useState(null);
  function HandleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={HandleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={HandleAddFriend} />}
        <Button onClick={HandleOC}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [BillValue, setBillValue] = useState();
  const [YourExpenses, setYourExpenses] = useState();
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendExpenses = BillValue - YourExpenses;
  function handleBillSubmit(e) {
    e.preventDefault();
    if (!BillValue || !setWhoIsPaying) return;
    onSplitBill(whoIsPaying === "user" ? friendExpenses : -YourExpenses);
  }
  return (
    <form className="form-split-bill" onSubmit={handleBillSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label> 💸 Bill value :</label>
      <input
        type="text"
        placeholder="Enter bill value"
        value={BillValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label> 🧍 Your expenses </label>
      <input
        type="text"
        placeholder="Enter your expenses"
        value={YourExpenses}
        onChange={(e) =>
          setYourExpenses(
            Number(e.target.value) < BillValue
              ? Number(e.target.value)
              : BillValue
          )
        }
      />

      <label> 🧍‍♂️ {selectedFriend.name}'s expenses</label>
      <input type="number" disabled value={friendExpenses} />

      <label> Who's paying the bill ?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="me">ME</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <> {friend.name} </>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {" "}
          {friend.name} owe you {friend.balance}$
        </p>
      )}
      {friend.balance === 0 && <p>You And {friend.balance} are even !</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) {
      alert("Please fill Name field");
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label> 👥 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label> 🤳 Friend Image</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
