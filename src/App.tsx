import { createSignal, type Component, onCleanup, createMemo } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

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

  const targetKm = 30_000;
  // TODO dynamic
  const [currentKm] = createSignal(12_225);
  const diffKm = () => targetKm - currentKm();

  const kmPerDayDynamic = () =>
    Math.round((diffKm() / timeDiffInSeconds()) * 60 * 60 * 24 * 100) / 100;

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>Dziennie do przejechania: {kmPerDayDynamic()} km</p>
        <p>Do przejechania: {diffKm()} km</p>
        <p>
          Zostało: {timeDiffInSeconds()} sekund / {timeDiffInDays()} dni
        </p>
      </header>
    </div>
  );
};

export default App;
