<script>
  import { selectedPeople_s } from "../store.js";
  export let people;
  let selectedPeople = [];
  let filterText = "";
  $: filteredPeople = people.filter(item =>
    item.name.toLowerCase().includes(filterText.toLocaleLowerCase())
  );
  function onSelectPeople(item) {
    const index = selectedPeople.indexOf(item);
    if (index >= 0) {
      selectedPeople.splice(index, 1);
    } else {
      selectedPeople.push(item);
    }
    selectedPeople = selectedPeople;
    selectedPeople_s.update(n => selectedPeople);
  }
</script>

<style>
  /* The sidebar menu */
  .sidebar {
    height: 100%; /* 100% Full-height */
    width: 335px; /* change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 1; /* Stay on top */
    top: 0;
    left: 0;
    background-color: #111; /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    /*padding-top: 60px;  Place content 60px from the top */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidebar */
  }
  .h-box-sidebar {
    height: calc(100vh - 408px);
    overflow-y: scroll;
  }
</style>

<div id="mySidebar" class="sidebar">
  <nav class="nav">
    <div class="nav-left">
      <img class="nav-brand" src="/img/denali-logo.svg" alt="" />
    </div>
  </nav>

  <div class="box m-4 p-2">
    <div class="input has-icon-front">
      <span
        class="d-icon d-close-circle-solid"
        on:click={() => (filterText = '')} />
      <input type="text" placeholder="Search IMEI" bind:value={filterText} />
    </div>

  </div>
  <div class="box h-box-sidebar m-4">
    <table class="table is-striped">
      <tr>
        <th class="is-light is-italic">Devices online</th>
        <th>
          <span class="chips">{people.length}</span>
        </th>
      </tr>
    </table>

    <table class="table is-striped">
      <tr>
        <th>Index</th>
        <th>Name</th>
        <th>
          Action
          <span
            class={selectedPeople.length > 0 ? 'd-icon is-small d-minus-square': 'd-icon is-small d-check-circle is-graph-green'}
            on:click={()=>{
                
            }}
            />
        </th>
      </tr>
      {#each filteredPeople as item, index}
        <tr>
          <td>
            <h6 class="is-regular">{index + 1}</h6>
          </td>
          <td>
            <h5 class="is-light">{item.name}</h5>
          </td>
          <td>
            <span
              class={selectedPeople.indexOf(item.name) >= 0 ? 'd-icon is-small d-check-circle is-graph-green' : 'd-icon is-small d-minus-square'}
              on:click={() => onSelectPeople(item.name)} />
          </td>
        </tr>
      {/each}

    </table>
  </div>
  <div class="box h-box-sidebar m-4">
    <table class="table is-striped">
      <tr>
        <th class="is-light is-italic">Devices selected</th>
        <th>
          <span class="chips has-bg-graph-green">{selectedPeople.length}</span>
        </th>
      </tr>
    </table>

    <table class="table is-striped">
      <tr>
        <th>Index</th>
        <th>Name</th>
      </tr>
      {#each selectedPeople as item, index}
        <tr>
          <td>
            <h6 class="is-regular">{index + 1}</h6>
          </td>
          <td>
            <h5 class="is-light">{item}</h5>
          </td>
        </tr>
      {/each}
    </table>
  </div>

</div>