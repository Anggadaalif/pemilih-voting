let WALLET_CONNECTED = "";
let contractAddress = "0x9Dcc4FE83a591711fF7A14eA91fdD8c318727797";
let contractAbi =  [
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
      },
      {
        "internalType": "address[]",
        "name": "_whitelistAddresses",
        "type": "address[]"
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
    "name": "getVoters",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
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
    "inputs": [],
    "name": "getWhitelist",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "votersList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
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
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelist",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "whitelistAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const addSonicNetwork = async () => {
  try {
      await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
              chainId: '0x507', // ID Jaringan Sonic dalam format hex
              chainName: 'moonbase-alphanet',
              rpcUrls: ['https://rpc.testnet.moonbeam.network'],
              nativeCurrency: {
                  name: 'Moonbase',
                  symbol: 'DEV', // Simbol token
                  decimals: 18
              },
              blockExplorerUrls: [''] // URL Explorer, jika ada
          }]
      });
      console.log("Jaringan Sonic berhasil ditambahkan!");
  } catch (error) {
      console.error("Gagal menambahkan jaringan Sonic:", error);
  }
};

// Panggil fungsi ini sebelum connectMetamask
addSonicNetwork();

const connectMetamask = async () => {
  await addSonicNetwork();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  document.getElementById("metamasknotification").innerHTML = "Metamask Telah Terhubung : " + WALLET_CONNECTED;
};

const addVote = async (candidateIndex) => {
  const notificationElement = document.getElementById("cand");
  const loadingSpinner = document.getElementById("loading-spinner");

  if (WALLET_CONNECTED) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

    try {
      // Mengecek apakah alamat pemilih ada dalam whitelist
      const isWhitelisted = await contractInstance.whitelist(WALLET_CONNECTED);
      if (!isWhitelisted) {
        notificationElement.innerHTML = `<div class="alert alert-danger">Address Anda tidak terdaftar untuk melakukan Voting !!</div>`;
        return;
      }

      // Mengecek apakah pemilih sudah memberikan suara
      const alreadyVoted = await contractInstance.voters(WALLET_CONNECTED);
      if (alreadyVoted) {
        notificationElement.innerHTML = `<div class="alert alert-warning">Anda sudah melakukan voting!</div>`;
        return;
      }

      // Hapus pesan sebelumnya dan tampilkan spinner loading
      notificationElement.innerHTML = "";
      loadingSpinner.style.display = "block";

      // Ambil semua kandidat untuk mendapatkan nama kandidat berdasarkan index
      const candidates = await contractInstance.getAllVotesOfCandiates();
      const selectedCandidateName = candidates[candidateIndex].name;

      // Melakukan transaksi untuk memberikan suara
      const tx = await contractInstance.vote(candidateIndex);
      await tx.wait();

      // Tampilkan pesan sukses dengan nama kandidat yang dipilih
      notificationElement.innerHTML = `<div class="alert alert-success">Voting berhasil untuk Kandidat: ${selectedCandidateName}! Terima kasih telah berpartisipasi.</div>`;
      getAllCandidates(); // Memperbarui tampilan kandidat setelah voting

    } catch (error) {
      console.error("Error voting:", error);
      notificationElement.innerHTML = `<div class="alert alert-danger">Terjadi kesalahan: ${error.message}</div>`;
    } finally {
      loadingSpinner.style.display = "none";
    }
  } else {
    notificationElement.innerHTML = `<div class="alert alert-warning">Tolong, Hubungkan Metamask Terlebih Dahulu !!</div>`;
  }
};


const getAllCandidates = async () => {
  if (WALLET_CONNECTED) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

    document.getElementById("p3").innerHTML = "Tunggu Sebentar, fetching candidates...";

    const candidates = await contractInstance.getAllVotesOfCandiates();

    const candidatesContainer = document.getElementById("candidates");
    candidatesContainer.innerHTML = ""; 

    candidates.forEach((candidate, i) => {
      const candidateCard = document.createElement('div');
      candidateCard.classList.add('candidate-card'); 

      candidateCard.innerHTML = `
        <img src="assets/${i}.jpg" alt="${candidate.name}" class="candidate-image">
        <h3>${candidate.name}</h3>
        <button class="vote-btn" onclick="addVote(${i})">Vote</button>
      `;

      candidatesContainer.appendChild(candidateCard);
    });

    document.getElementById("p3").innerHTML = "Kandidat Berhasil Ditampilkan!";
  } else {
    document.getElementById("p3").innerHTML = "Tolong Hubungkan Metamask Terlebih Dahulu!";
  }
};



