<script lang="ts">
    import { authStatus, AuthStatus, user, isLoading } from '../../store.ts'
    import { authService } from '../../api/authService.js';
    import NoteCard from './NoteCard.svelte';

    let newPassword = '';
    let confirmPassword = '';
    let error = '';
    let successMessage = '';
    let projectList = [
        {
            title:"1",
            note:[
                "1",
                "1",
                "1",
                "1",
                "1"
            ]
        },
        {
            title:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            note:[
                "1"
            ]
        },
        {
            title:"1",
            note:[
                "1",
                "1",
                "1",
                "1",
                "1",
                "1",
                "1",
                "1",
                "1",
                "1",
                "1"
            ]
        }
    ];

    async function onChangePassword(event: Event) {
        event.preventDefault();
        error = '';
        successMessage = '';

        if (!newPassword || !confirmPassword) {
            error = '비밀번호를 모두 입력해주세요.';
            return;
        }
        if (newPassword !== confirmPassword) {
            error = '비밀번호가 일치하지 않습니다.';
            return;
        }

        try {
            $isLoading = true;
            await authService.changePassword($user.accountId, newPassword);
            successMessage = '비밀번호가 성공적으로 변경되었습니다.';
            newPassword = '';
            confirmPassword = '';
        } catch (err) {
            error = err.message || '비밀번호 변경 중 오류가 발생했습니다.';
        } finally {
            $isLoading = false;
        }
    }

    function onExit() {
        $authStatus = AuthStatus.NONE;
    }

    function onLogout() {
        $user = null
        $authStatus = AuthStatus.LOGIN;
    }
</script>

<div id="mypage">
    <h2>안녕하세요! {$user.accountId}님</h2>

    <!-- 노트 리스트 -->
    <div class="note-list">
        {#each projectList as project}
            <NoteCard title={project.title} noteCount={project.note.length} />
        {/each}
    </div>

    <!-- 비밀번호 재설정 폼 -->
    <form class="password-form" on:submit={onChangePassword}>
        {#if error}
            <p class="error">{error}</p>
        {/if}
        {#if successMessage}
            <p class="success">{successMessage}</p>
        {/if}
        <div class="field">
            <label for="new-password">비밀번호 재설정</label>
            <input
                    id="new-password"
                    type="password"
                    bind:value={newPassword}
                    placeholder="새 비밀번호"
                    disabled={$isLoading}
            />
        </div>
        <div class="field">
            <label for="confirm-password">비밀번호 확인</label>
            <input
                    id="confirm-password"
                    type="password"
                    bind:value={confirmPassword}
                    placeholder="비밀번호 확인"
                    disabled={$isLoading}
            />
        </div>
        <button type="submit" class="primary" disabled={$isLoading}>
            {#if $isLoading}
                변경 중...
            {:else}
                변경하기
            {/if}
        </button>
    </form>

    <!-- 버튼 구역 -->
    <div class="actions">
        <button type="button" class="secondary" on:click={onExit} disabled={$isLoading}>
            나가기
        </button>
        <button type="button" class="secondary logout" on:click={onLogout} disabled={$isLoading}>
            로그아웃하기
        </button>
    </div>
</div>

<style>
    #mypage {
        width: 400px;
        padding: 24px;
        background: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        font-family: sans-serif;
    }

    h2 {
        margin: 0 0 16px;
        font-size: 1.2rem;
    }

    .note-list {
        display: flex;
        overflow-x: auto;
        gap: 8px;
        padding-bottom: 12px;
        margin-bottom: 24px;
    }

    .password-form .field {
        margin-bottom: 12px;
    }

    label {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 4px;
    }

    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }

    .error {
        color: #d00;
        font-size: 0.85rem;
        margin-bottom: 12px;
    }

    .success {
        color: #0a0;
        font-size: 0.85rem;
        margin-bottom: 12px;
    }

    button {
        padding: 10px;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .primary {
        width: 100%;
        background: #007acc;
        color: white;
        margin-top: 8px;
    }

    .primary:hover {
        background: #005fa3;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-top: 16px;
    }

    .actions .secondary {
        flex: 1;
        background: transparent;
        color: #007acc;
        border: 1px solid #007acc;
        padding: 10px;
    }

    .actions .secondary:hover {
        background: #e6f2fc;
    }

    .actions .logout {
        background: #d00;
        color: white;
    }

    .actions .logout:hover {
        background: #a00;
    }
</style>
