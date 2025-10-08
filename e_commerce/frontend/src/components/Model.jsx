import React from "react";

const Model = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background overlay */}
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal content */}
            <div className="relative bg-white p-4 rounded-lg z-10">
                <button
                    className="absolute top-2 right-2 text-black font-semibold hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
};

export default Model;
