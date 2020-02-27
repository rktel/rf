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
    const index = selectedList.indexOf(mobileID);
    if (index !== -1) {
      selectedList.splice(index, 1);
    } else {
      selectedList.push(mobileID);
    }
    selectedList = selectedList;
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
              class="button is-small" class:is-danger={selectedList.indexOf(item.mobileID) !== -1}
              on:click={() => toogleSelectedList(item.mobileID)}>
              {#if selectedList.indexOf(item.mobileID) !== -1}
                <i class="d-icon d-arrow-block-left is-small" />
              {:else}
                <i class="d-icon d-arrow-block-right is-small" />
              {/if}
            </button>
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
