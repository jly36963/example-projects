use bb8::Pool;
use bb8_postgres::PostgresConnectionManager;
use std::str::FromStr;
use tokio_postgres::NoTls;

pub fn replace_placeholders(mut sql: String) -> String {
    let mut output = "".to_string();
    let mut i = 0;
    loop {
        let idx: usize;
        match sql.find("?") {
            Some(index) => idx = index,
            None => break,
        };
        // escape ?? -> ?
        // replace ? with $i
        if (sql[idx..].chars().count() > 1) && (&sql[idx..idx + 2] == "??") {
            // drain everything up to and including ??
            let before: String = sql.drain(..idx + 2).collect();
            // push everything up to ?
            output.push_str(&before[..before.len() - 1].to_string());
        } else {
            i += 1;
            // drain everything up to and including ?
            let before: String = sql.drain(..idx + 1).collect();
            // push everything up to ?, push $i
            output.push_str(&before[..before.len() - 1].to_string());
            output.push_str(&format!("${}", i));
        }
    }
    output.push_str(&sql);
    output
}

pub async fn get_pg_pool(
) -> bb8::Pool<bb8_postgres::PostgresConnectionManager<tokio_postgres::NoTls>> {
    let pg_conn_str = "postgresql://postgres:postgres@localhost:5432/practice";
    let pg_config = tokio_postgres::config::Config::from_str(pg_conn_str).unwrap();
    let pg_manager = PostgresConnectionManager::new(pg_config, NoTls);
    let pg_pool = Pool::builder().build(pg_manager).await.unwrap();
    return pg_pool;
}
