import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Confidential Bridge</h1>
            <p className="header-description">Convert testing ERC20 tokens into encrypted ERC7984 assets on Sepolia.</p>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
