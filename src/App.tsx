import {
  createSignal,
  type Component,
  onCleanup,
  createMemo,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import { Puff } from "solid-spinner";
import { useQueryClient } from "@tanstack/solid-query";
import { createQuery } from "@tanstack/solid-query";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { fetchKm } from "./queries";
import { observeQueryData } from "./utils/observeQueryData";
import { monthDiff } from "./utils/diffInMonths";

const App: Component = () => {
  const endDate = new Date("2024-09-25");
  const [date, setDate] = createSignal(new Date());
  const dateInterval = setInterval(() => {
    setDate(new Date());
  }, 1000);
  onCleanup(() => {
    clearInterval(dateInterval);
  });

  const timeDiffInSeconds = createMemo(() =>
    Math.round((endDate.getTime() - date().getTime()) / 1000)
  );

  const timeDiffInDays = createMemo(() =>
    Math.round(timeDiffInSeconds() / 60 / 60 / 24)
  );

  const timeDiffInMonths = createMemo(() => monthDiff(date(), endDate));

  const query = createQuery(() => ({
    queryKey: ["km"],
    queryFn: fetchKm,
    staleTime: 60 * 60 * 1000,
  }));

  const targetKm = 30_000;
  const currentKm = () => (query.isSuccess ? query.data : []);
  const lastUpdate = () => currentKm()[0];
  const diffKm = () => targetKm - lastUpdate()?.value;

  const kmPerDayDynamic = () =>
    Math.round((diffKm() / timeDiffInSeconds()) * 60 * 60 * 24 * 100) / 100;

  // observeQueryData(["km"]);

  return (
    <>
      <img src={logo} class={styles.logo} alt="logo" />
      <Switch fallback={<p>Brak danych</p>}>
        <Match when={query.isPending}>
          <Puff color="#FFF" />
        </Match>
        <Match when={query.isError}>
          <p>Error: {query.error?.message}</p>
        </Match>
        <Match when={query.isSuccess && query.data.length > 0}>
          <p>Dziennie do przejechania: {kmPerDayDynamic()} km</p>
          <p>Do przejechania: {diffKm()} km</p>
          {/* <p> */}
          {/* Zostało: {timeDiffInSeconds()} sekund / {timeDiffInDays()} dni */}
          {/* Zostało: {parseFloat(String(timeDiffInMonths())).toFixed(2)}{" "} */}
          {/* miesięcy / {timeDiffInDays()} dni */}
          {/* </p> */}
          <p>Data zakończenia {endDate.toLocaleDateString()}</p>
          <p>
            Ostatnia aktualizacja:{" "}
            {new Date(lastUpdate()?.updatedAt).toLocaleString()} -{" "}
            {lastUpdate()?.value}km
          </p>
        </Match>
      </Switch>
    </>
  );
};

export default App;
