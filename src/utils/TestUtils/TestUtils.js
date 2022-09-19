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

export const wrapInUserContext = (ui) => {
  return (
    <BrowserRouter>
      <UserContext.Provider {...mockUser}>{ui}</UserContext.Provider>
    </BrowserRouter>
  )
}

export const sampleTablatureBlock = {
  inputs: 'test inputs',
  dashes: 'test dashes',
  blockType: 'tablature'
}