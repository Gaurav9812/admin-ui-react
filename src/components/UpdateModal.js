import { useState } from "react";
import Cross from "./assets/img/cross.png";
const UpdateModal = ({ id, name, email, role, showModal, submitForm }) => {
  const [nameInput, setName] = useState(name);
  const [emailInput, setEmail] = useState(email);
  const [roleInput, setRole] = useState(role);

  return (
    <div className="modal-container">
      <div className="modal-content">
        <img
          src={Cross}
          onClick={(e) => showModal(false)}
          className="arrow-btns"
        />
        <form
          id="update-form"
          onSubmit={(e) => {
            e.preventDefault();
            submitForm(id, nameInput, emailInput, roleInput);
          }}
        >
          <input type="number" value={id} hidden readOnly />
          <div className="input-field-container">
            <label className="">Name</label>
            <input
              value={nameInput}
              className=""
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field-container">
            <label className="">Email</label>
            <input
              value={emailInput}
              className=""
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-field-container">
            <label className="">Role</label>
            <select
              value={roleInput}
              className=""
              onChange={(e) => setRole(e.target.value)}
              prompt="All"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
