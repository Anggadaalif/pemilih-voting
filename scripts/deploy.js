async function main() {
  const Voting = await ethers.getContractFactory("Voting");

  // Masukkan alamat whitelist di sini
  const whitelistAddresses = [
    "0xAC3D9e717c323fa309C06bD2Ebeb6ab5E3Bb5C38",
    "0x2c4e81eCe41B88dAddDED21dAdEf683f4b126aB7",
    "0x05dEA7F8E1E9010FD317De7dca4a645Cc35D1eac",
    "0x6ed4c1738fe5b8c99dee90884bb160ec1968d38c",
    "0xf08292532880f627cf1cf78e5bf78315ea1cbf37",
    "0xd80f6db5692c56abf5586a95c5147900f3d9c076",
    "0x4382fd98c508c451f0f21667abb93d9f0bd2b367",
    "0xd396345511f3d1e24f35e001f5c197df309ade01",
    "0xcfa8b579301d206a8a8d4f35959a67a76b3a2ef2",
    "0xbd279ec9f57ff383413b50b681496bf701599ef1",
    "0x28f3474251ee28dc29d609f4a27c7d901ee670a9",
    "0x4e43aa9834c36f9382fa3ee71bdbf8c1c4686b10",
    "0xfb65556e32b7e5ca952117c29721ab09a4f7438f"

  ];

  // Deploy kontrak dengan whitelist
  const Voting_ = await Voting.deploy(
    ["Hermanto", "Udin", "Irta"], // Kandidat
    10, // Durasi voting (dalam menit)
    whitelistAddresses // Address whitelist
  );

  console.log("Contract address:", Voting_.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
