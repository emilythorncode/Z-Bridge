import { useAccount } from "wagmi";
import { Header } from "./Header";
import { TOKENS } from "../config/tokenConfig";
import { TokenCard } from "./TokenCard";
import { useZamaInstance } from "../hooks/useZamaInstance";
import { useEthersSigner } from "../hooks/useEthersSigner";
import "../styles/BridgeApp.css";

export function BridgeApp() {
  const { address, status } = useAccount();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const isConnected = status === "connected" && !!address;

  return (
    <div className="bridge-app">
      <Header />
      <main className="bridge-main">
        <section className="bridge-hero">
          <h2 className="bridge-title">Confidential ERC20 Bridge</h2>
          <p className="bridge-subtitle">
            Mint testing ERC20 tokens, wrap them into confidential ERC7984 assets, and decrypt balances using Zama&apos;s
            Fully Homomorphic Encryption tooling.
          </p>
        </section>

        {!isConnected ? (
          <section className="bridge-status">
            <p className="bridge-status-message">Connect a wallet on Sepolia to start minting and converting tokens.</p>
          </section>
        ) : null}

        {zamaError ? (
          <section className="bridge-status error">
            <p className="bridge-status-message">Encryption service unavailable: {zamaError}</p>
          </section>
        ) : null}

        <section className="tokens-grid">
          {TOKENS.map((token) => (
            <TokenCard
              key={token.key}
              token={token}
              address={address}
              signerPromise={signerPromise}
              zamaInstance={instance}
              zamaLoading={zamaLoading}
              isConnected={isConnected}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
