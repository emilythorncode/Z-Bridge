import { expect } from "chai";
import { ethers, deployments, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import {
  ConfidentialETHToken,
  ConfidentialUSDCToken,
  ConfidentialZamaToken,
  MintableERC20,
} from "../types";

const decryptionOracleInterface = new ethers.Interface([
  "event DecryptionRequest(uint256 indexed counter,uint256 requestID,bytes32[] cts,address contractCaller,bytes4 callbackSelector)",
]);

describe("ZamaBridge tokens", function () {
  let zamaToken: MintableERC20;
  let zamaConfidential: ConfidentialZamaToken;
  let usdcToken: MintableERC20;
  let usdcConfidential: ConfidentialUSDCToken;
  let ethToken: MintableERC20;
  let ethConfidential: ConfidentialETHToken;
  let deployer: any;
  let alice: any;
  let bob: any;

  beforeEach(async function () {
    await deployments.fixture(["ZamaBridge"]);
    await fhevm.initializeCLIApi();
    [deployer, alice, bob] = await ethers.getSigners();

    const zamaTokenDeployment = await deployments.get("ZamaToken");
    const zamaConfidentialDeployment = await deployments.get("ConfidentialZamaToken");
    const usdcTokenDeployment = await deployments.get("USDCTestToken");
    const usdcConfidentialDeployment = await deployments.get("ConfidentialUSDCToken");
    const ethTokenDeployment = await deployments.get("ETHTestToken");
    const ethConfidentialDeployment = await deployments.get("ConfidentialETHToken");

    zamaToken = (await ethers.getContractAt(
      "MintableERC20",
      zamaTokenDeployment.address,
    )) as MintableERC20;
    zamaConfidential = (await ethers.getContractAt(
      "ConfidentialZamaToken",
      zamaConfidentialDeployment.address,
    )) as ConfidentialZamaToken;

    usdcToken = (await ethers.getContractAt(
      "MintableERC20",
      usdcTokenDeployment.address,
    )) as MintableERC20;
    usdcConfidential = (await ethers.getContractAt(
      "ConfidentialUSDCToken",
      usdcConfidentialDeployment.address,
    )) as ConfidentialUSDCToken;

    ethToken = (await ethers.getContractAt(
      "MintableERC20",
      ethTokenDeployment.address,
    )) as MintableERC20;
    ethConfidential = (await ethers.getContractAt(
      "ConfidentialETHToken",
      ethConfidentialDeployment.address,
    )) as ConfidentialETHToken;
  });

  it("allows anyone to mint testing ERC20 tokens", async function () {
    const amount = ethers.parseUnits("250", 6);

    await expect(zamaToken.connect(alice).faucet(amount))
      .to.emit(zamaToken, "Transfer")
      .withArgs(ethers.ZeroAddress, alice.address, amount);

    expect(await zamaToken.balanceOf(alice.address)).to.equal(amount);

    await usdcToken.connect(bob).mint(bob.address, amount);
    expect(await usdcToken.balanceOf(bob.address)).to.equal(amount);
  });

  it("wraps ERC20 balances into confidential tokens and decrypts them", async function () {
    const wrapAmount = ethers.parseUnits("42", 6);

    await zamaToken.connect(alice).faucet(wrapAmount);
    await zamaToken.connect(alice).approve(await zamaConfidential.getAddress(), wrapAmount);

    await zamaConfidential.connect(alice).wrap(alice.address, wrapAmount);

    const encryptedBalance = await zamaConfidential.confidentialBalanceOf(alice.address);
    expect(encryptedBalance).to.not.equal(ethers.ZeroHash);

    const clearBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedBalance,
      await zamaConfidential.getAddress(),
      alice,
    );

    expect(clearBalance).to.equal(wrapAmount);
  });

  it("unwraps confidential balances back to ERC20 recipients", async function () {
    const wrapAmount = ethers.parseUnits("18", 6);
    const unwrapAmount = ethers.parseUnits("5", 6);

    await usdcToken.connect(alice).faucet(wrapAmount);
    await usdcToken.connect(alice).approve(await usdcConfidential.getAddress(), wrapAmount);
    await usdcConfidential.connect(alice).wrap(alice.address, wrapAmount);

    const balanceHandleBefore = await usdcConfidential.confidentialBalanceOf(alice.address);

    const encryptedInput = await fhevm
      .createEncryptedInput(await usdcConfidential.getAddress(), alice.address)
      .add64(unwrapAmount)
      .encrypt();

    const encryptedAmountHandle = ethers.hexlify(encryptedInput.handles[0]);
    const inputProof = ethers.hexlify(encryptedInput.inputProof);

    const unwrapTx = await usdcConfidential
      .connect(alice)
      ["unwrap(address,address,bytes32,bytes)"](alice.address, bob.address, encryptedAmountHandle, inputProof);
    const unwrapReceipt = await unwrapTx.wait();

    const requestLog = unwrapReceipt.logs
      .map((log) => {
        try {
          return decryptionOracleInterface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed) => parsed !== null);

    expect(requestLog).to.not.be.null;

    const parsed = requestLog!;
    expect(parsed.args.contractCaller).to.equal(await usdcConfidential.getAddress());
    const handles = parsed.args.cts as string[];
    expect(handles.length).to.equal(1);

    const balanceHandleAfter = await usdcConfidential.confidentialBalanceOf(alice.address);
    expect(balanceHandleAfter).to.not.equal(balanceHandleBefore);
    expect(balanceHandleAfter).to.not.equal(ethers.ZeroHash);
  });

  it("supports multiple confidential assets independently", async function () {
    const zamaAmount = ethers.parseUnits("10", 6);
    const ethAmount = ethers.parseUnits("7", 6);

    await zamaToken.connect(alice).faucet(zamaAmount);
    await ethToken.connect(alice).faucet(ethAmount);

    await zamaToken.connect(alice).approve(await zamaConfidential.getAddress(), zamaAmount);
    await ethToken.connect(alice).approve(await ethConfidential.getAddress(), ethAmount);

    await zamaConfidential.connect(alice).wrap(alice.address, zamaAmount);
    await ethConfidential.connect(alice).wrap(alice.address, ethAmount);

    const zamaEncrypted = await zamaConfidential.confidentialBalanceOf(alice.address);
    const ethEncrypted = await ethConfidential.confidentialBalanceOf(alice.address);

    const zamaClear = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      zamaEncrypted,
      await zamaConfidential.getAddress(),
      alice,
    );
    const ethClear = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      ethEncrypted,
      await ethConfidential.getAddress(),
      alice,
    );

    expect(zamaClear).to.equal(zamaAmount);
    expect(ethClear).to.equal(ethAmount);
  });
});
