import { useState } from "react";
import { formatPrice } from "../utils/seats";

const EMPTY = { name: "", email: "", phone: "", payment: "card", agree: false };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 3) errors.name = "Enter your full name (min 3 characters).";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
  if (!/^\+?[0-9\s-]{7,15}$/.test(values.phone)) errors.phone = "Enter a valid phone number.";
  if (!values.agree) errors.agree = "You must accept the booking terms.";
  return errors;
}

/** Controlled form — React state is the single source of truth for every field. */
export default function CheckoutForm({ total, seatCount, onSubmit, submitting }) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});

  const errors = validate(values);
  const showError = (field) => touched[field] && errors[field];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };

  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, agree: true });
    if (Object.keys(errors).length === 0) onSubmit(values);
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h3>Your details</h3>

      <label className="field">
        <span>Full name</span>
        <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="Jane Doe" />
        {showError("name") && <small className="field-error">{errors.name}</small>}
      </label>

      <label className="field">
        <span>Email</span>
        <input name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="jane@example.com" />
        {showError("email") && <small className="field-error">{errors.email}</small>}
      </label>

      <label className="field">
        <span>Phone</span>
        <input name="phone" type="tel" value={values.phone} onChange={handleChange} onBlur={handleBlur} placeholder="+251 9XX XXX XXX" />
        {showError("phone") && <small className="field-error">{errors.phone}</small>}
      </label>

      <fieldset className="field radio-group">
        <legend>Payment method</legend>
        {[
          ["card", "Credit / debit card"],
          ["mobile", "Mobile money"],
          ["cash", "Pay at the cinema"],
        ].map(([val, label]) => (
          <label key={val} className="radio">
            <input type="radio" name="payment" value={val} checked={values.payment === val} onChange={handleChange} />
            {label}
          </label>
        ))}
      </fieldset>

      <label className="checkbox">
        <input type="checkbox" name="agree" checked={values.agree} onChange={handleChange} onBlur={handleBlur} />
        I accept the booking terms and cancellation policy.
      </label>
      {showError("agree") && <small className="field-error">{errors.agree}</small>}

      <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
        {submitting ? "Confirming…" : `Confirm ${seatCount} ticket${seatCount > 1 ? "s" : ""} • ${formatPrice(total)}`}
      </button>
    </form>
  );
}
