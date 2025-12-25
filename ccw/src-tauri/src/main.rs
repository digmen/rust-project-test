use bip39::Mnemonic;
use ethers::prelude::*;
use ethers::providers::{Http, Provider};
use ethers::signers::LocalWallet;
use k256::ecdsa::SigningKey;
use rand::rngs::OsRng;
use rand::RngCore;
use std::sync::Arc;
use tauri::command;

#[command]
async fn generate_wallet_info() -> Result<(String, String, String), String> {
    let provider_url = "https://mainnet.infura.io/v3/8d75cfecce814b2dbcf953204c3aecac";
    let provider = Arc::new(Provider::<Http>::try_from(provider_url).map_err(|e| e.to_string())?);

    let mut entropy = [0u8; 16];
    OsRng.fill_bytes(&mut entropy);

    let mnemonic = Mnemonic::from_entropy(&entropy).map_err(|e| e.to_string())?;
    let phrase = mnemonic.to_string();

    let seed = mnemonic.to_seed("");
    let signing_key = SigningKey::from_bytes(&seed[..32]).map_err(|e| e.to_string())?;
    let wallet = LocalWallet::from(signing_key);

    let address = wallet.address();
    let balance = provider
        .get_balance(address, None)
        .await
        .map_err(|e| e.to_string())?;

    Ok((phrase, format!("{:#x}", address), balance.to_string()))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_wallet_info])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
