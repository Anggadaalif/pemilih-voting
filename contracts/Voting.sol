// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address owner;
    mapping(address => bool) public voters;
    mapping(address => bool) public whitelist;

    address[] public whitelistAddresses; // Menyimpan semua alamat whitelist

    uint256 public votingStart;
    uint256 public votingEnd;
    address[] public votersList; // Array untuk menyimpan alamat pemilih

    constructor(string[] memory _candidateNames, uint256 _durationInMinutes, address[] memory _whitelistAddresses) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        for (uint256 i = 0; i < _whitelistAddresses.length; i++) {
            whitelist[_whitelistAddresses[i]] = true;
            whitelistAddresses.push(_whitelistAddresses[i]); // Menyimpan alamat ke array
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyWhitelisted {
        require(whitelist[msg.sender], "You are not in the whitelist");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
    }

    function vote(uint256 _candidateIndex) public onlyWhitelisted {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
        votersList.push(msg.sender); // Menambahkan alamat pemilih ke dalam array
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoters() public view returns (address[] memory) {
        return votersList; // Mengembalikan daftar alamat pemilih
    }

    // Menambahkan fungsi untuk mendapatkan semua alamat whitelist
    function getWhitelist() public view returns (address[] memory) {
        return whitelistAddresses; // Mengembalikan array alamat whitelist
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }
}
