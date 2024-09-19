import { useEffect, useState } from "react";

import Sidebar from "../layout/Sidebar";
import MessageSidebar from "@/components/MessageSidebar";
import Conversation from "@/pages/Conversation";

const MessagesPage = () => {
  const [reservationId, setReservationId] = useState<string | undefined>();
  const [clientName, setClientName] = useState("");
  const [isConversationClosed, setIsConversationClosed] = useState(false);
  const [endsAt, setEndsAt] = useState<Date>();
  return (
    <Sidebar>
      <MessageSidebar
        setReservationId={setReservationId}
        setClientName={setClientName}
        setIsConversationClosed={setIsConversationClosed}
        setEndsAt={setEndsAt}
      >
        <>
          {reservationId && (
            <Conversation
              reservationId={reservationId}
              clientName={clientName}
              isConversationClosed={isConversationClosed}
              endsAt={endsAt}
            />
          )}
        </>
      </MessageSidebar>
    </Sidebar>
  );
};

export default MessagesPage;
