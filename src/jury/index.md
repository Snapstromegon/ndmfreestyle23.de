---
layout: "layouts/page.njk"
eleventyNavigation:
  icon: gavel
  key: Jury Anmeldung
  order: 7
  parent: more
tags: ["page"]
---

# Jury Registrierung

<div id="saved_jurycode" hidden>

## Dein Jurycode:

## <span id="show_jurycode"></span>

Diesen Code brauchst du, um deine Anmeldung in Zukunft zu ändern. Schreib ihn dir bitte auf!

</div>

## Angaben Ändern

Falls du deine vorher gemachten Angaben ändern möchtest, gib hier deinen Jurycode ein.

<form method="post" id="loadExisting">
<label>6-stelliger Jurycode</label>
<input id="load_jurycode"><br>
<input type="submit" value="Daten Laden">

<script type="module">
  const loadForm = document.querySelector("#loadExisting");
  const jurycodeInput = document.querySelector("#load_jurycode");
  const loadData = async () => {

    const jurycode = jurycodeInput.value
    try {

      const response = await fetch(`{{db.domain}}get/${jurycode}`)
    const data = await response.json();
    if(data) {
      console.log(data)
      document.querySelector("[name=firstname]").value=data.firstname;
      document.querySelector("[name=lastname]").value=data.lastname;
      document.querySelector("[name=email]").value=data.email;
      document.querySelector("[name=team]").value=data.team;
      document.querySelector("[name=jurycode]").value=data.jurycode;
      for(const checkbox of document.querySelectorAll("input[type=checkbox]")) {
        const parts = checkbox.name.split(".");
        if(parts[0] == "judges") {
          if(data.judges[parts[1]]?.includes(parts[2])) {
            checkbox.checked = true;
          }else {
            checkbox.checked = false;
          }
        }
      }
    } else {
      alert(`Jurycode ${jurycode} ist ungültig!`)
    }
    } catch(e) {
      alert(`Fehler beim Laden der Daten für Jurycode ${jurycode}`)
    }

  }
  loadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loadData();
    return false;
  });
  const presetJurycode = new URLSearchParams(window.location.search).get("jurycode");
  if(presetJurycode) {
    jurycodeInput.value = presetJurycode;
    document.querySelector("#show_jurycode").innerText = presetJurycode;
    document.querySelector("#saved_jurycode").hidden = false;
    
    // loadData();
  }
</script>

</form>

## Persönliche Angaben

<style>

#saved_jurycode {
  color: #f44;
  background: #333;
  text-align: center;
  padding: 1rem;
  font-weight: bolder;
}

table {
  border-collapse: collapse;
}
td, th {
  padding: .5rem;
  text-align: center;
}

tr:nth-child(even) {
  background: #0002;
}

h1, h2, h3, p, table {
  margin-block: 1em;
}

fieldset {
  width: 50%;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: .5rem;
  border: none;
}

input {
  padding: .5rem;
}

</style>

<form method="post" action="{{db.domain}}save">
<fieldset>
  <label for="vorname">Vorname</label>
  <input id="vorname" name="firstname" required/>
  <label for="nachname">Nachname</label>
  <input id="nachname" name="lastname" required/>
  <label for="verein">Verein</label>
  <input id="verein" name="team" placeholder="Name des Vereins, für den man als Jurymitglied antritt" required/>
  <label for="email">Email</label>
  <input id="email" type="email" name="email" required/>
  <input id="jurycode" type="text" name="jurycode" value="" hidden/>
</fieldset>

Kreuze in der unten stehenden Tabelle an, was du werten möchtest.

<table>
<thead>
  <tr>
    <th>Kategorie</th>
    <th>Gruppe</th>
    <th>Altersklassen</th>
    <th>Präsentation</th>
    <th>Tricks</th>
    <th>Abstiege</th>
    <th>Juryerfahrung</th>
  </tr>
</thead>
<tbody>
{% for kategorie in kategorien %}
{% for gruppe in kategorie.gruppen %}
<tr>
<td>{{kategorie.name}}</td>
<td>{{gruppe.name}}</td>
<td>{{gruppe.altersklassen | join(", ")}}</td>
<td><input name="judges.{{kategorie.name|slugify}}/{{gruppe.name|slugify}}.p" type="checkbox"></td>
<td><input name="judges.{{kategorie.name|slugify}}/{{gruppe.name|slugify}}.t" type="checkbox"></td>
<td><input name="judges.{{kategorie.name|slugify}}/{{gruppe.name|slugify}}.a" type="checkbox"></td>
<td><input name="judges.{{kategorie.name|slugify}}/{{gruppe.name|slugify}}.erf" type="checkbox"></td>
</tr>
{% endfor %}
{% endfor %}
</tbody>
</table>

<input type="submit" value="Speichern">

</form>
