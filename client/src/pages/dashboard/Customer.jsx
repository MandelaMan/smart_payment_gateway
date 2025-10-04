import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectRoleId,
  selectFullName,
} from "../../redux/auth/authSlice";

const Customer = () => {
  const user = useSelector(selectUser); // full user object
  const isAuthed = useSelector(selectIsAuthenticated); // boolean
  const roleId = useSelector(selectRoleId); // number or null
  const fullName = useSelector(selectFullName); // string

  return (
    <div>
      {isAuthed ? (
        <>
          <span>Hello, {fullName || user.email}</span>
          <small> (role_id: {roleId})</small>
        </>
      ) : (
        <span>Not signed in</span>
      )}
    </div>
  );
};

export default Customer;
