import {
  createResource,
  type Component,
  Match,
  Switch,
  createContext,
} from "solid-js";

import { Session, createClient } from "@supabase/supabase-js";
import { RouteSectionProps } from "@solidjs/router";
import { Puff } from "solid-spinner";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const SessionContext = createContext<null | Session>(null);

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
      <Match when={sessionData()?.data?.session}>
        <SessionContext.Provider value={sessionData()?.data.session || null}>
          {props.children}
        </SessionContext.Provider>
      </Match>
    </Switch>
  );
};

export default Authorized;
