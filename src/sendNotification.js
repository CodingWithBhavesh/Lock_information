import { onMessage } from "firebase/messaging";

useEffect(() => {
  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    alert(payload.notification.body);
  });
}, []);
