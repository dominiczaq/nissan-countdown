import { createSignal, type Component, Switch, Match, Show } from "solid-js";

import addStyles from "./Add.module.css";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { observeQueryData } from "./utils/observeQueryData";

const Add: Component = () => {
  const queryClient = useQueryClient();
  // TODO remove
  observeQueryData(["km"]);
  const [val, setVal] = createSignal("");

  const mutation = createMutation(() => ({
    mutationKey: ["km"],
    mutationFn: async ({ value }: { value: string }) => {
      return fetch("/api/km", {
        method: "POST",
        body: JSON.stringify({ value }),
        headers: { "Content-type": "application/json" },
      });
    },
    onSuccess: async (res) => {
      const data = queryClient.getQueryData(["km"] || []);
      const response = await res.json();
      queryClient.setQueryData(["km"], [response].concat(data));
    },
  }));

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    mutation.mutate({ value: val() });
    setVal("");
  };

  return (
    <>
      <p>Dodaj nową wartość z licznika</p>
      <form class={addStyles.form} onSubmit={onSubmit}>
        <input
          class={addStyles.input}
          type="number"
          onChange={(e) => setVal(e.target.value)}
          value={val()}
        />
        <Switch>
          <Match when={mutation.isPending}>
            <button disabled type="submit" class={addStyles.submit}>
              Zapisuje...
            </button>
          </Match>
          <Match when={!mutation.isPending}>
            <button type="submit" class={addStyles.submit}>
              Zapisz
            </button>
          </Match>
        </Switch>
        <Show when={mutation.error}>
          <div class={addStyles.errorModal}>Błąd zapisu</div>
        </Show>
        <Show when={mutation.isSuccess}>
          <div class={addStyles.successModal}>Zapisano!</div>
        </Show>
      </form>
    </>
  );
};

export default Add;
