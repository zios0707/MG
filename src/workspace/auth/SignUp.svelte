<script lang="ts">
    import { authStatus, AuthStatus, user, isLoading } from '../../store.ts'
    import { createEventDispatcher } from 'svelte';
    import { authService } from '../../api/authService.js';

    const dispatch = createEventDispatcher();

    let username = '';
    let password = '';
    let confirmPassword = '';
    let error = '';

    async function onSubmit(event: Event) {
        event.preventDefault();
        error = '';

        if (!username || !password || !confirmPassword) {
            error = '모든 필드를 입력해 주세요.';
            return;
        }

        if (password !== confirmPassword) {
            error = '비밀번호가 일치하지 않습니다.';
            return;
        }

        try {
            $isLoading = true;
            const userData = await authService.signUp(username, password);
            $user = {accountId: userData.accountId, password: password};
            $authStatus = AuthStatus.MY_PAGE;
        } catch (err) {
            error = err.message || '회원가입 중 오류가 발생했습니다.';
        } finally {
            $isLoading = false;
        }
    }

    function onCancel() {
        $authStatus = AuthStatus.NONE;
    }
</script>

<div id="signup">
    <form on:submit={onSubmit}>
        {#if error}
            <p class="error">{error}</p>
        {/if}

        <label for="username">아이디</label>
        <input
                id="username"
                type="text"
                bind:value={username}
                placeholder="아이디를 입력하세요"
                disabled={$isLoading}
        />

        <label for="password">비밀번호</label>
        <input
                id="password"
                type="password"
                bind:value={password}
                placeholder="비밀번호를 입력하세요"
                disabled={$isLoading}
        />

        <label for="confirmPassword">비밀번호 재확인</label>
        <input
                id="confirmPassword"
                type="password"
                bind:value={confirmPassword}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={$isLoading}
        />

        <button type="submit" disabled={$isLoading}>
            {#if $isLoading}
                로딩 중...
            {:else}
                회원가입
            {/if}
        </button>
    </form>

    <div class="actions">
        <button type="button" class="secondary" on:click={onCancel} disabled={$isLoading}>
            취소
        </button>
    </div>
</div>

<style>
    #signup {
        width: 400px;
        padding: 24px;
        background: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        font-family: sans-serif;
    }

    label {
        display: block;
        margin-top: 12px;
        font-size: 0.9rem;
    }

    input {
        width: 100%;
        padding: 8px;
        margin-top: 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }

    .error {
        margin: 0 0 12px;
        color: #d00;
        font-size: 0.9rem;
    }

    button {
        width: 100%;
        padding: 10px;
        margin-top: 16px;
        background: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
    }

    button:hover {
        background: #005fa3;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
    }

    .actions .secondary {
        background: transparent;
        color: #007acc;
        border: 1px solid #007acc;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
    }

    .actions .secondary:hover {
        background: #e6f2fc;
    }
</style>
