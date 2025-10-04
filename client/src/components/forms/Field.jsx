import React from "react";
import { useFormContext } from "react-hook-form";

export const Field = ({
  name,
  label,
  type = "text",
  placeholder,
  rules,
  rightSlot, // e.g., % or icon
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const err = errors[name]?.message;

  return (
    <label className={`field ${err ? "is-error" : ""}`}>
      <span className="field__label">{label}</span>
      <div className="field__control">
        <input
          className="field__input"
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
        />
        {rightSlot ? <div className="field__right">{rightSlot}</div> : null}
      </div>
      {err ? <span className="field__error">{err}</span> : null}
    </label>
  );
};

export const SelectField = ({ name, label, options = [], rules }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const err = errors[name]?.message;

  return (
    <label className={`field ${err ? "is-error" : ""}`}>
      <span className="field__label">{label}</span>
      <div className="field__control">
        <select className="field__input" {...register(name, rules)}>
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      </div>
      {err ? <span className="field__error">{err}</span> : null}
    </label>
  );
};
