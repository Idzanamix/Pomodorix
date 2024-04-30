'use client'
import React, { useEffect } from "react";
import styles from './statistics.module.css'
import { SelectWeek } from "../../../components/SelectWeek";
import { Stops } from "./Stops";
import { PauseTime } from "./PauseTime";
import { Focus } from "./Focus";
import { Tomatos } from "./Tomatos";
import { Date } from "./Date";
import { useDispatch } from "react-redux";
import { IStatistics, setStatistics } from "../../../storeRedux/todos/todosSlice";
import { findWeek, selectStatistics, selectWeek, selectWeekDay, useAppSelector } from "../../../storeRedux/storeSelectors";
import { Graph } from "./Graph";
import { useUnmount } from "../../../hooks/useUnmount";

export function getCurrentWeekDay(numberWeekDay: number, mounted: boolean, weekData?: IStatistics[]) {
  if (mounted && weekData) {
    const currentDayIndex = Number(Object.keys(weekData[numberWeekDay - 1]));
    const currentDayData = weekData[numberWeekDay - 1][currentDayIndex];
    return currentDayData;
  }
}

export default function Statistics() {
  const [mounted] = useUnmount();
  const dispatch = useDispatch();
  const statistics = useAppSelector(selectStatistics);
  const weekNumber = useAppSelector(selectWeek);
  const numberWeekDay = useAppSelector(selectWeekDay);
  const currentWeekData = findWeek(weekNumber, statistics);
  const currentDayData = getCurrentWeekDay(numberWeekDay, mounted, currentWeekData);
  const focus = currentDayData ?
    Math.round((currentDayData?.sumWorkTime / (currentDayData?.sumWorkTime + currentDayData?.sumPauseTime)) * 100)
    : 0;

  const weekDays = [
    { day: 'Понедельник' },
    { day: 'Вторник' },
    { day: 'Среда' },
    { day: 'Четверг' },
    { day: 'Пятница' },
    { day: 'Суббота' },
    { day: 'Воскресенье' },
  ]

  useEffect(() => {
    dispatch(setStatistics());
  }, [dispatch]);

  return mounted && (
    <section className={styles.section}>
      <h1 className={styles.title}>
        Ваша активность
      </h1>
      <SelectWeek weekNumber={weekNumber} />
      <Date value={(currentDayData?.sumWorkTime || 0)} weekDay={weekDays[numberWeekDay - 1].day} />
      <Tomatos value={currentDayData?.sumTomatoCount} />
      <Graph currentWeekData={currentWeekData} currentWeekDay={numberWeekDay} mounted={mounted} />
      <Focus value={focus} />
      <PauseTime value={currentDayData?.sumPauseTime || 0} />
      <Stops value={(currentDayData?.stops || 0)} />
    </section>
  )
}
