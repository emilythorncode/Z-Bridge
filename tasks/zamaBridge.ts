import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { FhevmType } from "@fhevm/hardhat-plugin";

type TokenKey = "zama" | "usdc" | "eth";

const UNDERLYING_CONTRACTS: Record<TokenKey, string> = {
  zama: "ZamaToken",
  usdc: "USDCTestToken",
  eth: "ETHTestToken",
};

const CONFIDENTIAL_CONTRACTS: Record<TokenKey, string> = {
  zama: "ConfidentialZamaToken",
  usdc: "ConfidentialUSDCToken",
  eth: "ConfidentialETHToken",
};

function resolveTokenKey(token: string): TokenKey {
  const key = token.toLowerCase();
  if (key === "zama" || key === "usdc" || key === "eth") {
    return key;
  }

  throw new Error(`Unsupported token ${token}. Use zama, usdc, or eth.`);
}

task("task:bridge-addresses", "Prints all deployed bridge token addresses").setAction(async (_: TaskArguments, hre) => {
  const { deployments } = hre;

  for (const key of Object.keys(UNDERLYING_CONTRACTS) as TokenKey[]) {
    const underlying = await deployments.get(UNDERLYING_CONTRACTS[key]);
    const confidential = await deployments.get(CONFIDENTIAL_CONTRACTS[key]);

    console.log(`${key.toUpperCase()} underlying: ${underlying.address}`);
    console.log(`${key.toUpperCase()} confidential: ${confidential.address}`);
  }
});

task("task:mint-token", "Mints testing ERC20 tokens")
  .addParam("token", "Token key: zama | usdc | eth")
  .addParam("amount", "Amount in whole token units (e.g. 100)")
  .addOptionalParam("to", "Recipient address")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments } = hre;
    const key = resolveTokenKey(taskArguments.token as string);
    const { address } = await deployments.get(UNDERLYING_CONTRACTS[key]);

    const [signer] = await ethers.getSigners();
    const recipient = (taskArguments.to as string | undefined) ?? signer.address;
    const amount = ethers.parseUnits(taskArguments.amount as string, 6);

    const token = await ethers.getContractAt("MintableERC20", address, signer);

    const tx = await token.mint(recipient, amount);
    console.log(`Minting ${taskArguments.amount} ${key.toUpperCase()} to ${recipient}. tx: ${tx.hash}`);
    await tx.wait();
  });

task("task:wrap-token", "Wrap ERC20 tokens into confidential tokens")
  .addParam("token", "Token key: zama | usdc | eth")
  .addParam("amount", "Amount in whole token units (e.g. 50)")
  .addOptionalParam("recipient", "Confidential recipient address")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments } = hre;
    const key = resolveTokenKey(taskArguments.token as string);
    const amount = ethers.parseUnits(taskArguments.amount as string, 6);

    const [signer] = await ethers.getSigners();
    const to = (taskArguments.recipient as string | undefined) ?? signer.address;

    const underlyingDeployment = await deployments.get(UNDERLYING_CONTRACTS[key]);
    const confidentialDeployment = await deployments.get(CONFIDENTIAL_CONTRACTS[key]);

    const underlying = await ethers.getContractAt("MintableERC20", underlyingDeployment.address, signer);
    const confidential = await ethers.getContractAt(CONFIDENTIAL_CONTRACTS[key], confidentialDeployment.address, signer);

    const approvalTx = await underlying.approve(confidentialDeployment.address, amount);
    await approvalTx.wait();

    const wrapTx = await confidential.wrap(to, amount);
    console.log(`Wrapping ${taskArguments.amount} ${key.toUpperCase()} for ${to}. tx: ${wrapTx.hash}`);
    await wrapTx.wait();
  });

task("task:decrypt-conf-balance", "Decrypts a confidential token balance")
  .addParam("token", "Token key: zama | usdc | eth")
  .addOptionalParam("holder", "Address to inspect (defaults to signer)")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const key = resolveTokenKey(taskArguments.token as string);
    const deployment = await deployments.get(CONFIDENTIAL_CONTRACTS[key]);

    const [signer] = await ethers.getSigners();
    const holder = (taskArguments.holder as string | undefined) ?? signer.address;

    const confidential = await ethers.getContractAt(CONFIDENTIAL_CONTRACTS[key], deployment.address);

    const encryptedBalance = await confidential.confidentialBalanceOf(holder);

    if (encryptedBalance === ethers.ZeroHash) {
      console.log(`Encrypted balance for ${holder} is zero.`);
      return;
    }

    const clearBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedBalance,
      deployment.address,
      signer
    );

    console.log(`Encrypted balance: ${encryptedBalance}`);
    console.log(`Decrypted balance: ${clearBalance}`);
  });

task("task:unwrap-token", "Unwrap confidential tokens back to ERC20")
  .addParam("token", "Token key: zama | usdc | eth")
  .addParam("amount", "Amount in whole token units (e.g. 5)")
  .addOptionalParam("from", "Source confidential balance holder")
  .addOptionalParam("recipient", "ERC20 recipient address")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const key = resolveTokenKey(taskArguments.token as string);
    const deployment = await deployments.get(CONFIDENTIAL_CONTRACTS[key]);
    const confidential = await ethers.getContractAt(CONFIDENTIAL_CONTRACTS[key], deployment.address);

    const [signer] = await ethers.getSigners();
    const from = (taskArguments.from as string | undefined) ?? signer.address;
    const recipient = (taskArguments.recipient as string | undefined) ?? signer.address;
    const parsedAmount = ethers.parseUnits(taskArguments.amount as string, 6);

    if (parsedAmount > BigInt("18446744073709551615")) {
      throw new Error("Amount exceeds 64-bit limit for confidential transfer");
    }

    const encryptedInput = await fhevm
      .createEncryptedInput(deployment.address, from)
      .add64(parsedAmount)
      .encrypt();

    const tx = await confidential.unwrap(
      from,
      recipient,
      encryptedInput.handles[0],
      encryptedInput.inputProof
    );

    console.log(`Unwrapping ${taskArguments.amount} ${key.toUpperCase()} to ${recipient}. tx: ${tx.hash}`);
    await tx.wait();
  });
