import {Tuits} from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

const MOCKED_USERS = [
  "alice", "bob", "charlie"
];

const MOCKED_TUITS = [
    {_id: "1", tuit: "alice's tuit"},{_id: "2", tuit: "bob's tuit"}, {_id: "3", tuit: "charlie's tuit"}
];

test('tuit list renders static tuit array', () => {
  // TODO: implement this
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>);
  const tuit = screen.getByText(/bob's tuit/i);
  expect(tuit).toBeInTheDocument();
});

test('tuit list renders async', async () => {
  // TODO: implement this
    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits} />
        </HashRouter>);
    const linkElement = screen.getByText(/async tests/i);
    expect(linkElement).toBeInTheDocument();
})
