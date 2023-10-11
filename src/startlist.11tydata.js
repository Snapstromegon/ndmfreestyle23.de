const dayStartlistToStartlist = (day, dayStartlist) => {
  const startlist = [];
  const nextEntry = day.start;
  for (const entry of dayStartlist) {
    startlist.push({
      ...entry,
      starts: new Date(nextEntry),
    });
    nextEntry.setMinutes(nextEntry.getMinutes() + entry.duration);
  }
  return startlist;
};

const dayAddExtraEventsAfterGroup = (day, group) => {
  const extraEventsAfterGroup = day.extraEvents.filter(
    (event) => event.position.afterGroup === group
  );
  const res = [];
  for (const event of extraEventsAfterGroup) {
    res.push({
      duration: event.duration,
      name: event.name,
      type: "event",
    });
  }
  return res;
};

const injectExtraEvents = (day, group, starts) => {
  for (const event of day.extraEvents.filter(
    (extraEvent) => extraEvent.position.inGroup === group
  )) {
    starts.splice(event.position.position, 0, {
      duration: event.duration,
      name: event.name,
      type: "event",
    });
  }
  return starts;
};

const getGroupStarts = (startlist, group, timeplan, day) => {
  let groupWarmup = false;
  let currentAK = null;
  const starts = [];
  for (const start of startlist.filter((entry) => entry.group === group)) {
    if (
      (!start.group.startsWith("Finale") && start.category !== currentAK) ||
      !groupWarmup
    ) {
      starts.push({
        duration: timeplan.durations.groups[group].warmup,
        name: "Einfahrzeit",
        type: "event",
      });
      currentAK = start.category;
      groupWarmup = true;
    }
    starts.push({
      duration:
        timeplan.durations.groups[group].act +
        timeplan.durations.groups[group].jury,
      start,
      type: "start",
    });
  }
  return injectExtraEvents(day, group, starts);
};

module.exports = {
  eleventyComputed: {
    startlistWithTime: (data) => {
      const { startlist, timeplan } = data;
      const startlistWithEvents = [];
      for (const day of timeplan.days) {
        const dayStartlistWithEvents = [];
        for (const group of day.groups) {
          const starts = getGroupStarts(startlist, group, timeplan, day);
          dayStartlistWithEvents.push(
            ...starts,
            ...dayAddExtraEventsAfterGroup(day, group)
          );
        }
        startlistWithEvents.push(
          ...dayStartlistToStartlist(day, dayStartlistWithEvents)
        );
      }
      return startlistWithEvents;
    },
  },
};
