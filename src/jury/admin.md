---
layout: "layouts/page.njk"
tags: ["page"]
---

# Jury Registrierung - Admin

<main>
<form method="post" id="password">
<label>Admin Passwort:</label>
<input type="password" id="pass" value="bewertung">
<input type="submit" value="Laden">
</form>

## Alle Juroren

<table>
<thead>
<tr>
<th>Jurycode</th>
<th>Vorname</th>
<th>Nachname</th>
<th>Team</th>
<th>EMail</th>
<th>Erstellt</th>
<th>Aktualisiert</th>
<th>Registriert für</th>
<th>Löschen</th>
</tr>
</thead>
<tbody id="byUsers">

</tbody>
</table>

## Nach Teams

<table>
<thead>
<tr>
<th>Team</th>
<th># Judges</th>
<th>Details</th>
</tr>
</thead>
<tbody id="byTeams">

</tbody>
</table>

## Nach Kategorien

<table>
<thead>
<tr>
<th>Kategorie</th>
<th>Gruppe</th>
<th># Judges</th>
<th># Judges P</th>
<th># Judges T</th>
<th># Judges A</th>
<th># Erf. Judges</th>
<th>Details</th>
</tr>
</thead>
<tbody id="byCategoryGroup">

</tbody>
</table>

## Gelöschte Nutzer

<table>
<thead>
<tr>
<th>Jurycode</th>
<th>Vorname</th>
<th>Nachname</th>
<th>Team</th>
<th>EMail</th>
<th>Erstellt</th>
<th>Aktualisiert</th>
<th>Registriert für</th>
<th>Restore</th>
</tr>
</thead>
<tbody id="deletedUsers">

</tbody>
</table>
</main>

<style>

  h1, h2, table {
    margin-block: 1em;
  }
.tag {
  display: inline-block;
  text-align: center;
  padding: .2rem .2rem;
  border: 1px solid;
  --hue: 0;
  --sat: 50%;
  background: hsl(var(--hue), var(--sat), 25%);
  font-size: .75rem;
}

.tag.c-EM {
  --hue: 60;
}
.tag.c-EW {
  --hue: 120;
}
.tag.c-P {
  --hue: 180;
}
.tag.c-K {
  --hue: 240;
}
.tag.c-G {
  --hue: 300;
}
.tag.g-JE {
  --sat: 33%
}
.tag.g-E {
  --sat: 66%
}
.tag.g-SE {
  --sat: 100%
}
</style>

<script type="module">
  const getUserTags = (user) => {
    let result = "";
    for(const [key, types] of Object.entries(user.judges)) {
      const [category, group] = key.split("/")
      const cTag = category.split("-").map(s => s[0].toUpperCase()).join("")
      const gTag = group.split("-").map(s => s[0].toUpperCase()).join("")
      result +=`<div class="tag c-${cTag} g-${gTag}">${cTag}/${gTag}<br>
      ${types.map(s => s.toUpperCase()).join(",")}</div>`
    }
    return result;
  }

  const renderByUsers = (data) => {
    const byUsers = document.querySelector("#byUsers");
    byUsers.innerHTML = data.map(user => `<tr>
      <td>${user.jurycode}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.team}</td>
      <td>${user.email}</td>
      <td>${user.created_at}</td>
      <td>${user.updated_at}</td>
      <td>${getUserTags(user)}</td>
      <td><form action="{{db.domain}}delete/${user.jurycode}" method="post"><input type="submit" value="Löschen"></form></td>
    </tr>`).join("\n")
  }

  const groupByTeams = (users) => {
    const teams = new Map();
    for(const user of users) {
      if (!teams.has(user.team)) {
        teams.set(user.team, []);
      }
      teams.get(user.team).push(user)
    }
    return teams;
  }

  const renderByTeams = (data) => {
    const byTeams = document.querySelector("#byTeams")
    const usersByTeams = groupByTeams(data);
    let result = "";
    for(const [team, users] of usersByTeams.entries()) {
      result+= `<tr><td rowspan=${users.length}>${team}</td><td rowspan=${users.length}>${users.length}</td><td>
      <details><summary>Juroren</summary>
      <table><thead><tr>
        <th>Jurycode</th>
        <th>Vorname</th>
        <th>Nachname</th>
        <th>EMail</th>
        <th>Registriert für...</th>
      </tr></thead><tbody>`;
      for(const user of users) {
        result += `<tr>
      <td>${user.jurycode}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.email}</td>
      <td>${getUserTags(user)}</td>
    </tr>`
      }
      result += "</tbody></table></details></tr>"
    }

    byTeams.innerHTML = result;

  }

  const groupUsersByCategoryGroup = (users) => {
    const cats = new Map();
    for(const user of users){
      for(const [catGroup, types] of Object.entries(user.judges)){
        const [cat,group] = catGroup.split("/");
        if(!cats.has(cat)) {
          cats.set(cat, new Map())
        }
        const groups = cats.get(cat)
        if(!groups.has(group)) {
          groups.set(group, {
            users: [],
            byType: new Map()
          })
        }
        groups.get(group).users.push(user)
        const byTypeMap = groups.get(group).byType;
        for(const type of user.judges[catGroup]) {
          if(!byTypeMap.has(type)){
            byTypeMap.set(type, [])
          }
          byTypeMap.get(type).push(user)
        }
      }
    }
    return cats
  }

  const renderByCategoryGroups = (users) => {
    const byCategoryGroup = document.querySelector("#byCategoryGroup")
    const grouped = groupUsersByCategoryGroup(users)
    let result = "";
    for(const [cat, groups] of grouped.entries()) {
      [...groups.entries()].forEach(([group, details], i) => {
        result += `<tr>
          <td>${i==0?cat:""}</td>
          <td>${group}</td>
          <td>${details.users.length}</td>
          <td>${details.byType.get("p")?.length || 0}</td>
          <td>${details.byType.get("t")?.length || 0}</td>
          <td>${details.byType.get("a")?.length || 0}</td>
          <td>${details.byType.get("erf")?.length || 0}</td>
          <td>
            <details>
              <summary>Juroren</summary>
              <table>
                <thead>
                  <tr>
                    <th>Jurycode</th>
                    <th>Vorname</th>
                    <th>Nachname</th>
                    <th>EMail</th>
                    <th>Registriert für...</th>
                  </tr>
                </thead>
                <tbody>
                  ${details.users.map(user => `<tr>
                    <td>${user.jurycode}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.email}</td>
                    <td>${getUserTags(user)}</td>
                  </tr>`).join("\n")}
                </tbody>
              </table>
            </details>
          </td>
      </tr>`
      })
    }
    byCategoryGroup.innerHTML = result;
  }

  const renderData = (data )=> {
    renderByUsers(data)
    renderByTeams(data)
    renderByCategoryGroups(data)
  }

  const loadData = async (password) => {
    const passwordEncoded = new URLSearchParams();
    passwordEncoded.append("password", password)
    const resp = await fetch("{{db.domain}}list", {
      method: "POST",
      mode: "cors",
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: passwordEncoded
    });
    const data = await resp.json();
    console.log(data)
    renderData(data)
  }

  const loadDeleted = async (password) => {
    const passwordEncoded = new URLSearchParams();
    passwordEncoded.append("password", password)
    const resp = await fetch("{{db.domain}}listDeleted", {
      method: "POST",
      mode: "cors",
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: passwordEncoded
    });
    const data = await resp.json();
    console.log(data)
    const byUsers = document.querySelector("#deletedUsers");
    if(data){

      byUsers.innerHTML = data.map(user => `<tr>
      <td>${user.jurycode}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.team}</td>
      <td>${user.email}</td>
      <td>${user.created_at}</td>
      <td>${user.updated_at}</td>
      <td>${getUserTags(user)}</td>
      <td><form action="{{db.domain}}restore/${user.jurycode}" method="post"><input type="submit" value="Restore"></form></td>
    </tr>`).join("\n")
    }
  }

  document.querySelector("#password").addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.querySelector("#pass").value;
    loadData(password);
    loadDeleted(password);
    return false;
  })
</script>
