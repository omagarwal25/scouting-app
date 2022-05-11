#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::{PluginBuilder, StoreBuilder};

fn main() {
    let data = StoreBuilder::new(".data".parse().unwrap()).build();

    tauri::Builder::default()
        .plugin(PluginBuilder::default().stores([data]).freeze().build())
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
