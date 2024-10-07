let WALLET_CONNECTED = "";
let contractAddress = "0x6E244D1C07D6f802Cf5a93679d428b9622FA2Cc5";
let contractAbi = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_candidateNames",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_durationInMinutes",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVotesOfCandiates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRemainingTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVotingStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateIndex",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEnd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingStart",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const connectMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  document.getElementById("metamasknotification").innerHTML = "Metamask is connected: " + WALLET_CONNECTED;
};

const addVote = async (candidateIndex) => {
  if (WALLET_CONNECTED) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      document.getElementById("cand").innerHTML = "Please wait, voting for candidate " + candidateIndex;

      try {
          const tx = await contractInstance.vote(candidateIndex);
          await tx.wait();
          document.getElementById("cand").innerHTML = "Vote added for candidate " + candidateIndex + "!";
          getAllCandidates(); // Update the candidates table after voting
      } catch (error) {
          console.error("Error voting: ", error);
          document.getElementById("cand").innerHTML = "Failed to add vote. Please try again.";
      }
  } else {
      document.getElementById("cand").innerHTML = "Please connect Metamask first.";
  }
};

const getAllCandidates = async () => {
  if (WALLET_CONNECTED) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      document.getElementById("p3").innerHTML = "Please wait, fetching candidates...";

      const candidates = await contractInstance.getAllVotesOfCandiates();

      const tableBody = document.getElementById("myTable").getElementsByTagName('tbody')[0];
      tableBody.innerHTML = ""; // Clear previous rows

      candidates.forEach((candidate, i) => {
          const row = tableBody.insertRow();
          const idCell = row.insertCell(0);
          const nameCell = row.insertCell(1);
          const voteButtonCell = row.insertCell(2);

          idCell.innerHTML = i;
          nameCell.innerHTML = candidate.name;

          const voteButton = document.createElement('button');
          voteButton.classList.add('btn-custom');
          voteButton.innerHTML = "Vote";
          voteButton.onclick = () => addVote(i);
          voteButtonCell.appendChild(voteButton);
      });

      document.getElementById("p3").innerHTML = "Candidates have been updated!";
  } else {
      document.getElementById("p3").innerHTML = "Please connect Metamask first.";
  }
};