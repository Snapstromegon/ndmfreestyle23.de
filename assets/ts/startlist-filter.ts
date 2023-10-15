const searchField = document.getElementById(
  "startlistSearch"
) as HTMLInputElement;
document.querySelector("#startlistReset")?.addEventListener("click", () => {
  searchField.value = "";
  updateSearch();
});
const rows = document.querySelectorAll("#startlist tbody tr");

const updateSearch = () => {
  const searchValue = searchField?.value.toLowerCase();

  rows.forEach((row) => {
    const cols = row.querySelectorAll("td");
    const shouldShow = [...cols]
      .map((col) => col.innerText)
      .some((text) => text.toLowerCase().includes(searchValue));
    console.log(row, shouldShow);

    if (shouldShow || searchValue === "") {
      row.removeAttribute("hidden");
    } else {
      row.setAttribute("hidden", "hidden");
    }
  });
};

searchField?.addEventListener("input", updateSearch);
