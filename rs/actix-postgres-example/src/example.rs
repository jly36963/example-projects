mod providers;
mod types;

use reqwest;

#[tokio::main]
async fn main() {
    // Setup
    let base_url = "http://127.0.0.1:5000/api";
    let client = reqwest::Client::new();

    // Create ninja
    let ninja: types::Ninja = client
        .post(format!("{}/ninja/", base_url))
        .json(&types::NinjaNew {
            first_name: String::from("Kakashi"),
            last_name: String::from("Hatake"),
            age: 27,
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Create ninja result: {:#?}", ninja);
    let ninja_id = ninja.id;

    // Select Ninja
    let ninja: types::Ninja = client
        .get(format!("{}/ninja/{}/", base_url, ninja_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Select ninja result: {:#?}", ninja);

    // Update Ninja
    let ninja: types::Ninja = client
        .put(format!("{}/ninja/{}/", base_url, ninja_id.clone()))
        .json(&types::NinjaUpdates {
            first_name: Some(String::from("Kaka")),
            last_name: Some(String::from("Sensei")),
            age: None,
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Update ninja result: {:#?}", ninja);

    // Create jutsu
    let jutsu: types::Jutsu = client
        .post(format!("{}/jutsu/", base_url))
        .json(&types::JutsuNew {
            name: String::from("Chidori"),
            description: String::from("Plover / a thousand birds"),
            chakra_nature: String::from("Lightning"),
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Create jutsu result: {:#?}", jutsu);
    let jutsu_id = jutsu.id;

    // Select jutsu
    let jutsu: types::Jutsu = client
        .get(format!("{}/jutsu/{}/", base_url, jutsu_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Select jutsu result: {:#?}", jutsu);

    // Update jutsu
    let jutsu: types::Jutsu = client
        .put(format!("{}/jutsu/{}/", base_url, jutsu_id.clone()))
        .json(&types::JutsuUpdates {
            name: None,
            description: Some(String::from("Lightning blade")),
            chakra_nature: None,
        })
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Update jutsu result: {:#?}", jutsu);

    // Associate ninja & jutsu
    let _ = client
        .post(format!(
            "{}/ninja-jutsu/{}/{}/",
            base_url,
            ninja_id.clone(),
            jutsu_id.clone()
        ))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap();

    println!("Associate ninja & jutsu result: Ok");

    // Get ninja with jutsus
    let ninja: types::Ninja = client
        .get(format!("{}/ninja/{}/jutsus/", base_url, ninja_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Get ninja with jutsus result: {:#?}", ninja);

    // Dissociate ninja & jutsu
    let _ = client
        .delete(format!(
            "{}/ninja-jutsu/{}/{}/",
            base_url,
            ninja_id.clone(),
            jutsu_id.clone()
        ))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap();

    println!("Dissociate ninja & jutsu result: Ok");

    // Get ninja with jutsus (post-dissociation)
    let ninja: types::Ninja = client
        .get(format!("{}/ninja/{}/jutsus/", base_url, ninja_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!(
        "Get ninja with jutsus result (post-dissociation): {:#?}",
        ninja
    );

    // Delete ninja
    let ninja: types::Ninja = client
        .delete(format!("{}/ninja/{}/", base_url, ninja_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Delete ninja result: {:#?}", ninja);

    // Delete jutsu
    let jutsu: types::Jutsu = client
        .delete(format!("{}/jutsu/{}/", base_url, jutsu_id.clone()))
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("Select jutsu result: {:#?}", jutsu);
}
