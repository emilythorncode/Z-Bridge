import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const zamaToken = await deploy("ZamaToken", {
    from: deployer,
    log: true,
    args: [],
  });

  const usdcToken = await deploy("USDCTestToken", {
    from: deployer,
    log: true,
    args: [],
  });

  const ethToken = await deploy("ETHTestToken", {
    from: deployer,
    log: true,
    args: [],
  });

  const confidentialZama = await deploy("ConfidentialZamaToken", {
    from: deployer,
    log: true,
    args: [zamaToken.address],
  });

  const confidentialUSDC = await deploy("ConfidentialUSDCToken", {
    from: deployer,
    log: true,
    args: [usdcToken.address],
  });

  const confidentialETH = await deploy("ConfidentialETHToken", {
    from: deployer,
    log: true,
    args: [ethToken.address],
  });

  console.log("Deployed contracts:");
  console.log(` - ZamaToken: ${zamaToken.address}`);
  console.log(` - USDCTestToken: ${usdcToken.address}`);
  console.log(` - ETHTestToken: ${ethToken.address}`);
  console.log(` - ConfidentialZamaToken: ${confidentialZama.address}`);
  console.log(` - ConfidentialUSDCToken: ${confidentialUSDC.address}`);
  console.log(` - ConfidentialETHToken: ${confidentialETH.address}`);
};

export default func;
func.id = "deploy_zama_bridge_tokens";
func.tags = ["ZamaBridge"];
