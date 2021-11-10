use super::super::providers;
use gotham::handler::HandlerFuture;
use gotham::middleware::Middleware;
use gotham::state::State;
use std::pin::Pin;

#[derive(Clone, Copy, NewMiddleware)]
pub struct ProvidersMiddleware;

impl Middleware for ProvidersMiddleware {
    fn call<Chain>(self, mut state: State, chain: Chain) -> Pin<Box<HandlerFuture>>
    where
        Chain: FnOnce(State) -> Pin<Box<HandlerFuture>> + Send + 'static,
        Self: Sized + Send,
    {
        // let providers = providers::setup_providers().await;
        let providers = providers::setup_providers_sync();
        state.put(providers);

        let result = chain(state);
        result
    }
}
