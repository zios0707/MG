<script lang="ts">
    export let title: string;
    export let noteCount: number;
</script>

<div class="note-card">
    <div class="info">
        <p class="title" title={title}>{title}</p>
        <p class="count">노트 개수: {noteCount}</p>
    </div>
</div>

<style>
    .note-card {
        width: 120px;
        background: #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        flex: 0 0 auto;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        text-align: center;
    }

    .title {
        font-size: 0.85rem;
        font-weight: bold;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .count {
        font-size: 0.75rem;
        color: #555;
    }
</style>
