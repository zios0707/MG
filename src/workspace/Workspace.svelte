<script lang="ts">
    import { authStatus, AuthStatus, log, user, } from '../store.ts'
    import ChannelBar from './parts/channel/ChannelBar.svelte'
    import Info from './parts/info/Info.svelte'
    import Frame from '../workspace/main/Frame.svelte'
    import Login from '../workspace/auth/Login.svelte'
    import MyPage from '../workspace/auth/MyPage.svelte'
    import SignUp from '../workspace/auth/SignUp.svelte'

    let count = 0;

    let beforeId = null;

    $ : {
        $log;
        count++;
        console.log("log가 쌓이는 중 !", count)
        console.log($log)

        if ($user) {
            if (count > 10) {

                saveLog()
            }else {
                if (beforeId) clearTimeout(beforeId);

                // 2분
                if ($log.length > 0) beforeId = setTimeout(saveLog, 1000 * 60 * 2)
            }
        }
    }

    const saveLog = () => {
        try {
            const res = fetch('http://localhost:8081/projects/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: $user.accountId,
                    logs: [
                        ...$log,
                    ]
                })
            })

            count = 0;
            $log = [];
        }catch (e) {
            console.error('Project save error:', e);
        }
    }
</script>

<div id="workspace">
    <ChannelBar/>
    <div id="wall1"></div>
    <Info/>
    <div id="wall2"></div>
    <Frame/>
</div>

{#if $authStatus}
    <div id="auth">
        {#if $authStatus === AuthStatus.SIGNUP}
            <SignUp/>
        {:else if $authStatus === AuthStatus.MY_PAGE}
            <MyPage/>
        {:else if $authStatus === AuthStatus.LOGIN}
            <Login/>
        {/if}
    </div>
{/if}

<style>
    #workspace {
        width: 100%;
        height: calc(100% - 50px);

        padding-top: 50px;

        background: #444444;
    }

    #wall1 {
        width: 5px;
        height: 100%;
        z-index: 10;

        left: 120px;

        display: inline-block;

        position: fixed;

        background: #444444;
    }

    #wall2 {
        width: 5px;
        height: 100%;
        z-index: 10;

        left: 295px;

        display: inline-block;

        position: fixed;
        background: #444444;
    }

    /* 분리선 */

    #auth {
        position: fixed;

        display: flex;
        justify-content: center;
        align-items: center;

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }

</style>