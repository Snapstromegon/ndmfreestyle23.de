---
layout: layouts/page-full-header.njk
eleventyNavigation:
  icon: home
  key: Start
  order: 1
---

# Hallo!

Nach der ODM 2016 und der DM 2019 freuen wir uns als SSV Nümbrecht 2023 wieder eine Meisterschaft in unserem schönen Luftkurort ausrichten zu dürfen. Dieses mal ist es die **Norddeutsche Meisterschaft im Freestyle**.

<div class="logo-line">
<a target="_blank" rel="norefferer" href="https://www.ssvnuembrecht-turnen.de/index.php/abteilungen/einradfahren">{% image "assets/img/logos/ssv.png", "Logo SSV Nümbrecht Turnen 2010 e.V." %}</a>
<a target="_blank" rel="norefferer" href="https://einrad-bdr.de/">{% image "assets/img/logos/bdr.png", "Logo BDR" %}</a>
<a target="_blank" rel="norefferer" href="https://www.einradverband.de/">{% image "assets/img/logos/evd.webp", "Logo EVD" %}</a>
</div>

## Wie kann ich mitmachen?

Um an der Norddeutschen Meisterschaft teilnehmen zu dürfen, musst Du dich (bzw. Ihr euch) bei einer der folgenden Landesmeisterschaften für die Teilnahme qualifizieren:

<style>
  .lm-events {
    display: grid;
    gap: var(--m);
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }

  .lm-event-container {
    container: lm-card / inline-size;
  }

  .lm-event {
    display: grid;
    grid-template-columns: 8rem 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: "image title" "image regions";
    background: var(--color-background-secondary);
    border-radius: var(--s);
    color: var(--text-color-sidebar);
    text-decoration: none;
    overflow: hidden;
    height: 100%;
    --dot-size: 0.05rem;
    --dot-space: var(--s);
    background:
      radial-gradient(farthest-corner at 0 0, var(--color-background-secondary) 66%, transparent),
      radial-gradient(circle at center, var(--color-middle-gray) var(--dot-size), transparent var(--dot-size)),
      var(--color-background-secondary);
    background-size: cover, var(--dot-space) var(--dot-space), cover;
  }

  .lm-event picture {
    grid-area: image;
  }

  .lm-event picture img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    background: var(--color-background-nuanced);
    border-right: var(--xs) solid var(--color-red);
    transition: border-color .2s;
  }

  .lm-event:hover img {
    border-color: var(--color-yellow);
  }

  .lm-event h3 {
    margin: var(--m);
    margin-bottom: var(--s);
  }

  .lm-event ul {
    margin: var(--m);
    margin-top: 0;
  }

  @container lm-card (max-width: 20rem) {
    .lm-event {
      grid-template-columns: 1fr;
      grid-template-rows: 10rem auto 1fr;
      grid-template-areas: "image" "title" "regions";
    }

    .lm-event picture img {
      border: none;
      border-bottom: var(--xs) solid var(--color-red);
    }
  }
</style>

<div class="lm-events">
<div class="lm-event-container">
<a href="https://unicycle-team.de/landesmeisterschaft-einrad-freestyle-2023" class="lm-event" target="_blank" norefferer>
  {% image 'assets/img/logos/unicycle-team.de_.png', 'Logo des Unicycle-Team Harpstedt' %}

### Gemeinsame LM von

- Bremen
- Niedersachsen
- Nordrhein-Westfalen

</a>
</div>
<div class="lm-event-container">
<a href="https://www.einradverband-sh.de/veranstaltungen/2370389/2023/05/12/freestyle-landesmeisterschaft-sh-hh.html" class="lm-event" target="_blank" norefferer>
  {% image 'https://www.einradverband.de/wp-content/webp-express/webp-images/uploads/2023/01/einradverbandsh.jpg.webp', 'Banner Einradverband Schleswig-Holstein' %}

### Gemeinsame LM von

- Hamburg
- Schleswig-Holstein

</a>
</div>
<div class="lm-event-container">
<a href="" class="lm-event" target="_blank" norefferer>
  {% image 'https://www.einradverband.de/wp-content/webp-express/webp-images/uploads/2021/07/freestyle-newsletter-1280x770.jpg.webp', 'Platzhalter Einradbild' %}

### Gemeinsame LM von

- Berlin
- Brandenburg
- Mecklenburg-Vorpommern
- Sachsen
- Sachsen-Anhalt
- Thüringen

</a>
</div>
</div>

## Wir freuen uns auf euch!

:::labeledImage
<span class="labeledImage-label">Teilnehmer der DM 2019</span> {% image "assets/img/pages/Teilnehmer2019.jpg", "Teilnehmer DM 2019" %}
:::

Falls trotzdem Fragen offen bleiben kannst du dich jederzeit an folgende E Mail Adresse wenden: [info@ndmfreestyle23.de](mailto:info@ndmfreestyle23.de).

Bis bald in unserem schönen Luftkurort!
Dein Orga Team vom SSV Nümbrecht
