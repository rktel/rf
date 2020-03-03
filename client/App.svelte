<script>
  import g from "../imports/tools/log.js";
  import Toolbar from "../imports/ui/Toolbar";
  import Sidebar from "../imports/ui/Sidebar";
  import stream from "../imports/api/streamer";
  import { selectedPeople_s } from "../imports/api/store";
  let people = [];
  let selectedPeople = [];
  const unsubscribe = selectedPeople_s.subscribe(value => {
    selectedPeople = value;
  });
  Meteor.call("getPeopleFromServer", function(error, people_) {
    people = people_;
  });
  stream.on("people", people_ => {
    people = people_;
  });
</script>

<style>
  /* Style page content - use this if you want to push the page content to the right when you open the side navigation */
  #main {
    transition: margin-left 0.5s; /* If you want a transition effect */
    margin-left: 335px;
    /*padding: 20px;*/
  }
  .box-main{
    height: calc(100vh - 70px);
  }
</style>


<div id="main">
  <Toolbar />
  <div>
    {#if selectedPeople.length > 0}
      <div class="box box-main m-4">
        {#each selectedPeople as item, index}
          <li>{item}</li>
        {/each}
      </div>
    {/if}
  </div>
</div>