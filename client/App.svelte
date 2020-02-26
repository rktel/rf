<script>
  import rstream from "../imports/api/streamers.js";
  import g from "../imports/tools/log.js";

  let mobiles = [];
  let selectedList = [];
  let searchMobile = "";
  rstream.on("getMobilesFromServer", mobiles_ => {
    mobiles = mobiles_;
  });
  $: filteredList = mobiles.filter(
    item =>
      item.mobileID.toLowerCase().indexOf(searchMobile.toLocaleLowerCase()) !==
      -1
  );
  function toogleSelectedList(mobileID) {
      g(mobileID)
  }
</script>

<div class="flex">
  <div class="box">
    <div class="input-group has-button">
      <div class="input">
        <input
          type="text"
          placeholder="Filter text"
          bind:value={searchMobile} />
      </div>
      <button
        class="button is-primary has-icon"
        on:click={() => (searchMobile = '')}>
        <i class="d-icon d-stop-warning is-small" />
      </button>
    </div>
    <br />
    <table class="table">
      <tr>
        <th>IMEI</th>
        <th>Action</th>
      </tr>
      {#each filteredList as item}
        <tr>
          <td>{item.mobileID}</td>
          <td>
            <button
              class="button is-solid is-small"
              on:click={() => toogleSelectedList(item.mobileID)} />
          </td>
        </tr>
      {/each}
    </table>
  </div>

  <div class="box">
    <table class="table">
      <tr>
        <th>IMEI</th>
      </tr>
      {#each selectedList as mobileID}
        <tr>
          <td>{mobileID}</td>
        </tr>
      {/each}
    </table>
  </div>
  <div class="box flex-auto">Flex Auto</div>
</div>
