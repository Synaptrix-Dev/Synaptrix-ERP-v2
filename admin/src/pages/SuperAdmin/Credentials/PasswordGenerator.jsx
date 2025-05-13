import React, { useState, useEffect } from "react";

const PasswordGenerator = ({ isVisible, onClose }) => {
    const [length, setLength] = useState(12);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
    });
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const number = "0123456789";
        const symbol = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        let chars = "";
        if (options.uppercase) chars += upper;
        if (options.lowercase) chars += lower;
        if (options.numbers) chars += number;
        if (options.symbols) chars += symbol;

        if (!chars) return "";

        let pwd = "";
        for (let i = 0; i < length; i++) {
            const rand = Math.floor(Math.random() * chars.length);
            pwd += chars[rand];
        }
        return pwd;
    };

    const getStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 2) return { label: "Weak", color: "text-red-500" };
        if (score <= 4) return { label: "Medium", color: "text-yellow-500" };
        return { label: "Strong", color: "text-green-500" };
    };

    useEffect(() => {
        setPassword(generatePassword());
    }, [length, options]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    if (!isVisible) return null;

    const strength = getStrength(password);

    return (
        <div className="fixed inset-0 z-[99] bg-opacity-75  bg-black/50  backdrop-blur-sm flex justify-center items-center px-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6  py-8 w-full max-w-md flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Password Generator</h2>
                        <p className="text-sm text-gray-500">Generate strong passwords securely.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark fa-lg" />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Generated Password
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            readOnly
                            value={password}
                            className="w-full px-3 py-2 border rounded text-sm font-mono outline-none border-slate-200"
                        />
                        <button
                            onClick={handleCopy}
                            className="px-3 py-2 text-sm rounded btnBg text-white transition cursor-pointer"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <p className={`text-xs mt-1 ${strength.color}`}>Strength: {strength.label}</p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Length: {length}
                    </label>
                    <input
                        type="range"
                        min="4"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-700">
                    {[
                        { key: "uppercase", label: "Uppercase" },
                        { key: "lowercase", label: "Lowercase" },
                        { key: "numbers", label: "Numbers" },
                        { key: "symbols", label: "Symbols" },
                    ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={options[key]}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, [key]: e.target.checked }))
                                }
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                <button
                    onClick={() => setPassword(generatePassword())}
                    className="w-full mt-2 btnBg text-white py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition text-sm"
                >
                    Regenerate Password
                </button>
            </div>
        </div>
    );
};

export default PasswordGenerator;
