import { useQueryClient } from "@tanstack/solid-query";
import { createEffect, createSignal, onCleanup } from "solid-js";

export function observeQueryData(queryData: string[]) {
  const queryClient = useQueryClient();

  let [queryClientInterval, setQueryClientInterval] = createSignal<ReturnType<
    typeof setTimeout
  > | null>(null);
  createEffect(() => {
    const i = setInterval(() => {
      console.log(queryClient.getQueryData(queryData));
    }, 1000);
    setQueryClientInterval(i);
  });
  onCleanup(() => {
    const i = queryClientInterval();
    if (i) {
      clearInterval(i);
    }
  });
}
