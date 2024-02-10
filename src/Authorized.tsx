import { createResource, type Component, Match, Switch } from "solid-js";

import styles from "./App.module.css";
import { createClient } from "@supabase/supabase-js";
import { RouteSectionProps } from "@solidjs/router";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const App: Component<RouteSectionProps<unknown>> = (props) => {
  const [sessionData] = createResource(async () => {
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`,
        },
      });
    }

    return session;
  });

  return (
    <div class={styles.App}>
      <Switch>
        <Match when={!sessionData()?.data?.session}>
          <header class={styles.header}>Nie zalogowano!</header>
        </Match>
        <Match when={sessionData()?.data?.session}>{props.children}</Match>
      </Switch>
    </div>
  );
};

export default App;
