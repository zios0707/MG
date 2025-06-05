<script lang="ts">
    import { onMount } from 'svelte';
    import { loop, tick, tickToPixel, pixelToTick, loopStart, loopEnd, ticksPerBeat } from '../../../store.ts';
    import { CELL_WIDTH, BAR_HEIGHT, BASE_MARGIN_LEFT } from './constants.js';

    // Export props
    export let canvasWidth;

    // Constants
    const cellWidth = CELL_WIDTH;
    const barHeight = BAR_HEIGHT;
    const baseMarginLeft = BASE_MARGIN_LEFT;
    const loopSelectorHeight = 9; // 30% - 40% of Navigation height

    // Helper function to snap tick value to quarter beat boundaries
    function snapToQuarterBeat(tickValue) {
        const quarterBeat = $ticksPerBeat / 4;
        return Math.round(tickValue / quarterBeat) * quarterBeat;
    }

    // State variables
    let mounted = false;
    let marginLeft = baseMarginLeft;
    let isDraggingStart = false;
    let isDraggingEnd = false;
    let isDraggingMiddle = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let initialLoopStart = 0;
    let initialLoopEnd = 0;

    // Canvas reference
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    // Redraw flag
    let needsRedraw = true;

    // Watch for changes that require redraw
    $: {
        canvasWidth;
        $loopStart;
        $loopEnd;
        $loop;
        if (mounted) requestRedraw();
    }

    // Request a redraw
    function requestRedraw() {
        needsRedraw = true;
    }

    // Draw the loop selector
    function draw() {
        if (!ctx || !mounted) return;

        if (needsRedraw) {
            ctx.clearRect(0, 0, canvasWidth, loopSelectorHeight);

            if ($loop) {
                // Convert tick positions to pixels, ensuring they're snapped to quarter beat boundaries
                const snappedStart = snapToQuarterBeat($loopStart);
                const snappedEnd = snapToQuarterBeat($loopEnd);
                const startX = tickToPixel(snappedStart, cellWidth);
                const endX = tickToPixel(snappedEnd, cellWidth);

                // Draw semi-transparent middle section
                ctx.fillStyle = 'rgba(51, 204, 255, 0.3)';
                ctx.fillRect(startX, 0, endX - startX, loopSelectorHeight);

                // Draw start handle
                ctx.fillStyle = 'rgba(51, 204, 255, 0.8)';
                ctx.fillRect(startX - 5, 0, 10, loopSelectorHeight);

                // Draw end handle
                ctx.fillRect(endX - 5, 0, 10, loopSelectorHeight);
            }

            needsRedraw = false;
        }

        requestAnimationFrame(draw);
    }

    // Handle mouse down event
    function handleMouseDown(e: MouseEvent) {
        if (!$loop) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Convert tick positions to pixels
        // Make sure we're using the snapped values for consistent UI
        const snappedStart = snapToQuarterBeat($loopStart);
        const snappedEnd = snapToQuarterBeat($loopEnd);
        const startX = tickToPixel(snappedStart, cellWidth);
        const endX = tickToPixel(snappedEnd, cellWidth);

        // Check if clicking on start handle
        if (Math.abs(x - startX) <= 10) {
            isDraggingStart = true;
            dragStartX = x;
        }
        // Check if clicking on end handle
        else if (Math.abs(x - endX) <= 10) {
            isDraggingEnd = true;
            dragStartX = x;
        }
        // Check if clicking on middle section
        else if (x > startX && x < endX) {
            isDraggingMiddle = true;
            dragStartX = x;
            dragOffset = x - startX;
            // Make sure we're using the snapped values for consistent movement
            initialLoopStart = snappedStart;
            initialLoopEnd = snappedEnd;
        }

        if (isDraggingStart || isDraggingEnd || isDraggingMiddle) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    // Handle mouse move event
    function handleMouseMove(e: MouseEvent) {
        if (!$loop) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, canvasWidth));

        if (isDraggingStart) {
            const newStart = pixelToTick(x, cellWidth);
            // Snap to quarter beat boundary and ensure start is less than end and not negative
            const snappedStart = snapToQuarterBeat(newStart);
            loopStart.set(Math.max(0, Math.min(snappedStart, $loopEnd - $ticksPerBeat/4)));
        } else if (isDraggingEnd) {
            const newEnd = pixelToTick(x, cellWidth);
            // Snap to quarter beat boundary and ensure end is greater than start
            const snappedEnd = snapToQuarterBeat(newEnd);
            loopEnd.set(Math.max($loopStart + $ticksPerBeat/4, snappedEnd));
        } else if (isDraggingMiddle) {
            const deltaX = x - dragStartX;
            const deltaTicks = pixelToTick(deltaX, cellWidth);

            // Calculate new positions and snap to quarter beat boundaries
            let newStart = snapToQuarterBeat(initialLoopStart + deltaTicks);
            let newEnd = snapToQuarterBeat(initialLoopEnd + deltaTicks);

            // Ensure we don't go below 0
            if (newStart < 0) {
                newStart = 0;
                // Maintain the same width (in quarter beats)
                const quarterBeatsWidth = Math.round((initialLoopEnd - initialLoopStart) / ($ticksPerBeat/4));
                newEnd = newStart + (quarterBeatsWidth * ($ticksPerBeat/4));
            }

            // Ensure we don't go beyond canvas width
            const maxTick = pixelToTick(canvasWidth, cellWidth);
            if (newEnd > maxTick) {
                newEnd = snapToQuarterBeat(maxTick);
                // Maintain the same width (in quarter beats)
                const quarterBeatsWidth = Math.round((initialLoopEnd - initialLoopStart) / ($ticksPerBeat/4));
                newStart = Math.max(0, newEnd - (quarterBeatsWidth * ($ticksPerBeat/4)));
            }

            loopStart.set(newStart);
            loopEnd.set(newEnd);
        }

        requestRedraw();
    }

    // Handle mouse up event
    function handleMouseUp() {
        isDraggingStart = false;
        isDraggingEnd = false;
        isDraggingMiddle = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    // Update margin on scroll
    function updateMarginOnScroll() {
        marginLeft = -window.scrollX + baseMarginLeft;
        requestRedraw();
    }

    onMount(() => {
        mounted = true;

        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        canvas.width = canvasWidth;
        canvas.height = loopSelectorHeight;

        // Initialize loopStart and loopEnd to be snapped to quarter beat boundaries
        loopStart.set(snapToQuarterBeat(0)); // Start at beat 0
        loopEnd.set(snapToQuarterBeat(4));  // End at beat 4 (assuming 4 ticks per beat)

        requestRedraw();
        draw();

        window.addEventListener('scroll', updateMarginOnScroll);
        canvas.addEventListener('mousedown', handleMouseDown);

        return () => {
            mounted = false;
            window.removeEventListener('scroll', updateMarginOnScroll);
            canvas.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    });
</script>

<div id="loop-selector-container">
    <canvas 
        id="loop-selector"
        bind:this={canvas} 
        width={canvasWidth}
        height={loopSelectorHeight}
        style="width: {canvasWidth}px; margin-left: {marginLeft}px;"
    ></canvas>
</div>

<style>
    #loop-selector-container {
        top: 65px;
        height: 15px;
        z-index: 3;
        display: inline-block;
        position: fixed;
        pointer-events: none; /* Initially transparent to events */
    }

    #loop-selector {
        height: 100%;
        display: inline-block;
        cursor: pointer;
        pointer-events: auto; /* Enable events on the canvas */
    }
</style>
