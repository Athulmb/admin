import React, { useEffect, useState } from "react";
import API from "../api";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.role === "Admin") {
      API.get("auth/users")
        .then((res) => setUsers(res.data.users))
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <div>
      <h2>Welcome, {user?.fullName}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      {user?.role === "Admin" && (
        <>
          <h3>All Users</h3>
          <ul>
            {users.map((u) => (
              <li key={u._id}>
                {u.fullName} ({u.email}) – {u.role}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;
