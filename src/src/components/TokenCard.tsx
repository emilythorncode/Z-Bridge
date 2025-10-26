import { useState, useMemo } from "react";
import { Contract, ethers } from "ethers";
import { useReadContract } from "wagmi";
import type { JsonRpcSigner } from "ethers";
import type { TokenConfig } from "../config/tokenConfig";
import "../styles/TokenCard.css";

type TokenCardProps = {
  token: TokenConfig;
  address?: `0x${string}`;
  signerPromise?: Promise<JsonRpcSigner>;
  zamaInstance: any;
  zamaLoading: boolean;
  isConnected: boolean;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export function TokenCard({ token, address, signerPromise, zamaInstance, zamaLoading, isConnected }: TokenCardProps) {
  const [mintAmount, setMintAmount] = useState("100");
  const [wrapAmount, setWrapAmount] = useState("10");
  const [unwrapAmount, setUnwrapAmount] = useState("5");
  const [isMinting, setIsMinting] = useState(false);
  const [isWrapping, setIsWrapping] = useState(false);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);

  const { data: underlyingBalance, refetch: refetchUnderlying } = useReadContract({
    address: token.underlying.address,
    abi: token.underlying.abi as any,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled:
        isConnected && !!address && token.underlying.address !== ZERO_ADDRESS && token.underlying.abi.length > 0,
    },
  });

  const { data: confidentialBalance, refetch: refetchConfidential } = useReadContract({
    address: token.confidential.address,
    abi: token.confidential.abi as any,
    functionName: "confidentialBalanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled:
        isConnected && !!address && token.confidential.address !== ZERO_ADDRESS && token.confidential.abi.length > 0,
    },
  });

  const formattedUnderlying = useMemo(() => {
    if (!underlyingBalance) {
      return "0";
    }
    try {
      return ethers.formatUnits(underlyingBalance as bigint, token.decimals);
    } catch {
      return "0";
    }
  }, [underlyingBalance, token.decimals]);

  const encryptedDisplay = useMemo(() => {
    if (!confidentialBalance || confidentialBalance === ZERO_HASH) {
      return "No confidential balance";
    }
    return `${String(confidentialBalance).slice(0, 10)}…${String(confidentialBalance).slice(-6)}`;
  }, [confidentialBalance]);

  const ensureReady = async () => {
    if (!isConnected || !address) {
      throw new Error("Connect a wallet to continue");
    }
    if (!signerPromise) {
      throw new Error("Unable to access signer");
    }
    if (!token.underlying.abi.length || !token.confidential.abi.length) {
      throw new Error("Contract ABIs are not loaded yet");
    }
    const signer = await signerPromise;
    return { signer, account: address };
  };

  const refreshBalances = async () => {
    await Promise.allSettled([refetchUnderlying(), refetchConfidential()]);
  };

  const handleMint = async () => {
    try {
      setActionError(null);
      setIsMinting(true);
      const { signer, account } = await ensureReady();
      const amount = ethers.parseUnits(mintAmount || "0", token.decimals);
      if (amount <= 0n) {
        throw new Error("Mint amount must be positive");
      }
      const contract = new Contract(token.underlying.address, token.underlying.abi as any, signer);
      const tx = await contract.mint(account, amount);
      await tx.wait();
      await refreshBalances();
    } catch (error) {
      setActionError((error as Error).message ?? "Mint failed");
    } finally {
      setIsMinting(false);
    }
  };

  const handleWrap = async () => {
    try {
      setActionError(null);
      setIsWrapping(true);
      setDecryptedBalance(null);
      const { signer, account } = await ensureReady();
      const amount = ethers.parseUnits(wrapAmount || "0", token.decimals);
      if (amount <= 0n) {
        throw new Error("Wrap amount must be positive");
      }
      const underlying = new Contract(token.underlying.address, token.underlying.abi as any, signer);
      const confidential = new Contract(token.confidential.address, token.confidential.abi as any, signer);

      const approveTx = await underlying.approve(token.confidential.address, amount);
      await approveTx.wait();

      const wrapTx = await confidential.wrap(account, amount);
      await wrapTx.wait();

      await refreshBalances();
    } catch (error) {
      setActionError((error as Error).message ?? "Wrap failed");
    } finally {
      setIsWrapping(false);
    }
  };

  const handleUnwrap = async () => {
    try {
      setActionError(null);
      setIsUnwrapping(true);
      setDecryptedBalance(null);

      if (!zamaInstance) {
        throw new Error("Encryption service is still initializing");
      }

      const { signer, account } = await ensureReady();
      const amount = ethers.parseUnits(unwrapAmount || "0", token.decimals);
      if (amount <= 0n) {
        throw new Error("Unwrap amount must be positive");
      }
      if (amount > BigInt("18446744073709551615")) {
        throw new Error("Amount exceeds 64-bit limit");
      }

      const encryptedInput = await zamaInstance
        .createEncryptedInput(token.confidential.address, account)
        .add64(amount)
        .encrypt();

      const encryptedAmountHandle = ethers.hexlify(encryptedInput.handles[0]);
      const inputProof = ethers.hexlify(encryptedInput.inputProof);

      const confidential = new Contract(token.confidential.address, token.confidential.abi as any, signer);
      const unwrapTx = await confidential[
        "unwrap(address,address,bytes32,bytes)"
      ](account, account, encryptedAmountHandle, inputProof);
      await unwrapTx.wait();

      await refreshBalances();
    } catch (error) {
      setActionError((error as Error).message ?? "Unwrap failed");
    } finally {
      setIsUnwrapping(false);
    }
  };

  const handleDecrypt = async () => {
    try {
      setActionError(null);
      setIsDecrypting(true);

      if (!zamaInstance) {
        throw new Error("Encryption service is still initializing");
      }
      if (!confidentialBalance || confidentialBalance === ZERO_HASH) {
        setDecryptedBalance("0");
        return;
      }

      const { signer, account } = await ensureReady();
      const keypair = zamaInstance.generateKeypair();
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "7";
      const contractAddresses = [token.confidential.address];

      const eip712 = zamaInstance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimestamp,
        durationDays,
      );

      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message,
      );

      const result = await zamaInstance.userDecrypt(
        [
          {
            handle: confidentialBalance,
            contractAddress: token.confidential.address,
          },
        ],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        account,
        startTimestamp,
        durationDays,
      );

      const values = Object.values(result) as Array<bigint | string | boolean>;
      const decrypted = values[0] as bigint;
      setDecryptedBalance(ethers.formatUnits(decrypted, token.decimals));
    } catch (error) {
      setActionError((error as Error).message ?? "Decryption failed");
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <article className="token-card">
      <header className="token-card-header">
        <h3 className="token-card-title">{token.label}</h3>
        <span className="token-card-symbol">{token.symbol}</span>
      </header>

      <div className="token-section">
        <h4 className="token-section-title">Underlying Balance</h4>
        <p className="token-balance">{formattedUnderlying}</p>
        <div className="token-form-row">
          <label className="token-input-label">
            Amount
            <input
              type="number"
              min="0"
              step="0.000001"
              value={mintAmount}
              onChange={(event) => setMintAmount(event.target.value)}
              className="token-input"
            />
          </label>
          <button
            className="token-button"
            onClick={handleMint}
            disabled={isMinting || !isConnected}
          >
            {isMinting ? "Minting..." : "Mint"}
          </button>
        </div>
      </div>

      <div className="token-section">
        <h4 className="token-section-title">Wrap to Confidential</h4>
        <div className="token-form-row">
          <label className="token-input-label">
            Amount
            <input
              type="number"
              min="0"
              step="0.000001"
              value={wrapAmount}
              onChange={(event) => setWrapAmount(event.target.value)}
              className="token-input"
            />
          </label>
          <button
            className="token-button"
            onClick={handleWrap}
            disabled={isWrapping || !isConnected}
          >
            {isWrapping ? "Wrapping..." : "Wrap"}
          </button>
        </div>
      </div>

      <div className="token-section">
        <h4 className="token-section-title">Unwrap to ERC20</h4>
        <div className="token-form-row">
          <label className="token-input-label">
            Amount
            <input
              type="number"
              min="0"
              step="0.000001"
              value={unwrapAmount}
              onChange={(event) => setUnwrapAmount(event.target.value)}
              className="token-input"
            />
          </label>
          <button
            className="token-button"
            onClick={handleUnwrap}
            disabled={isUnwrapping || !isConnected || zamaLoading}
          >
            {isUnwrapping ? "Unwrapping..." : zamaLoading ? "Initializing..." : "Unwrap"}
          </button>
        </div>
      </div>

      <div className="token-section">
        <h4 className="token-section-title">Confidential Balance</h4>
        <p className="token-encrypted">{encryptedDisplay}</p>
        {decryptedBalance !== null ? (
          <p className="token-decrypted">
            Decrypted: <span>{decryptedBalance}</span>
          </p>
        ) : null}
        <button
          className="token-button secondary"
          onClick={handleDecrypt}
          disabled={isDecrypting || !isConnected || zamaLoading}
        >
          {isDecrypting ? "Decrypting..." : zamaLoading ? "Initializing..." : "Decrypt Balance"}
        </button>
      </div>

      {actionError ? <p className="token-error">{actionError}</p> : null}
    </article>
  );
}
