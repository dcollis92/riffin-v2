import { render } from "@testing-library/react";
import {BrowserRouter} from 'react-router-dom'
import { UserContext } from "containers/CognitoUserProvider/CognitoUserProvider";

const mockUser = {
  value: {
    user: {
      username: 'JarJar_Binks',
      userDataKey: "pizza",
      storage: {}
    }
  }
}

export const renderWithUserContext = (ui) => {
  return render(
    <UserContext.Provider {...mockUser}>{ui}</UserContext.Provider>,
    {wrapper: BrowserRouter},
  )
}