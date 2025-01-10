const { utils } = require("ethers")
const { TAIKO_CONFIG: config } = require("../config/taiko")

async function verifyContract(address, args) {
    if (typeof args === "undefined") {
      args = [];
    }
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: args,
      });
    } catch (e) {
      if (e.message !== "Contract source code already verified") {
        throw e;
      }
      console.log(e.message);
    }
  }

async function main() {
    const d = config.deployedAddress

    await verifyContract(d.UniswapV3Factory);

    await verifyContract(d.SwapRouter, [d.UniswapV3Factory, d.WETH]);

    await verifyContract(d.NFTDescriptor);

    await verifyContract(d.NonfungibleTokenPositionDescriptor, [d.WETH, utils.formatBytes32String("ETH")]);

    await verifyContract(d.NonfungiblePositionManager, [d.UniswapV3Factory, d.WETH, d.NFTDescriptor]);

    await verifyContract(d.V3Migrator, [d.UniswapV3Factory, d.WETH, d.NonfungiblePositionManager]);
}

/*
yarn hardhat run scripts/000_verify_contracts.js --network <NETWORK_NAME>
*/

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });