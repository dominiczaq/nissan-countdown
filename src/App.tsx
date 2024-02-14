import {
  createSignal,
  type Component,
  onCleanup,
  createMemo,
  Switch,
  Match,
} from "solid-js";
import { Puff } from "solid-spinner";
import { createQuery } from "@tanstack/solid-query";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { fetchKm } from "./queries";

const App: Component = () => {
  const endDate = new Date("2024-10-01");
  const [date, setDate] = createSignal(new Date());
  const interval = setInterval(() => {
    setDate(new Date());
  });
  onCleanup(() => {
    clearInterval(interval);
  });

  const timeDiffInSeconds = createMemo(() =>
    Math.round((endDate.getTime() - date().getTime()) / 1000)
  );

  const timeDiffInDays = createMemo(() =>
    Math.round(timeDiffInSeconds() / 60 / 60 / 24)
  );

  const query = createQuery(() => ({
    queryKey: ["km"],
    queryFn: fetchKm,
  }));

  const targetKm = 30_000;
  const currentKm = () => (query.isSuccess ? query.data : []);
  const lastUpdate = () => currentKm()[0];
  const diffKm = () => targetKm - lastUpdate()?.value;

  const kmPerDayDynamic = () =>
    Math.round((diffKm() / timeDiffInSeconds()) * 60 * 60 * 24 * 100) / 100;

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
          <p>
            Zostało: {timeDiffInSeconds()} sekund / {timeDiffInDays()} dni
          </p>
          <p>
            Ostatnia aktualizacja: {lastUpdate()?.updatedAt.toLocaleString()} -{" "}
            {lastUpdate()?.value}km
          </p>
        </Match>
      </Switch>
    </>
  );
};

export default App;
