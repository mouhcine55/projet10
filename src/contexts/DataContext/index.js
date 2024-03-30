import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
   //  ajout de la variable  last avec une valeur initiale de null et une fonction setLast pour mettre à jour cette valeur
  const [last, setLast] = useState(null);
  const getData = useCallback(async () => {
    try {
      const datas = await api.loadData()
      //  ajout :setData met à jour l'état de data avec les données chargées
      setData(await api.loadData());
      //   ajout : la fonction sort trie les événements dans datas par date, puis met à jour l'état last avec le plus anciens événement trouvé après le tri
     setLast(datas?.events?.sort((a,b)=>new Date(b.date) - new Date(a.date))[0])
     
    } catch (err) {
      setError(err);
     // console.log(err);
     
    }
  }, []);
  useEffect(() => {
    if (data) return;
    
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        last, // on retorne le last dans le context
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
