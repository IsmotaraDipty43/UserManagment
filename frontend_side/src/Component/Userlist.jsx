import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please login first.");
      setTimeout(() => {
        navigate("/");
      }, 1500); 
    }
  }, [navigate]);
  

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const fetchUsers = async (pageNumber) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${pageNumber}`);
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      toast.error("Failed to fetch users!");
    }
  };

  const filterUsers = () => {
    const filtered = users.filter((user) =>
      `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user!");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${editUser.id}`, editUser);
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      toast.success("User updated successfully!");
      setEditUser(null);
    } catch (error) {
      toast.error("Failed to update user!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold text-black mb-6">User List</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 p-2 border rounded w-80"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <img src={user.avatar} alt={user.first_name} className="w-20 h-20 rounded-full mb-3" />
            <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => handleEditClick(user)} className="bg-blue-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDeleteClick(user.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName="flex gap-2 mt-6"
        pageClassName="px-3 py-2 bg-white border rounded-md cursor-pointer"
        activeClassName="bg-blue-500 text-white"
        previousClassName="px-3 py-2 bg-gray-200 border rounded-md cursor-pointer"
        nextClassName="px-3 py-2 bg-gray-200 border rounded-md cursor-pointer"
      />

      {/* Edit Form Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                className="border p-2 rounded"
                value={editUser.first_name}
                onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                required
              />
              <input
                type="text"
                className="border p-2 rounded"
                value={editUser.last_name}
                onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                required
              />
              <input
                type="email"
                className="border p-2 rounded"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                required
              />
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                <button type="button" onClick={() => setEditUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserList;
