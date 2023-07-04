import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import Swal, { SweetAlertIcon } from "sweetalert2";
import NavBar from "./navBar";
import { useNavigate } from "react-router-dom";

import {
  faCheck,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

library.add(faCheck, faPenToSquare, faTrash);

type ListItem = {
  id: number;
  note: string;
};

const List = (props: { color: string }) => {
  const navigate = useNavigate();

  const userLoggedInSession = window.localStorage.getItem("userLoggedIn");

  useEffect(() => {
    if (userLoggedInSession?.length === 0 || userLoggedInSession === null) {
      navigate("/");
    }
  }, [navigate, userLoggedInSession]);

  const [data, setData] = useState("");
  const [listData, setListData] = useState<ListItem[]>([]);
  const [updateId, setUpdateId] = useState(0);

  const addNote = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setData(event.target.value);
    },
    [setData]
  );

  const showAlert = useCallback(
    (title: string, type: SweetAlertIcon, message: string) => {
      Swal.fire({
        title: title,
        text: message,
        icon: type,
        confirmButtonText: "Okay",
      });
    },
    []
  );

  const validateForm = useCallback(() => {
    if (data === "") {
      showAlert("Note is Empty", "error", "Please Enter Your Note");
      return false;
    }
    return true;
  }, [data, showAlert]);

  const fetchData = useCallback(() => {
    axios
      .get("http://127.0.0.1/api/api.php")
      .then((response) => {
        const data: ListItem[] = response.data;
        setListData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setListData]);

  const deleteData = useCallback(
    (id: number) => {
      axios
        .delete("http://localhost/api/api.php", { data: { id } })
        .then((response) => {
          setListData(listData.filter((item) => item.id !== id));
        })
        .catch((error) => console.error(error));
    },
    [listData, setListData]
  );

  const submitForm = useCallback(() => {
    if (validateForm()) {
      axios
        .post("http://localhost/api/api.php", { note: data })
        .then((response) => {
          fetchData();
          setData("");
        })
        .catch((error) => console.error(error));
    }
  }, [data, fetchData, validateForm]);

  const setUpdateData = (id: number, note: string) => {
    setData(note);
    setUpdateId(id);
  };

  const updateData = useCallback(() => {
    if (data === "") {
      showAlert("Note is Empty", "error", "Please Change something to Update");
      return false;
    }

    if (updateId === 0) {
      return false;
    }

    axios
      .put("http://localhost/api/api.php", { id: updateId, note: data })
      .then((response) => {
        fetchData();
        setData("");
        showAlert("Updated", "success", "Data Updated Successfully");
      })
      .catch((error) => console.error(error));
  }, [data, updateId, fetchData, showAlert]);

  return (
    <>
      <NavBar />
      <div className="flex justify-center w-screen min-h-screen overflow-hidden px-0">
        <div className="max-w-sm rounded overflow-hidden shadow-2xl w-96">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Note App</div>
            <input
              type="text"
              value={data}
              onChange={addNote}
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Note.."
              required
            />
            <button
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 mt-5"
              type="submit"
              onClick={submitForm}
            >
              Insert
            </button>
            <button
              className="text-gray-900 hover:text-white border border-amber-500 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 mt-5"
              type="submit"
              onClick={fetchData}
            >
              View Note
            </button>
            <button
              className="text-gray-900 hover:text-white border border-amber-500 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 mt-5"
              type="submit"
              onClick={updateData}
            >
              Update
            </button>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3">
                Note
              </th>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {listData.map((itemVal) => (
                  <tr
                    key={itemVal.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 items-center"
                  >
                    <td className="px-6 py-4">
                      <span>{itemVal.note}</span>
                    </td>
                    <td className="px-6 py-4">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        onClick={() => setUpdateData(itemVal.id, itemVal.note)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deleteData(itemVal.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default List;
