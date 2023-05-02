# Design Guide

<style>
:root {
  --color-blue: #003049;
  --color-red: #d12727;
  --color-yellow: #fcbf49;
  --color-blue-light: #367ba0;
  --color-background: hsl(201deg 5% 95%);
  --color-background-nuanced: hsl(201deg 5% 85%);
  --color-background-secondary: hsl(201, 5%, 10%);
  --color-middle-gray: hsl(201deg 5% 50%);
  --text-color: hsl(201, 5%, 10%);
  --text-color-sidebar: hsl(201deg 5% 85%);
}

body{
  -webkit-print-color-adjust:exact !important;
  print-color-adjust:exact !important;
}

img, svg {
  max-width: 100%;
}

.square {
  aspect-ratio: 1 / 1;
  height: 1rem;
  display: inline-block;
}

@media print {
  .break { 
    page-break-before: always;
  }
}
</style>

## Farben

Wir verwenden die folgenden Farben:

### Hauptfarben

- <div class="square" style="background: var(--color-blue)"></div> #003049 "ODM Blau"
- <div class="square" style="background: var(--color-red)"></div> #d12727  "ODM Rot"
- <div class="square" style="background: var(--color-yellow)"></div> #fcbf49 "ODM Gelb"

"ODM Blau" darf als Hintergrundfarbe genutzt werden.

"ODM Rot" und "ODM Gelb" sollten als Hintergrundfarbe vermieden werden, außer es handelt sich um Warnungen.

Werden alle drei Hauptfarben zusammen genutzt (zum Beispiel als Trenner), so ist "ODM Rot" IMMER in der Mitte.
In diesem Falle ist es zu bevorzugen, dass die Farben in der Leserichtung Oben nach Untern, Links nach Rechts in der Reihenfolge "ODM Blau", "ODM Rot", "ODM Gelb" vorkommen.

#### Richtig

<div class="square" style="background: var(--color-blue)"></div><div class="square" style="background: var(--color-red)"></div><div class="square" style="background: var(--color-yellow)"></div>

<div class="square" style="background: var(--color-yellow)"></div><div class="square" style="background: var(--color-red)"></div><div class="square" style="background: var(--color-blue)"></div>

#### Falsch

<div class="square" style="background: var(--color-blue)"></div><div class="square" style="background: var(--color-yellow)"></div><div class="square" style="background: var(--color-red)"></div>

<div class="square" style="background: var(--color-yellow)"></div><div class="square" style="background: var(--color-blue)"></div><div class="square" style="background: var(--color-red)"></div>

### Auf hellem Untergrund

- <div class="square" style="background: var(--text-color)"></div> #181a1b "Textfarbe"
- <div class="square" style="background: var(--color-background)"></div> #f2f2f3 "Hintergrund" (Darf auf Papier durch rein weiß '#ffffff' ersetzt werden)
- <div class="square" style="background: var(--color-background-nuanced)"></div> #d7d9dB "Hintergrund Nuanciert"

### Auf dunklem Untergrund

- <div class="square" style="background: var(--text-color-sidebar)"></div> #d7d9dB "Textfarbe"
- <div class="square" style="background: var(--color-background-secondary)"></div> #181a1b "Hintergrund"

<div class="break"></div>

## Logo

Das Logo existiert in drei Varianten:

### Hell

Dies ist unser "Standardlogo". Wenn es keinen Grund gibt eine Andere Variante zu nutzen, nutzen wir dieses Logo.
Wir versuchen das Logo auf "ODM Blau" zu platzieren und ringsrum einen Rahmen von mindestens einer doppelten Schrifthöhe Platz zu anderen Elementen zu lassen.

Wir bevorzugen "ODM Blau", damit unsere drei Hauptfarben zusammen erscheinen und unsere "Marke" einfach wiederzuerkennen ist.

<div style="background: var(--color-blue);padding: 2rem;width: 15rem">

![](../assets/img/logo_light.svg)

</div>

<div class="break"></div>

### Dunkel mit Schatten

Auf hellen oder transparenten Hintergründen verwenden wir standardmäßig das helle Logo mit Schatten.
Der Schatten verankert das Logo im Raum und stellt eine Basis für das Logo.

<div style="background: var(--color-background);padding: 2rem;width: 15rem">

![](../assets/img/logo_dark_with_shadow.svg)

</div>

### Dunkel

Das Dunkle Logo verwenden wir auf hellen oder transparenten Hintergründen, auf denen der Schatten störend wäre.

<div style="background: var(--color-background);padding: 2rem;width: 15rem">

![](../assets/img/logo_dark.svg)

</div>

<div class="break"></div>

## Ecken

Unser Design hat Ecken. Ecken werden bei uns nicht abgerundet.

### Richtig

<div class="square" style="background: var(--color-background); height: 10rem; padding:2rem;">
<div class="square" style="background: var(--color-blue); height: 10rem;"></div>
</div>

### Falsch

<div class="square" style="background: var(--color-background); height: 10rem; padding:2rem;">
<div class="square" style="background: var(--color-blue); height: 10rem; border-radius: 1rem;"></div>
</div>

<div class="break"></div>

## Winkel

Wir halten uns allgemein an 90° Winkel.

Als stilistisches Element darf ein 7° Winkel für die Farbreihenfolge "ODM Blau", "ODM Rot", "ODM Gelb" genutzt werden.

### Richtig

<div class="square" style="height: 10rem;background: linear-gradient(97deg, var(--color-blue) calc(50% - 1rem), var(--color-red) 0, var(--color-red) calc(50% + 0rem), var(--color-yellow) 0, var(--color-yellow) calc(50% + 1rem), var(--color-background) 0)"></div>
<div class="square" style="height: 10rem;background: linear-gradient(-187deg, var(--color-blue) calc(50% - 1rem), var(--color-red) 0, var(--color-red) calc(50% + 0rem), var(--color-yellow) 0, var(--color-yellow) calc(50% + 1rem), var(--color-background) 0)"></div>

(In Ausnahmefällen:)
<div class="square" style="height: 10rem;background: linear-gradient(83deg, var(--color-background) calc(50% - 1rem), var(--color-yellow) 0, var(--color-yellow) calc(50% + 0rem), var(--color-red) 0, var(--color-red) calc(50% + 1rem), var(--color-blue) 0)"></div>

### Falsch

<div class="square" style="height: 10rem;background: linear-gradient(200deg, var(--color-blue) calc(50% - 1rem), var(--color-red) 0, var(--color-red) calc(50% + 0rem), var(--color-yellow) 0, var(--color-yellow) calc(50% + 1rem), var(--color-background) 0)"></div>

## Icons

Für Icons verwenden wir [Google Material Icons](https://fonts.google.com/icons), möglichst in gefüllter Form.

## Schriftart

Als Schriftart verwenden wir die variable Schriftart [Mona Sans](https://github.com/mona-sans).

<div class="break"></div>

## Rahmen

Wir verwenden normal keine Rahmen.
In Dokumenten, die von Teilnehmern oder in großer Stückzahl gedruckt werden, dürfen Hintergrundfarben durch Rahmen ersetzt werden.

### Richtig

<div class="square" style="background: var(--color-background); height: 10rem; padding:2rem;">
<div class="square" style="background: var(--color-blue); height: 10rem;"></div>
</div>

Für Druck:
<div class="square" style="background: var(--color-background); height: 10rem; padding:2rem;">
<div class="square" style="border: .3rem solid var(--color-red); height: 10rem;"></div>
</div>

### Falsch

<div class="square" style="background: var(--color-background); height: 10rem; padding:2rem;">
<div class="square" style="background: var(--color-blue);border: .3rem solid var(--color-red); height: 10rem;"></div>
</div>
