
import type { AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";

import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupModal } from "@near-wallet-selector/modal-ui";

// import { setupNearWallet } from "@near-wallet-selector/near-wallet";
// import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
// import { setupHereWallet } from "@near-wallet-selector/here-wallet";
// import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
// import { setupNarwallets } from "@near-wallet-selector/narwallets";
// import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";
// import { setupNearSnap } from "@near-wallet-selector/near-snap";
// import { setupLedger } from "@near-wallet-selector/ledger";
// import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
// import { setupNightlyConnect } from "@near-wallet-selector/nightly-connect";
// import { setupNearFi } from "@near-wallet-selector/nearfi";
// import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
// import { setupOptoWallet } from "@near-wallet-selector/opto-wallet";
// import { setupFinerWallet } from "@near-wallet-selector/finer-wallet";
// import { setupNeth } from "@near-wallet-selector/neth";
// import { setupXDEFI } from "@near-wallet-selector/xdefi";

import type { ReactNode } from "react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { distinctUntilChanged, map } from "rxjs";

import {useActiveReact} from '../../hooks/useActiveReact'
import { ChainId } from "../../config/chainConfig/chainId";


declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
}

const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

// export const WalletSelectorContextProvider: React.FC<{
//   children: ReactNode;
// }> = ({ children }) => {
export function WalletSelectorContextProvider({
  children
}: {children: ReactNode}) {
  const {chainId} = useActiveReact()
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      // network: "testnet",
      network: chainId === ChainId.NEAR ? "mainnet" : 'testnet',
      debug: true,
      modules: [
        // setupNearWallet(),
        // setupMyNearWallet(),
        setupSender(),
        // setupHereWallet(),
        // setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
        // setupNearSnap(),
        // setupNarwallets(),
        // setupWelldoneWallet(),
        // setupLedger(),
        // setupNearFi(),
        // setupCoin98Wallet(),
        // setupOptoWallet(),
        // setupFinerWallet(),
        // setupNeth(),
        // setupXDEFI(),
        // setupWalletConnect({
        //   projectId: "c4f79cc...",
        //   metadata: {
        //     name: "NEAR Wallet Selector",
        //     description: "Example dApp used by NEAR Wallet Selector",
        //     url: "https://github.com/near/wallet-selector",
        //     icons: ["https://avatars.githubusercontent.com/u/37784886"],
        //   },
        // }),
        // setupNightlyConnect({
        //   url: "wss://relay.nightly.app/app",
        //   appMetadata: {
        //     additionalInfo: "",
        //     application: "NEAR Wallet Selector",
        //     description: "Example dApp used by NEAR Wallet Selector",
        //     icon: "https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png",
        //   },
        // }),
      ],
    });
    const _modal = setupModal(_selector, {
      contractId: "guest-book.testnet",
    });
    const state = _selector.store.getState();
    setAccounts(state.accounts);

    window.selector = _selector;
    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    // console.log(selector)
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state: any) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts: any) => {
        console.log("Accounts Update", nextAccounts);

        setAccounts(nextAccounts);
      });

    const onHideSubscription: any = modal ? modal.on("onHide", ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`);
    }) : undefined;

    return () => {
      subscription.unsubscribe();
      onHideSubscription.remove();
    };
  }, [selector]);

  if (!selector || !modal) {
    return <>Loading</>;
  }

  const accountId =
    accounts.find((account) => account.active)?.accountId || null;

  // const handleSignOut = async () => {
  //   const wallet = await selector.wallet();

  //   wallet.signOut().catch((err) => {
  //     console.log("Failed to sign out");
  //     console.error(err);
  //   });
  // };
  // const handleSwitchWallet = () => {
  //   modal.show();
  // };
  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
      }}
    >
      {/* <div onClick={()=> handleSignOut()}>Out</div>
      <div onClick={()=> handleSwitchWallet()}>Switch Wallet</div> */}
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }

  return context;
}
