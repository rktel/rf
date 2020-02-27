<script>
  import rstream from "../imports/api/streamers.js";
  import g from "../imports/tools/log.js";

  let mobiles = [];
  let selectedList = [];
  let searchMobile = "";
  let commandText = "";
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
  function sendCommand() {
    if (commandText.length > 0 && selectedList.length > 0) {
      selectedList.map(item => rstream.emit("writeCommand", item, commandText));
    }
  }
</script>

<div class="flex">
  <!--b>LIST DEVICES</b-->
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
              class="button is-small"
              class:is-solid={selectedList.indexOf(item.mobileID) !== -1}
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

  <!--b>LIST SELECTED DEVICES</b-->
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
  <!--b>ACTIONS SEND MESSAGE AND START TASK</b-->
  <div class="box flex-auto">
    <div class="input-group has-button">
      <div class="input">
        <input type="text" placeholder="Command" bind:value={commandText} />
      </div>
      <button
        class="button is-primary has-icon"
        on:click={() => (commandText = '')}>
        <i class="d-icon d-stop-warning is-small" />
      </button>
      <button
        class="button has-bg-lime-700 has-icon"
        on:click={sendCommand}>
        <i class="d-icon d-send is-small" />
      </button>
      <button
        class="button has-bg-orange-500 has-icon"
        on:click={() => alert('Send Script')}>
        <i class="d-icon d-assignment-text is-small" />
      </button>
    </div>
  </div>
</div>
