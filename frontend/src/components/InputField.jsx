import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOff, IoEye } from "react-icons/io5";

export default function InputField({
  label,
  icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  const [show, setShow] = useState(false);

  const icons = {
    user: <FaUser />,
    email: <FaEnvelope />,
    pass: <FaLock />,
  };

  const inputType = type === "password" && show ? "text" : type;

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm text-white mb-1">{label}</label>
      <div className="flex items-center bg-white/10 border border-white/25 rounded-xl px-3 py-3 backdrop-blur-md">
        <span className="text-white/80 mr-3 text-lg">{icons[icon]}</span>
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60 text-sm"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-white/70 text-lg ml-2"
          >
            {show ? <IoEye /> : <IoEyeOff />}
          </button>
        )}
      </div>
    </div>
  );
}
