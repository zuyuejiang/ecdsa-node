const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02ebb6119c5b52ff50daa7c7bc76f4d98c01cf10f837463037356326e05141988a": 100, // dan: 15364284c0f9caf7b2500cf90106812dc5cf21bfb3db101d77e6d90c81b41227
  "02f383bde1081dc9a2e9e3b5024fd9ce5049c620cbd1768f614a68c542fd9f051c": 50, // alice: a6e164be28647d024cca01b541fb0655d32581cf77a47fff12d98c10994cdac4
  "02d51ed913ca8ff1b425bcc1842bfb63067efa17712f6e663aa6252e215476b66f": 75, // ben: ad0f93ddbb352ec9c70eb0515a9eaedcd0289996c89a8e869796ad76ec201046
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature
  
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
