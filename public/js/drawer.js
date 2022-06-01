let drawerBlank = document.querySelector("#drawer");
if (drawerBlank) {
  drawerBlank.innerHTML = /*html*/ `
    <div class="user-drawer-background" onclick="hideDrawer()"></div>
    <div class="user-drawer">
      <div class="drawer-content px-3">
    `;
}