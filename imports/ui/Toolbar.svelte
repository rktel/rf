<script>
  let sidebarOpen = true;
  /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    if (sidebarOpen) {
      document.getElementById("mySidebar").style.width = "335px";
      //document.getElementById("mySidebar").style.display = "block";
      document.getElementById("main").style.marginLeft = "335px";
    } else {
      document.getElementById("mySidebar").style.width = "0";
      //document.getElementById("mySidebar").style.display = "none";
      document.getElementById("main").style.marginLeft = "0";
    }
  }
</script>

<nav class="nav">
  <div class="nav-left">
    <div class="nav-icon" on:click={toggleSidebar}>
      <i class={sidebarOpen ? 'd-icon d-arrow-left-solid' : 'd-icon d-arrow-right-solid'} />
    </div>
  </div>
  <div class="nav-icon nav-toggle-dropdown">
    <i class="d-icon d-more-vertical" />
  </div>
  <div class="nav-right responsive">
    <div class="nav-item is-active">Home</div>
    <div class="nav-item">Climb</div>
    <div class="nav-item">Contact</div>
    <div class="nav-icon">
      <i class="d-icon d-dashboard" />
    </div>
    <div class="nav-icon">
      <i class="d-icon d-menu-dialpad" />
    </div>
    <div class="nav-icon">
      <i class="d-icon d-user-profile-circle" />
    </div>
  </div>
</nav>