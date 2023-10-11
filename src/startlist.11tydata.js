module.exports = {
  eleventyComputed: {
    startlistWithTime: data => {
      const { startlist, timeplan } = data;
      const startlistWithEvents = [];
      for (const day of timeplan.days) {
        const dayStartlistWithEvents = [];
        for (const group of day.groups) {
          let groupWarmup = false;
          const startsInGroup = startlist.filter(start => start.group === group);
          let currentAK = null;
          const starts = []
          for (const start of startsInGroup) {
            if(!start.group.startsWith("Finale") && start.category !== currentAK || groupWarmup == false) {
              starts.push({
                type: "event",
                name: "Einfahrzeit",
                duration: timeplan.durations.groups[group].warmup,
              });
              currentAK = start.category;
              groupWarmup = true;
            }
            starts.push({
              type: "start",
              start,
              duration:
                timeplan.durations.groups[group].act +
                timeplan.durations.groups[group].jury,
            });
          }
          for (const event of day.extraEvents.filter(event => event.position.inGroup == group)) {
            starts.splice(event.position.position, 0, {
              type: "event",
              name: event.name,
              duration: event.duration,
            }); 
          }
          dayStartlistWithEvents.push(...starts);
          const extraEventsAfterGroup = day.extraEvents.filter(event => event.position.afterGroup == group);
          for (const event of extraEventsAfterGroup) {
            dayStartlistWithEvents.push({
              type: "event",
              name: event.name,
              duration: event.duration,
            });
          }
        }
        let nextEntry = day.start;
        for (const entry of dayStartlistWithEvents) {
          startlistWithEvents.push({
            ...entry,
            starts: new Date(nextEntry),
          });
          nextEntry.setMinutes(nextEntry.getMinutes() + entry.duration);
        }
      }
      return startlistWithEvents;
    }
  }
}
