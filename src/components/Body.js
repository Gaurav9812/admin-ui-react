import { useEffect, useState } from "react";
import LeftArrow from "./assets/img/left-arrow.png";
import DoubleLeftArrow from "./assets/img/double-left-arrow.png";
import RightArrow from "./assets/img/right-arrow.png";
import DoubleRightArrow from "./assets/img/double-right-arrow.png";
import Writing from "./assets/img/writing.png";
import Delete from "./assets/img/delete.png";
import UpdateModal from "./UpdateModal";
import { GEEKTRUST_URL, addCheckBox } from "../utils/helpers";
import Error from "./Error";

const Body = () => {
  const [members, setMembers] = useState([
    {
      id: "1",
      name: "Aaron Miles",
      email: "aaron@mailinator.com",
      role: "member",
    },
    {
      id: "2",
      name: "Aishwarya Naik",
      email: "aishwarya@mailinator.com",
      role: "member",
    },
    {
      id: "3",
      name: "Arvind Kumar",
      email: "arvind@mailinator.com",
      role: "admin",
    },
  ]);

  const [filteredMembers, setFilteredMembers] = useState([]); //To show only 10 records on page and show search results
  const [selectedCheckbox, setSelectedCheckbox] = useState([]); //Selected checkbox
  const [searchText, setSearchText] = useState(""); //Search Text
  const [page, setPage] = useState(1); //Current Page
  const [recordsPerPage, setRecordsPerPage] = useState(10); // Record Per Page
  const [showModal, setShowModal] = useState(false); // Update Modal
  const [toUpdate, setToUpdate] = useState({}); //The entry which is to be updated
  const [error, setError] = useState(false); //If error show Error Component

  //Add checked checkbox in selectedCheckbox state
  function addSelected(e) {
    setSelectedCheckbox(addCheckBox(selectedCheckbox, e.target.value));
  }

  //To Fetch Data from Api
  useEffect(() => {
    getMembers();
  }, []);

  //Fetching data from api and setting in state
  async function getMembers() {
    try {
      let response = await fetch(GEEKTRUST_URL);
      let json = await response.json();

      setMembers(json);
      setFilteredMembers(json);
    } catch (e) {
      console.log(e.message);
      setError(true);
    }
  }

  //Deleting one member form icon on row
  const deleteMember = (memberId) => {
    let filteredMembersTemp = members.filter((member) => {
      return member.id != memberId;
    });
    setMembers(filteredMembersTemp);
    filterMembers(searchText, filteredMembersTemp);
    setSelectedCheckbox(
      selectedCheckbox.filter((selected) => {
        return selected != memberId;
      })
    );
  };

  // deleting multiple checked members from delete btn on left of pages
  const deleteMultipleMembers = () => {
    let filteredMembersTemp = filteredMembers.filter((member) => {
      return !selectedCheckbox.includes(parseInt(member.id));
    });
    setFilteredMembers(filteredMembersTemp);
    setMembers(filteredMembersTemp);
    setSelectedCheckbox([]);
  };

  //add all or remove all from selected checkbox on current page
  const addAllInSelected = (checked) => {
    let allCheckbox = [];
    if (!checked) {
      allCheckbox = [...selectedCheckbox];
      filteredMembers
        .slice((page - 1) * recordsPerPage, page * recordsPerPage)
        .map((member, index) => {
          if (!selectedCheckbox.includes(parseInt(member.id))) {
            allCheckbox.push(parseInt(member.id));
          }
        });

      setSelectedCheckbox(allCheckbox);
    } else {
      let newSelectedCheckbox = [...selectedCheckbox];
      filteredMembers
        .slice((page - 1) * recordsPerPage, page * recordsPerPage)
        .map((member, index) => {
          let findIndex = newSelectedCheckbox.indexOf(parseInt(member.id));
          if (findIndex > -1) {
            newSelectedCheckbox.splice(findIndex, 1);
          }
        });

      setSelectedCheckbox(newSelectedCheckbox);
    }
  };

  //filter members according to search text and setting in filtered members
  const filterMembers = (text, members) => {
    setSearchText(text);

    setFilteredMembers(
      members.filter((member) => {
        return (
          member.role.toLowerCase().includes(text.toLowerCase()) ||
          member.name.toLowerCase().includes(text.toLowerCase()) ||
          member.email.toLowerCase().includes(text.toLowerCase()) ||
          text == ""
        );
      })
    );
  };

  //updating member
  const submitForm = (id, name, email, role) => {
    let newMembers = [];
    members.forEach((member, index) => {
      if (member.id == id) {
        newMembers.push({ id, name, email, role });
      } else {
        newMembers.push(member);
      }
    });
    setMembers(newMembers);
    setFilteredMembers(newMembers);
    setShowModal(false);
    setSearchText("");
  };

  //checking if all members are in selected checkbox
  const checkForAllBoxInCurrPage = () => {
    let flag = true;
    filteredMembers
      .slice((page - 1) * recordsPerPage, page * recordsPerPage)
      .map((member) => {
        if (!selectedCheckbox.includes(parseInt(member.id))) {
          flag = false;
          return;
        }
      });
    return flag;
  };

  let checked = checkForAllBoxInCurrPage();

  //Showing Error component if any error arouse
  return error ? (
    <Error />
  ) : (
    <>
      {showModal && (
        <UpdateModal
          {...toUpdate}
          showModal={setShowModal}
          submitForm={submitForm}
        />
      )}

      <div className="table-container">
        <div className="search-container">
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              filterMembers(e.target.value, members);
            }}
            placeholder="Search by name, email and role"
          />
          <p>
            {searchText != ""
              ? filteredMembers.length > 0
                ? filteredMembers.length + " members found"
                : "No members found"
              : ""}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e, elem) => {
                    addAllInSelected(checked);
                  }}
                  checked={checked}
                  className="checkbox"
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers
              .slice((page - 1) * recordsPerPage, page * recordsPerPage)
              .map((member, index) => {
                return (
                  <tr key={member?.id}>
                    <td>
                      <input
                        type="checkbox"
                        key={member.id}
                        name={member.id}
                        value={parseInt(member.id)}
                        onChange={addSelected}
                        checked={selectedCheckbox.includes(parseInt(member.id))}
                        className="checkbox"
                      />
                    </td>
                    <td>{member?.name}</td>
                    <td>{member?.email}</td>
                    <td>{member?.role}</td>
                    <td>
                      <img
                        src={Writing}
                        className="action-icon"
                        onClick={(e) => {
                          setShowModal(true);
                          setToUpdate(member);
                        }}
                      />
                      <img
                        src={Delete}
                        className="action-icon"
                        onClick={(e) => {
                          deleteMember(member.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="pagination">
          {selectedCheckbox.length > 0 && (
            <div
              className="delete-btn"
              onClick={() => {
                deleteMultipleMembers();
              }}
            >
              <img src={Delete} className="action-icon" />(
              {selectedCheckbox.length})
            </div>
          )}
          <div className="pagination-btns-container">
            <img
              src={DoubleLeftArrow}
              className="arrow-btns"
              onClick={() => {
                setPage(1);
              }}
            />
            <img
              src={LeftArrow}
              className="arrow-btns"
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            />
            {Array(Math.ceil(filteredMembers.length / recordsPerPage))
              .fill("")
              .map((arr, index) => {
                return (
                  <button
                    key={index}
                    className={
                      "page-btn " + (page - 1 == index && "active-page")
                    }
                    onClick={(e) => {
                      setPage(index + 1);
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            <img
              src={RightArrow}
              className="arrow-btns"
              onClick={() => {
                if (page < Math.ceil(filteredMembers.length / recordsPerPage)) {
                  setPage(page + 1);
                }
              }}
            />
            <img
              src={DoubleRightArrow}
              className="arrow-btns"
              onClick={() => {
                setPage(Math.ceil(filteredMembers.length / recordsPerPage));
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
