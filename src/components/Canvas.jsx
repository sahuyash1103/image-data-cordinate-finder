import React, { useContext, useEffect, useState } from 'react'
import { DrawingStateContext } from '../context/drawingState';

function Canvas() {
    const [canvas, setCanvas] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mouseDownAt, setMouseDownAt] = useState({ x: 0, y: 0 });
    const state = useContext(DrawingStateContext);

    const getMousePos = (e) => {
        const canvasOffset = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - canvasOffset.left - state.panOffset.x * state.scale + state.scaleOffset.x) / (state.scale),
            y: (e.clientY - canvasOffset.top - state.panOffset.y * state.scale + state.scaleOffset.y) / (state.scale),
        }
    }

    const isWithinElement = (x, y, element) => {
        const { x1, y1, x2, y2 } = element;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        x = x / state.scale - state.panOffset.x;
        y = y / state.scale - state.panOffset.y;

        console.log(x >= minX && x <= maxX && y >= minY && y <= maxY);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }

    const getElementAtPosition = (x, y, elements) => {
        return elements.find((e) => isWithinElement(x, y, e));
    }

    const handleMouseDown = (e) => {
        setIsMouseDown(true);
        setMouseDownAt(getMousePos(e));
        if (state.isPanning) return;
        if (state.isSelecting) {
            const element = getElementAtPosition(e.clientX, e.clientY, state.elementsCord);
            state.setSelectedElement(element);
            return;
        };
        state.setIsDrawing(true);

        const { x, y } = getMousePos(e);
        const element = {
            index: state.elementsCord.length,
            x1: x,
            y1: y,
            x2: x,
            y2: y,
        };

        state.setElementsCord([...state.elementsCord, element]);
    }

    const handleMouseMove = (e) => {
        if (!isMouseDown) return;
        if (state.isPanning && isMouseDown) {
            const { x, y } = getMousePos(e);
            const dx = x - mouseDownAt.x;
            const dy = y - mouseDownAt.y;
            state.setPanOffset(offset => { return { x: offset.x + dx, y: offset.y + dy }; });
            return;
        }

        if (state.isSelecting && isMouseDown) {
            const { clientX: x, clientY: y } = e;
            const selected = state.selectedElement;
            const dx = x - (mouseDownAt.x - selected.x1);
            const dy = y - (mouseDownAt.y - selected.y1);
            const element = {
                ...selected,
                x1: dx,
                y1: dy,
                x2: dx + (selected.x2 - selected.x1),
                y2: dy + (selected.y2 - selected.y1),
            };
            const elements = [...state.elementsCord];
            elements[element.index] = element;
            state.setElementsCord(elements);
            return;
        }
        if (!state.isDrawing) return;

        const { x, y } = getMousePos(e);
        const index = state.elementsCord.length - 1;

        const element = {
            ...state.elementsCord[index],
            x2: x,
            y2: y,
        };

        const elements = [...state.elementsCord];
        elements[index] = element;
        state.setElementsCord(elements);
    }

    const handleMouseUp = (e) => {
        state.setIsDrawing(false);
        setIsMouseDown(false);
    }

    useEffect(() => {
        if (!canvas) return;

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.save();

        const scaledWidth = canvas.width * state.scale;
        const scaledHeight = canvas.height * state.scale;

        const scaleOffsetX = (scaledWidth - canvas.width) / 2;
        const scaleOffsetY = (scaledHeight - canvas.height) / 2;
        state.setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

        context.translate(state.panOffset.x * state.scale - scaleOffsetX, state.panOffset.y * state.scale - scaleOffsetY);
        context.scale(state.scale, state.scale);
        context.strokeStyle = 'green';

        if (state.imageData)
            context.drawImage(state.imageData.img, 0, 0);

        setTimeout(() => {
            state.elementsCord.forEach(({ x1, y1, x2, y2 }) => {
                const width = x2 - x1;
                const height = y2 - y1;
                context.strokeRect(x1, y1, width, height);
            });
            context.restore();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas, state.elementsCord, state.imageData, state.panOffset, state.scale]);

    return (
        <div className='flex flex-col justify-center items-center w-full h-full overflow-hidden'>
            <canvas
                id='canvas'
                ref={setCanvas}
                className={`w-full h-full bg-green-100 ${state.isPanning ? isMouseDown ? 'cursor-grabbing' : 'cursor-grab' : state.isSelecting ? 'cursor-default' : 'cursor-crosshair'}`}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </div>
    )
}

export default Canvas