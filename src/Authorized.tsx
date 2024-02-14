import { createResource, type Component, Match, Switch } from "solid-js";

import styles from "./App.module.css";
import { createClient } from "@supabase/supabase-js";
import { RouteSectionProps } from "@solidjs/router";
import { Puff } from "solid-spinner";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const Authorized: Component<RouteSectionProps<unknown>> = (props) => {
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
    <Switch fallback={<Puff color="#FFF" />}>
      <Match when={sessionData()?.data?.session === null}>
        <div>Nie zalogowano!</div>
      </Match>
      <Match when={sessionData()?.data?.session}>{props.children}</Match>
    </Switch>
  );
};

export default Authorized;
