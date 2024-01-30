import React, { useContext } from 'react'
import { CiImageOn } from "react-icons/ci";
import { PiHandGrabbingLight } from "react-icons/pi";
import { DrawingStateContext } from '../context/drawingState';
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { LuMousePointer2 } from "react-icons/lu";

function Sidebar() {
    const {
        setImageData,
        setIsPanning,
        isPanning,
        setScale,
        scale,
        setIsSelecting,
        isSelecting,
        selectedElement,
    } = useContext(DrawingStateContext);
    const handleSelectImage = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () =>
                setImageData({ base64: reader.result, file, img })
        }
    }

    const zoom = (delta) => {
        setScale(Math.round(Math.min(Math.max(scale + delta, 1), 2) * 100) / 100);
    }

    return (
        <section className='absolute left-10 top-1/2 rounded-md flex flex-col justify-start items-center p-2 bg-[#444] border py-2 translate-y-[-50%] translate-x-[-50%]'>
            <div className='flex flex-col items-center h-full w-11/12 gap-4'>
                <label
                    className='flex items-center justify-center cursor-pointer text-white'
                    onClick={() => {
                        setIsSelecting(!isSelecting);
                        setIsPanning(false);
                    }}
                >
                    <LuMousePointer2 className={`text-2xl ${isSelecting && 'text-cyan-500'}`} />
                </label>
                <label
                    className='flex items-center justify-center cursor-pointer text-white'
                    onClick={() => {
                        setIsPanning(!isPanning);
                        setIsSelecting(false);
                    }}
                >
                    <PiHandGrabbingLight className={`text-3xl ${isPanning && 'text-cyan-500'}`} />
                </label>
                <label
                    className='flex items-center justify-center cursor-pointer text-white'
                    onClick={() => zoom(0.1)}
                >
                    <FiZoomIn className='text-3xl' />
                </label>
                <span className='flex items-center justify-center cursor-pointer text-white select-none text-center'
                    onClick={() => setScale(1)}
                >
                    {scale}x
                </span>
                <label
                    className='flex items-center justify-center cursor-pointer text-white'
                    onClick={() => zoom(-0.1)}
                >
                    <FiZoomOut className='text-3xl' />
                </label>
                <label className='flex items-center justify-center cursor-pointer text-white'>
                    <CiImageOn className='text-3xl' />
                    <input className='hidden' type="file" accept='image/*' onChange={(e) => handleSelectImage(e.target.files[0])} />
                </label>

                <div className='flex flex-col items-center justify-center cursor-pointer text-white select-none text-center border px-1 rounded gap-1'>
                    <span>x1</span>
                    <span> {selectedElement?.x1}</span>
                </div>
                <div className='flex flex-col items-center justify-center cursor-pointer text-white select-none text-center  border px-1 rounded gap-1'>
                    <span>y1</span>
                    <span> {selectedElement?.y1}</span>
                </div>
                <div className='flex flex-col items-center justify-center cursor-pointer text-white select-none text-center  border px-1 rounded gap-1'>
                    <span>x2</span>
                    <span> {selectedElement?.x2}</span>
                </div>
                <div className='flex flex-col items-center justify-center cursor-pointer text-white select-none text-center  border px-1 rounded gap-1'>
                    <span>y2</span>
                    <span> {selectedElement?.y2}</span>
                </div>
            </div>
        </section>
    )
}

export default Sidebar