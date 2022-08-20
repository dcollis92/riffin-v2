import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import * as tablatureServices from "../../services/tablatureServices";
import * as userUtils from "../../utils/userUtils";
import { CircularProgress } from "@mui/material";
import BarController from './components/BarController';
import EditorControls from './components/EditorControls'

import Box from '@mui/material/Box';

const Editor = () => {
  const [showDeleteButton, setShowDeleteButton] = useState(false); // Is the document already in the database?
  // TODO Rename: isWaitingForResponse
  const [isLoading, setIsLoading] = useState(false); // is the document currently waiting for a response?
  const [tablature, setTablature] = useState({
    isPublic: false,
    name: "A tasty lick",
    bars: [],
    tags: [],
    isBassTab: false,
  });
   const { user } = useContext(UserContext);
  const { tabId } = useParams();
  let navigate = useNavigate();
  
  const deleteTablatureFromDatabase = () => {
    const idToken = userUtils.getIdTokenFromUser(user);
    tablatureServices.delete(tablature._id, idToken).then((res) => {
      console.log(res);
    });
    // TODO Navigate to trending
  };

  const saveTablatureToDatabase = () => {
    const updateExistingTablature = (idToken) => {
      setIsLoading(true);
      tablatureServices.update(tablature, idToken).then((res) => {
        console.log(res);
        setIsLoading(false);
        setTablature({ ...tablature });
      });
    }
  
    const saveNewTablature = (idToken) => {
      setIsLoading(true);
      // const { _id, ...tablaturePayload } = tablature;
      tablatureServices
        .create(tablature, idToken)
        .then((tablatureFromResponse) => {
          setIsLoading(false);
          navigate(`/edit/${tablatureFromResponse._id}`);
        });
    }

    const idToken = userUtils.getIdTokenFromUser(user);
    if (tablature._id) {
      updateExistingTablature(idToken);
    } else {
      saveNewTablature(idToken);
    }
  };

  const deleteBarFromTablature = (barIndex) => {
    // TODO Find a way for this be done through BarController?
    const newBars = [];
    tablature.bars.forEach((bar, i) => {
      if (barIndex !== i) {
        newBars.push({ ...bar });
      }
    });

    tablature.bars = newBars;
    setTablature({ ...tablature });
  };

  const addBarToTablature = () => {
    // TODO Find a way for this be done through BarController?
    const mapOfLastColumnIndexes = {
      40: true,
      81: true,
      122: true,
      163: true,
      204: true,
      245: true,
    };

    const initTextAreaWithValue = (character) => {
      let charactersInString = [];
      for (let i = 0; i < 245; i++) {
        if (i in mapOfLastColumnIndexes) {
          charactersInString.push("\n");
        } else {
          charactersInString.push(character);
        }
      }
      return charactersInString.join("");
    };

    const previousBars = [];
    tablature.bars.forEach((bar) => {
      previousBars.push({ ...bar });
    });

    const newBar = {
      label: `Bar ${tablature.bars.length + 1}`,
      inputs: initTextAreaWithValue(" "),
      dashes: initTextAreaWithValue("-"),
    };

    tablature.bars = [...previousBars, newBar];
    setTablature({ ...tablature });
  };

  const setPublic = () => {
    const udpatedTablature = {
      ...tablature,
      isPublic: !tablature.isPublic,
    };
    setTablature(udpatedTablature);
  };

  // Check if the document is new
  useEffect(() => {
    tablature["_id"] ? setShowDeleteButton(true) : setShowDeleteButton(false);
  }, [tablature]);

  useEffect(() => {
    if (tabId) {
      tablatureServices.getTablatureById(tabId).then((res) => {
        if (res["error"]) {
          // TODO Navigate back to where the user came from
          navigate(`/trending`);
        }
        setTablature(res.tablature);
      });
    }
  }, [tabId]);

  const handleNameInput = (event) => {
    const udpatedTablature = {
      ...tablature,
      name: event.target.value,
    };
    setTablature(udpatedTablature);
  };

  const refreshTablatureObject = () => {
    setTablature({ ...tablature });
  }
  
  useEffect(() => {
    if (user) {
      let username = user.username;
      setTablature((prev) => {
        return { ...prev, owner: username };
      });
    }
  }, [user]);

  
  return (
    <>
      {isLoading ? ( <CircularProgress /> ) : (
        // ! Change the height once the new nav area is implemented
        <Box sx={{ height: '50vh', transform: 'translateZ(0px)', flexGrow: 1 }}>
          <input
            type="text"
            name="name"
            value={tablature.name}
            onChange={handleNameInput}
            placeholder="A tasty lick"
          />

          <BarController 
            bars={tablature.bars} 
            refreshTablatureObject={refreshTablatureObject}
            deleteBarFromTablature={deleteBarFromTablature}
          />

          <EditorControls
            deleteTablatureFromDatabase={deleteTablatureFromDatabase}
            allowDelete={showDeleteButton}
            setPublic={setPublic}
            isPublic={tablature.isPublic}
            saveTablatureToDatabase={saveTablatureToDatabase}
            addBarToTablature={addBarToTablature}
          />
        </Box>
      )}
    </>
  );
}
 
export default Editor;