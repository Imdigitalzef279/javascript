import React, { useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { RootState } from "./store";
import { setUsers, setCurrentPage } from "./store/users/actions";

interface PropsFromState {
  users: any[];
  currentPage: number;
}

interface PropsFromDispatch {
  setUsers: typeof setUsers;
  setCurrentPage: typeof setCurrentPage;
}

type AllProps = PropsFromState & PropsFromDispatch;

const App: React.FC<AllProps> = ({ users, currentPage, setUsers, setCurrentPage }) => {
  const [usersPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("https://randomuser.me/api/?results=100");
      setUsers(res.data.results);
    };
    fetchUsers();
  }, [setUsers]);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.email}>
              <td>{`${user.name.first} ${user.name.last}`}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div>
        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = ({ users }: RootState) => ({
  users: users.items,
  currentPage: users.currentPage,
});

const mapDispatchToProps = {
  setUsers,
  setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
