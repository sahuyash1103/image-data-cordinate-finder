import { createContext, useState } from "react";

export const DrawingStateContext = createContext({});


const DrawingStateProvider = ({ children }) => {
    const [imageData, setImageData] = useState(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    
    const [elementsCord, setElementsCord] = useState([]);
    const [selectedElements, setSelectedElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);

    const [zoom, setZoom] = useState(100);
    const [scale, setScale] = useState(1);
    const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    return (
        <DrawingStateContext.Provider value={
            {
                imageData,
                setImageData,

                isDrawing,
                setIsDrawing,
                isPanning,
                setIsPanning,
                isErasing,
                setIsErasing,
                isSelecting,
                setIsSelecting,

                elementsCord,
                setElementsCord,
                selectedElements,
                setSelectedElements,
                selectedElement,
                setSelectedElement,

                zoom,
                setZoom,
                scale,
                setScale,
                scaleOffset,
                setScaleOffset,
                panOffset,
                setPanOffset
            }
        }>
            {children}
        </DrawingStateContext.Provider>
    )
}

export default DrawingStateProvider;
