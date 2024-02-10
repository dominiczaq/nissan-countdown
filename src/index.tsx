/* @refresh reload */
import { render } from "solid-js/web";
import { lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";

import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

const queryClient = new QueryClient();

const Authorized = lazy(() => import("./Authorized"));
const Add = lazy(() => import("./Add"));

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={App} />
        <Route path="/admin" component={Authorized}>
          <Route path="/add" component={Add} />
        </Route>
      </Router>
    </QueryClientProvider>
  ),
  root!
);
