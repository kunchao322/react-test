import {Tuits} from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {createTuit, findAllTuits} from "../services/tuits-service";
import axios from "axios";
import {findAllUsers} from "../services/users-service";
import {UserList} from "../components/profile/user-list";
import {createUser} from "./services";

jest.mock('axios');

const MOCKED_USERS = [
  "alice", "bob", "charlie"
];


const MOCKED_TUITS = [
  {_id: "1", tuit: "alice's tuit"},{_id: "2", tuit: "bob's tuit"}, {_id: "3", tuit: "charlie's tuit"}
];


test('tuit list renders mocked', async () => {
  // TODO: implement this
  axios.get.mockImplementation(() =>
      Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>);

  const user = screen.getByText(/bob's tuit/i);
  expect(user).toBeInTheDocument();
});
