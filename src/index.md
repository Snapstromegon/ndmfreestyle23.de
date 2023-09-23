---
eleventyNavigation:
  icon: home
  key: Start
  order: 1
fullHeader: true
layout: "layouts/page.njk"
tags: ["page"]
---

:::warningBox
**T-Shirt Bestellungen sind jetzt über die Vereine möglich.**
Nähere Informationen wurden an die Verantwortlichen aller Vereine per Mail geschicht.
:::

:::warningBox
**Zahlungsaufforderungen sind verschickt!**
Wir haben die Zahlungsaufforderungen für die Startgebühren (ohne T-Shirts) an die Verantwortlichen der Vereine geschickt. Sollte euer Verein **KEINE** Zahlungsaufforderung erhalten haben, meldet euch bitte umgehend bei [kasse@ndmfreestyle23.de](mailto:kasse@ndmfreestyle23.de).

Wir nehmen die Zahlungen **nur Vereinsweise** entgegen.

**Zahlungsfrist ist der 29.09.2023!**
:::


# Hallo!

Nach der ODM 2016 und der DM 2019 freuen wir uns als SSV Nümbrecht 2023 wieder eine Meisterschaft in unserem schönen Luftkurort ausrichten zu dürfen. Dieses mal ist es die **Norddeutsche Meisterschaft im Freestyle**.

<div class="logo-line">
<a target="_blank" rel="norefferer" href="https://www.ssvnuembrecht-turnen.de/index.php/abteilungen/einradfahren">{% image "assets/img/logos/ssv.png", "Logo SSV Nümbrecht Turnen 2010 e.V." %}</a>
<a target="_blank" rel="norefferer" href="https://einrad-bdr.de/">{% image "assets/img/logos/bdr.png", "Logo BDR" %}</a>
<a target="_blank" rel="norefferer" href="https://www.einradverband.de/">{% image "assets/img/logos/evd.webp", "Logo EVD" %}</a>
<a target="_blank" rel="norefferer" href="https://rkbsoli.org/sportwelten/einradfahren-nach-iuf/">{% image "assets/img/logos/rkb.png", "Logo RKB" %}</a>
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
    color: var(--text-color-sidebar);
    text-decoration: none;
    overflow: hidden;
    height: 100%;
    --dot-size: 0.05rem;
    --dot-space: var(--s);
    background:
      radial-gradient(farthest-corner at 0 0, var(--color-background-secondary) 66%, transparent),
      radial-gradient(circle at center, var(--color-blue-light) var(--dot-size), transparent var(--dot-size)),
      var(--color-background-secondary);
    background-size: cover, var(--dot-space) var(--dot-space), cover;
    box-shadow: 0rem var(--xxs) var(--s) var(--color-middle-gray);
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

  @container lm-card (max-width: 22rem) {
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
  {% image 'assets/img/logos/herpstedt-logo.jpg', 'Logo des Unicycle-Team Harpstedt' %}

### Gemeinsame LM von

- Bremen
- Niedersachsen
- Nordrhein-Westfalen

</a>
</div>
<div class="lm-event-container">
<a href="https://www.einradverband-sh.de/veranstaltungen/2370389/2023/05/12/freestyle-landesmeisterschaft-sh-hh.html" class="lm-event" target="_blank" norefferer>
  {% image 'assets/img/logos/einradverbandsh.jpg.webp', 'Banner Einradverband Schleswig-Holstein' %}

### Gemeinsame LM von

- Hamburg
- Schleswig-Holstein

</a>
</div>
<div class="lm-event-container">
<a href="https://einradtruppe.de/meisterschaften/" class="lm-event" target="_blank" norefferer>
  {% image 'assets/img/logos/logo-hinten-speichen-klein.jpg', 'Logo Einradtruppe Fredersdorf' %}

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
