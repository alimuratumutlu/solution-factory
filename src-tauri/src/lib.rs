use serde::Serialize;

#[derive(Serialize)]
struct CommandPreview {
    command: String,
    working_directory: String,
    status: String,
}

#[tauri::command]
fn preview_command(command: &str, working_directory: &str) -> CommandPreview {
    CommandPreview {
        command: command.to_string(),
        working_directory: working_directory.to_string(),
        status: "ready".to_string(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![preview_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
