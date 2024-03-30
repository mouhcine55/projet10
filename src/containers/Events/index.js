import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
   const { data, error } = useData();
   const [type, setType] = useState();
   const [currentPage, setCurrentPage] = useState(1);

   // console.log("type:", type);
   // console.log("currentPage:", currentPage);

   // Filtrage en fonction du type
   const filteredEventsByType = (
      // Utilise l'opérateur ternaire pour vérifier si le type est défini.
      type
         // Si le type est défini, filtre les événements pour inclure uniquement ceux avec le type spécifié.
         ? data?.events.filter(event => event.type === type)
         // Sinon, utilise tous les événements (data?.events).
         : data?.events
      // Si data?.events est toujours non défini, initialise à un tableau vide.
   ) || [];

   // Filtrage en fonction de la page
   const filteredEvents = filteredEventsByType.slice(
      // Utilise la méthode slice pour obtenir une portion du tableau filtré en fonction de la pagination.
      (currentPage - 1) * PER_PAGE, // Index de début de la portion.
      currentPage * PER_PAGE // Index de fin de la portion.
   );
   
   /* 
   Ancien code 
   const filteredEvents = (
    (!type
      ? data?.events
      : data?.events) || []
  ).filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });
  */

   const changeType = (evtType) => {
      setCurrentPage(1);
      setType(evtType);
   };
   const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
   const typeList = new Set(data?.events.map((event) => event.type));
   return (
      <>
         {error && <div>An error occured</div>}
         {data === null ? (
            "loading"
         ) : (
            <>
               <h3 className="SelectTitle">Catégories</h3>
               <Select
                  selection={Array.from(typeList)}
                  onChange={(value) => (value ? changeType(value) : changeType(null))}
               />
               <div id="events" className="ListContainer">
                  {filteredEvents.map((event) => (
                     <Modal key={event.id} Content={<ModalEvent event={event} />}>
                        {({ setIsOpened }) => (
                           <EventCard
                              onClick={() => setIsOpened(true)}
                              imageSrc={event.cover}
                              title={event.title}
                              date={new Date(event.date)}
                              label={event.type}
                              data-testid="event-card"
                           />
                        )}
                     </Modal>
                  ))}
               </div>
               <div className="Pagination">
                  {[...Array(pageNumber || 0)].map((_, n) => (
                     // eslint-disable-next-line react/no-array-index-key
                     <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                        {n + 1}
                     </a>
                  ))}
               </div>
            </>
         )}
      </>
   );
};

export default EventList;

