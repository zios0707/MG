<script>
    import { channel } from '../../../store.ts'
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let rotation = tweened(0, { duration: 130, easing: cubicOut });

    let openList = false;

    let useInst = {
        name: "피아노",
        value: "piano"
    }
    let insts = [
        {
            name: "피아노",
            value: "piano"
        },
        {
            name: "멀티 신스",
            value: "multi-synth"
        },
        {
            name: "모노 신스",
            value: "mono-synth"
        },
        {
            name: "플럭 신스",
            value: "pluck-synth"
        },
        {
            name: "드럼",
            value: "drum"
        }
    ]

    function toggleList(e) {
        if (openList) rotation.set(0)
        else rotation.set(180)

        openList = !openList;

        if (e.currentTarget.dataset.value) {
            useInst = insts.find(inst => inst.value === e.currentTarget.dataset.value)
        }
    }

    let filled;

    // 이미 컴포넌트로 구현돼있다는 사실? https://tonejs.github.io/docs/15.0.4/classes/Channel.html
</script>

<div id="info">
    {#if $channel?.trackId !== undefined}
        <div id="status"></div>
        <input type="text" id="name" autocomplete="off"
               on:click={(e) => e.stopPropagation()}
               on:blur={(e) => channel.update(chan => {
                   chan.name = e.target.value
                   return chan;
               })}
               value={$channel.name}
        >
        <hr/>
        <div id="slide">
            <span id="bar"
                  on:click={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newVolume = Math.max(7, Math.min(120, Math.round((clickX / rect.width) * 127))) - 7;

                      filled.style.width = `${newVolume}px`;

                      channel.update(chan => {
                          chan.volume = Math.max(-60, Math.min(6, Math.round(newVolume / 114 * 66) - 60 ));
                          return chan;
                      });
                  }}
            >
                <span id="filled" bind:this={filled}></span>
                <span id="slider"></span>
            </span>
            <span id="volume">
                {$channel.volume} db
            </span>
        </div>
        <div id="buttons">
            <button
                    id="mute"
                    class:on={$channel.mute}
                    on:click={() => $channel.mute = !$channel.mute}
            >
                {#if $channel.mute}
                    <object type="image/svg+xml" data="/icons/mdi_alphabet-m-red.svg"></object>
                {:else}
                    <object type="image/svg+xml" data="/icons/mdi_alphabet-m.svg"></object>
                {/if}
            </button>
            <button
                    id="solo"
                    class:on={$channel.solo}
                    on:click={() => $channel.solo = !$channel.solo}
            >

                {#if $channel.solo}
                    <object type="image/svg+xml" data="/icons/mdi_alphabet-s-blue.svg"></object>
                {:else}
                    <object type="image/svg+xml" data="/icons/mdi_alphabet-S.svg"></object>
                {/if}
            </button>
        </div>
        <div id="instList">
            <div class="block"
                 id="top"
                 on:click={toggleList}
            >
                <div style="width: 25px"></div>
                <span class="txt">{useInst.name}</span>

                <div id="drop">
                    <object type="image/svg+xml" data="/icons/fe_drop-down.svg"
                            style="transform: rotate({$rotation}deg);"
                    ></object>
                </div>
            </div>
            {#if openList}
                {#each insts as inst}
                    <div class="block" data-value={inst.value}
                         on:click={toggleList}
                    >
                        <span class="txt">{inst.name}</span>
                    </div>
                {/each}
            {/if}
        </div>
        <hr/>
    {/if}
</div>

<style>
    #info {
        width: 160px; /* 170 - 10 */
        height: 100%;
        z-index: 9;

        padding: 5px;

        margin-left: 125px;

        position: fixed;

        background: #4f4f4f;
    }

    #status {
        height: 10px;
        width: 160px;

        background: #00ff0031;

        box-shadow: inset 0 0 0 2px #00ff0080;
    }

    #info > input {
        height: 100px;
        width: 160px;

        text-align: left;
        vertical-align: top;

        font-size: 20px;
        color: white;
        font-weight: 700;

        border: transparent;
        background: transparent;
    }

    hr {
        height: 0;
        width: 160px;

        margin: 5px 0 5px 0;

        border: 1px solid #ffffff;
    }

    /* SLIDE */

    #slide {
        width: 160px;

        margin: 10px 0 5px 0;

        display: flex;
    }

    #bar {
        height: 15px;
        width: 127px;

        display: flex;

        background: #d9d9d9;
    }

    #filled {
        height: 100%;
        width: 0;

        background: #999999;
    }

    #slider {
        height: 100%;
        width: 14px;

        background: #a9a9a9;
    }

    #volume {
        color: #ffffff;

        font-size: 10px;
        font-weight: 700;
    }

    /* BUTTONS */

    #buttons {
        width: 150px;
        padding: 10px 5px 10px 5px;

        display: flex;
        justify-content: space-between;
    }

    #buttons > button {
        height: 60px;
        width: 65px;

        display: inline-flex;
        align-items: center;
        justify-content: center;

        background: #d9d9d9;
    }

    #buttons > button.on {

        background: #aaaaaa;
    }

    button * {
        pointer-events: none;
    }

    /* LIST */

    #instList {
        height: 25px;
        width: 160px;

        margin: 10px 0 5px 0;

        display: flex;
        flex-direction: column;
    }

    .block {
        width: 160px;
        height: 25px;

        display: flex;
        justify-content: center;
        align-content: center;

        background: #d9d9d9;
    }

    .block#top {

        justify-content: space-between;
    }

    .txt {
        height: 25px;

        padding-top: 7px;

        text-align: center;
        font-size: 12px;
        font-weight: 700;
    }

    object {
        user-select: none;
        pointer-events: none;
    }
</style>