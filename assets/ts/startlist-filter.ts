const searchField = document.getElementById(
  "startlistSearch"
) as HTMLInputElement;
const rows = document.querySelectorAll("#startlist tbody tr");

const updateSearch = () => {
  const searchValue = searchField?.value.toLowerCase();

  location.hash = new URLSearchParams({
    search: searchField?.value,
  }).toString();

  rows.forEach((row) => {
    const cols = row.querySelectorAll("td");
    const shouldShow = [...cols]
      .map((col) => col.innerText.toLowerCase())
      .some((text) => text.includes(searchValue));

    if (shouldShow || searchValue === "") {
      row.removeAttribute("hidden");
    } else {
      row.setAttribute("hidden", "hidden");
    }
  });

  if (searchValue.trim() === "") {
    document.querySelector(".startlist-filter")?.classList.add("hide-print");
  } else {
    document.querySelector(".startlist-filter")?.classList.remove("hide-print");
  }
};

searchField?.addEventListener("input", updateSearch);
document.querySelector("#startlistReset")?.addEventListener("click", () => {
  searchField.value = "";
  updateSearch();
});
document.querySelector("#shareSearch")?.addEventListener("click", () => {
  navigator
    .share({
      text: `Hier sind die Starts für die NDM 2023 für ${searchField?.value}`,
      title: "NDM 2023 Startliste",
      url: location.href,
    })
    .catch(console.error);
});

if (location.hash) {
  const params = new URLSearchParams(location.hash.slice(1));
  const search = params.get("search");
  if (search) {
    searchField.value = search;
    document.addEventListener("DOMContentLoaded", updateSearch);
    updateSearch();
  }
}
